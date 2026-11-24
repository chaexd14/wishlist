create extension if not exists pgcrypto;

create table if not exists public.gifts (
  id text primary key,
  title text not null,
  category text not null,
  description text not null,
  details text[] not null default '{}',
  availability text not null check (availability in ('available', 'limited', 'planned')),
  customizable boolean not null default false,
  max_quantity integer not null check (max_quantity between 1 and 99),
  doodle text not null,
  tone text not null,
  gallery jsonb not null default '[]'::jsonb,
  is_sample boolean not null default true,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gift_option_groups (
  id uuid primary key default gen_random_uuid(),
  gift_id text not null references public.gifts(id) on delete cascade,
  key text not null,
  label text not null,
  required boolean not null default true,
  sort_order integer not null default 0,
  unique (gift_id, key)
);

create table if not exists public.gift_option_values (
  id uuid primary key default gen_random_uuid(),
  option_group_id uuid not null references public.gift_option_groups(id) on delete cascade,
  value text not null,
  label text not null,
  swatch text,
  available boolean not null default true,
  sort_order integer not null default 0,
  unique (option_group_id, value)
);

create table if not exists public.gift_customization_fields (
  id uuid primary key default gen_random_uuid(),
  gift_id text not null references public.gifts(id) on delete cascade,
  key text not null,
  label text not null,
  hint text not null default '',
  placeholder text not null default '',
  required boolean not null default false,
  max_length integer not null check (max_length between 1 and 500),
  sort_order integer not null default 0,
  unique (gift_id, key)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  public_reference text not null unique,
  recipient_email text,
  recipient_note text,
  item_count integer not null check (item_count > 0),
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'purchased', 'gifted')),
  created_at timestamptz not null default now()
);

create table if not exists public.submission_items (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete restrict,
  gift_id text references public.gifts(id) on delete set null,
  quantity integer not null check (quantity > 0),
  snapshot jsonb not null,
  purchase_status text not null default 'pending' check (purchase_status in ('pending', 'purchased', 'gifted')),
  created_at timestamptz not null default now()
);

create index if not exists submission_items_submission_id_idx on public.submission_items(submission_id);
create index if not exists gift_option_groups_gift_id_idx on public.gift_option_groups(gift_id);
create index if not exists gift_customization_fields_gift_id_idx on public.gift_customization_fields(gift_id);

-- The server-only secret/service-role client maintains the catalog and reads
-- submitted wishes. RLS still blocks browser roles from these tables.
grant select, insert, update, delete on table
  public.gifts,
  public.gift_option_groups,
  public.gift_option_values,
  public.gift_customization_fields,
  public.submissions,
  public.submission_items
to service_role;

create or replace function public.protect_submission_item_snapshot()
returns trigger
language plpgsql
as $$
begin
  if old.submission_id is distinct from new.submission_id
    or old.gift_id is distinct from new.gift_id
    or old.quantity is distinct from new.quantity
    or old.snapshot is distinct from new.snapshot
    or old.created_at is distinct from new.created_at then
    raise exception 'Submitted gift snapshots are immutable';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_submission_item_snapshot on public.submission_items;
create trigger protect_submission_item_snapshot
before update on public.submission_items
for each row execute function public.protect_submission_item_snapshot();

create or replace function public.submit_wishlist(p_payload jsonb)
returns table(submission_id uuid, public_reference text)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_items jsonb;
  v_item jsonb;
  v_gift public.gifts%rowtype;
  v_group record;
  v_field record;
  v_quantity integer;
  v_total integer;
  v_selected text;
  v_custom text;
  v_submission_id uuid := gen_random_uuid();
  v_reference text := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
  v_selection_snapshot jsonb;
  v_customization_snapshot jsonb;
