import Link from "next/link";

import { JournalHeading, JournalTag } from "@/components/journal";
import { getAdminSubmissions } from "@/data/admin-repository";

export default async function SubmissionsPage() {
  const submissions = await getAdminSubmissions();
  return <main className="admin-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">Purchase desk</span><JournalHeading level={1} size="section">Submitted wishlists</JournalHeading><p>Open a letter to see the exact choices and track what you have purchased.</p></div></div>{submissions.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Sent</th><th>Gifts</th><th>Progress</th><th>Status</th></tr></thead><tbody>{submissions.map((submission) => { const completed = submission.submission_items.filter((item) => item.purchase_status !== "pending").length; return <tr key={submission.id}><td><Link href={`/admin/submissions/${submission.id}`}><strong>{submission.public_reference}</strong><span>{submission.recipient_email || "No email provided"}</span></Link></td><td>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(submission.created_at))}</td><td>{submission.item_count}</td><td>{completed}/{submission.submission_items.length}</td><td><JournalTag tone={submission.status === "gifted" ? "mint" : submission.status === "purchased" ? "periwinkle" : "mustard"}>{submission.status}</JournalTag></td></tr>; })}</tbody></table></div> : <div className="admin-empty"><JournalHeading level={2} size="card">No wishlists yet</JournalHeading><p>Submitted wishlists will appear here automatically.</p></div>}</main>;
}
