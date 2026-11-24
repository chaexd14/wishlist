-- Development-only illustrative catalog. Replace these rows before sharing the birthday link.
insert into public.gifts (id, title, category, description, details, availability, customizable, max_quantity, doodle, tone, is_sample, sort_order)
values
  ('everyday-bag', 'Everyday bag', 'Accessories', 'A practical favorite with color and size choices.', array['Easy everyday shape','Room for daily essentials','Pick the color and size that feels most like you'], 'available', false, 1, 'heart', 'bubblegum', true, 10),
  ('initial-necklace', 'Initial necklace', 'Keepsakes', 'A small keepsake with a preferred finish and initial.', array['Simple initial pendant','Choose the metal finish','One-letter personalization'], 'available', true, 1, 'sparkle', 'mustard', true, 20),
  ('soft-cardigan', 'Soft cardigan', 'Cozy things', 'A cozy layer with exact color and sizing details.', array['Soft everyday layer','Relaxed, cozy silhouette','Choose the most comfortable size'], 'limited', false, 2, 'star', 'mint', true, 30),
  ('journal-set', 'Journal set', 'Creative', 'Paper, pens, and stickers for making another keepsake.', array['A journal with matching creative extras','Paper style chosen by you','Optional note written inside'], 'available', true, 2, 'burst', 'periwinkle', true, 40),
  ('photo-book', 'Photo book', 'Keepsakes', 'A customizable book for favorite memories.', array['A collection of favorite moments','Cover and page choices will be added later','Preview only while the idea is being prepared'], 'planned', true, 1, 'heart', 'tomato', true, 50),
  ('weekend-tote', 'Weekend tote', 'Accessories', 'A roomy tote with an optional embroidered name.', array['Roomy carry-all shape','Useful for weekends and busy days','Optional embroidered name'], 'available', true, 1, 'star', 'mustard', true, 60)
on conflict (id) do update set
  title = excluded.title, category = excluded.category, description = excluded.description,
  details = excluded.details, availability = excluded.availability, customizable = excluded.customizable,
  max_quantity = excluded.max_quantity, doodle = excluded.doodle, tone = excluded.tone,
  is_sample = excluded.is_sample, sort_order = excluded.sort_order, updated_at = now();

delete from public.gift_option_groups where gift_id in ('everyday-bag','initial-necklace','soft-cardigan','journal-set','photo-book','weekend-tote');
delete from public.gift_customization_fields where gift_id in ('everyday-bag','initial-necklace','soft-cardigan','journal-set','photo-book','weekend-tote');

insert into public.gift_option_groups (gift_id, key, label, sort_order) values
  ('everyday-bag', 'color', 'Color', 10), ('everyday-bag', 'size', 'Size', 20),
  ('initial-necklace', 'finish', 'Finish', 10),
  ('soft-cardigan', 'color', 'Color', 10), ('soft-cardigan', 'size', 'Size', 20),
  ('journal-set', 'cover', 'Cover color', 10), ('journal-set', 'paper', 'Paper', 20),
  ('weekend-tote', 'color', 'Color', 10);

insert into public.gift_option_values (option_group_id, value, label, swatch, sort_order)
select g.id, v.value, v.label, v.swatch, v.sort_order
from public.gift_option_groups g
join (values
  ('everyday-bag','color','mocha','Mocha','#8a6048',10), ('everyday-bag','color','rose','Rose','#d58b8b',20), ('everyday-bag','color','black','Black','#34221c',30),
  ('everyday-bag','size','mini','Mini',null,10), ('everyday-bag','size','regular','Regular',null,20),
  ('initial-necklace','finish','gold','Gold',null,10), ('initial-necklace','finish','silver','Silver',null,20), ('initial-necklace','finish','rose-gold','Rose gold',null,30),
  ('soft-cardigan','color','cream','Cream','#fff8e8',10), ('soft-cardigan','color','cocoa','Cocoa','#68493d',20), ('soft-cardigan','color','dusty-rose','Dusty rose','#d58b8b',30),
  ('soft-cardigan','size','xs','XS',null,10), ('soft-cardigan','size','s','S',null,20), ('soft-cardigan','size','m','M',null,30), ('soft-cardigan','size','l','L',null,40), ('soft-cardigan','size','xl','XL',null,50),
  ('journal-set','cover','coffee','Coffee',null,10), ('journal-set','cover','pink','Pink',null,20), ('journal-set','cover','purple','Purple',null,30), ('journal-set','cover','sky','Sky',null,40),
  ('journal-set','paper','lined','Lined',null,10), ('journal-set','paper','dotted','Dotted',null,20), ('journal-set','paper','blank','Blank',null,30),
  ('weekend-tote','color','natural','Natural',null,10), ('weekend-tote','color','espresso','Espresso',null,20), ('weekend-tote','color','rose','Rose',null,30)
) as v(gift_id, group_key, value, label, swatch, sort_order)
  on g.gift_id = v.gift_id and g.key = v.group_key;

insert into public.gift_customization_fields (gift_id, key, label, hint, placeholder, required, max_length, sort_order) values
  ('initial-necklace', 'initial', 'Initial', 'One letter for the pendant.', 'e.g. A', true, 1, 10),
  ('journal-set', 'inscription', 'Inside inscription', 'Optional, up to 60 characters.', 'A short note for the first page', false, 60, 10),
  ('weekend-tote', 'embroidered-name', 'Embroidered name', 'Optional, up to 20 characters.', 'Name or nickname', false, 20, 10);
