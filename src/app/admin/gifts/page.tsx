import Link from "next/link";

import { JournalButtonLink, JournalHeading, JournalTag } from "@/components/journal";
import { archiveGift } from "@/app/admin/actions";
import { getAdminGifts } from "@/data/admin-repository";

export default async function AdminGiftsPage() {
  const gifts = await getAdminGifts();
  return <main className="admin-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Catalog</span><JournalHeading level={1} size="section">Manage gifts</JournalHeading><p>Order, update, or archive everything she can choose.</p></div><JournalButtonLink href="/admin/gifts/new">Add a gift</JournalButtonLink></div><div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Gift</th><th>Status</th><th>Limit</th><th>Order</th><th>Visibility</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{gifts.map((gift) => <tr key={gift.id}><td><Link href={`/admin/gifts/${gift.id}/edit`}><strong>{gift.title}</strong><span>{gift.category}</span></Link></td><td><JournalTag tone={gift.availability === "available" ? "mint" : gift.availability === "limited" ? "mustard" : "periwinkle"}>{gift.availability}</JournalTag></td><td>{gift.max_quantity}</td><td>{gift.sort_order}</td><td>{gift.active ? "Published" : "Archived"}</td><td>{gift.active && <form action={archiveGift}><input type="hidden" name="id" value={gift.id} /><button className="admin-text-button" type="submit">Archive</button></form>}</td></tr>)}</tbody></table></div></main>;
}
