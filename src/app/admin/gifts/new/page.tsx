import { GiftAdminForm } from "@/components/admin/gift-admin-form";
import { JournalHeading } from "@/components/journal";

export default function NewGiftPage() {
  return <main className="admin-page"><div className="admin-page-heading"><div><span className="admin-eyebrow">New catalog entry</span><JournalHeading level={1} size="section">Add a gift</JournalHeading></div></div><GiftAdminForm /></main>;
}