begin
  if jsonb_typeof(p_payload) <> 'object' then
    raise exception 'The wishlist payload is invalid';
  end if;

  v_items := p_payload -> 'items';
  if jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
    raise exception 'Choose at least one gift before submitting';
  end if;
  if jsonb_array_length(v_items) > 50 then
    raise exception 'This wishlist contains too many items';
  end if;

  for v_item in select value from jsonb_array_elements(v_items)
  loop
    if jsonb_typeof(v_item) <> 'object' then raise exception 'A wishlist item is invalid'; end if;
    select * into v_gift from public.gifts where id = v_item ->> 'giftId' and active = true;
    if not found then raise exception 'A selected gift is no longer available'; end if;
    if v_gift.availability = 'planned' then raise exception '% cannot be selected yet', v_gift.title; end if;

    begin v_quantity := (v_item ->> 'quantity')::integer;
    exception when others then raise exception 'The quantity for % is invalid', v_gift.title;
    end;
    if v_quantity < 1 then raise exception 'The quantity for % must be at least one', v_gift.title; end if;

    select coalesce(sum((entry ->> 'quantity')::integer), 0) into v_total
    from jsonb_array_elements(v_items) entry
    where entry ->> 'giftId' = v_gift.id;
    if v_total > v_gift.max_quantity then
      raise exception '% allows a maximum quantity of %', v_gift.title, v_gift.max_quantity;
    end if;

    if jsonb_typeof(coalesce(v_item -> 'selections', '{}'::jsonb)) <> 'object'
      or jsonb_typeof(coalesce(v_item -> 'customizations', '{}'::jsonb)) <> 'object' then
      raise exception 'The choices for % are invalid', v_gift.title;
    end if;

    for v_group in select * from public.gift_option_groups where gift_id = v_gift.id order by sort_order
    loop
      v_selected := nullif(trim(coalesce(v_item -> 'selections' ->> v_group.key, '')), '');
      if v_group.required and v_selected is null then raise exception 'Choose % for %', v_group.label, v_gift.title; end if;
      if v_selected is not null and not exists (
        select 1 from public.gift_option_values
        where option_group_id = v_group.id and value = v_selected and available = true
      ) then raise exception 'The selected % for % is unavailable', v_group.label, v_gift.title;
      end if;
    end loop;

    if exists (
      select 1 from jsonb_object_keys(coalesce(v_item -> 'selections', '{}'::jsonb)) selected_key
      where not exists (select 1 from public.gift_option_groups where gift_id = v_gift.id and key = selected_key)
    ) then raise exception 'An unknown option was submitted for %', v_gift.title;
    end if;

    for v_field in select * from public.gift_customization_fields where gift_id = v_gift.id order by sort_order
    loop
      v_custom := trim(coalesce(v_item -> 'customizations' ->> v_field.key, ''));
      if v_field.required and v_custom = '' then raise exception 'Add % for %', v_field.label, v_gift.title; end if;
      if length(v_custom) > v_field.max_length then raise exception '% for % is too long', v_field.label, v_gift.title; end if;
    end loop;

    if exists (
      select 1 from jsonb_object_keys(coalesce(v_item -> 'customizations', '{}'::jsonb)) custom_key
      where not exists (select 1 from public.gift_customization_fields where gift_id = v_gift.id and key = custom_key)
    ) then raise exception 'An unknown customization was submitted for %', v_gift.title;
    end if;
  end loop;

  insert into public.submissions (id, public_reference, recipient_email, recipient_note, item_count)
  values (
    v_submission_id,
    v_reference,
    nullif(trim(p_payload ->> 'email'), ''),
    nullif(trim(p_payload ->> 'note'), ''),
    (select sum((entry ->> 'quantity')::integer) from jsonb_array_elements(v_items) entry)
  );

  for v_item in select value from jsonb_array_elements(v_items)
  loop
    select * into v_gift from public.gifts where id = v_item ->> 'giftId';
    v_quantity := (v_item ->> 'quantity')::integer;

    select coalesce(jsonb_object_agg(g.label, ov.label), '{}'::jsonb)
      into v_selection_snapshot
    from public.gift_option_groups g
    join public.gift_option_values ov on ov.option_group_id = g.id
      and ov.value = v_item -> 'selections' ->> g.key
    where g.gift_id = v_gift.id;

    select coalesce(jsonb_object_agg(f.label, trim(v_item -> 'customizations' ->> f.key))
      filter (where trim(coalesce(v_item -> 'customizations' ->> f.key, '')) <> ''), '{}'::jsonb)
      into v_customization_snapshot
    from public.gift_customization_fields f
    where f.gift_id = v_gift.id;

    insert into public.submission_items (submission_id, gift_id, quantity, snapshot)
    values (v_submission_id, v_gift.id, v_quantity, jsonb_build_object(
      'giftId', v_gift.id,
      'title', v_gift.title,
      'category', v_gift.category,
      'description', v_gift.description,
      'availability', v_gift.availability,
      'selections', v_selection_snapshot,
      'customizations', v_customization_snapshot,
      'submittedAt', now()
    ));
  end loop;

  return query select v_submission_id, v_reference;
end;
$$;

revoke all on function public.submit_wishlist(jsonb) from public, anon, authenticated;
grant execute on function public.submit_wishlist(jsonb) to service_role;

alter table public.gifts enable row level security;
alter table public.gift_option_groups enable row level security;
alter table public.gift_option_values enable row level security;
alter table public.gift_customization_fields enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_items enable row level security;
