import { Doodle } from "@plop-ui/react";
import { Suspense } from "react";

import { JournalButtonLink, JournalHeading, JournalPageTransition, JournalSheet, JournalTag } from "@/components/journal";
import { ConfirmationSkeleton } from "@/components/storefront/confirmation-skeleton";
import { getSubmissionConfirmation } from "@/data/submission-repository";

type ConfirmationPageProps = { params: Promise<{ submissionId: string }> };

function ConfirmationRecovery({ unavailable = false }: { unavailable?: boolean }) {
  return (
    <JournalSheet tape="mustard" spacing="roomy" className="confirmation-state">
      <Doodle kind="heart" tone="mustard" size={76} />
      <JournalHeading level={1} size="section">{unavailable ? "Your keepsake note needs a tiny moment" : "I couldn't find that keepsake note"}</JournalHeading>
      <p>{unavailable ? "Don't worry—your wishes are likely already safe with me. Try refreshing in a second." : "The link might be missing a piece, but don't worry—your list is still safe."}</p>
      <div className="confirmation-actions">
        {unavailable && <JournalButtonLink href="">Try again</JournalButtonLink>}
        <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]}>Return to the gift journal</JournalButtonLink>
      </div>
    </JournalSheet>
  );
}

async function ConfirmationLetter({ params }: ConfirmationPageProps) {
  const { submissionId } = await params;
  let submission;
  try { submission = await getSubmissionConfirmation(submissionId); }
  catch { return <ConfirmationRecovery unavailable />; }
  if (!submission) return <ConfirmationRecovery />;

  const submittedDate = new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(submission.created_at));
  return (
    <article className="confirmation-letter" aria-labelledby="confirmation-title">
      <div className="confirmation-letter__hero">
        <Doodle kind="heart" tone="bubblegum" size={88} />
        <JournalTag tone="mint">Wishes safely with me</JournalTag>
        <JournalHeading id="confirmation-title" level={1} size="page">Your wish is my command</JournalHeading>
        <p>I&apos;ve tucked away every color, size, and sweet little detail—now leave the rest to me!</p>
      </div>

      <JournalSheet tape="bubblegum" spacing="roomy" className="confirmation-letter__paper">
        <header className="confirmation-letter__meta">
          <div><span>Keepsake code</span><strong>{submission.public_reference}</strong></div>
          <div><span>Sent on</span><strong>{submittedDate}</strong></div>
          <div><span>Gifts picked</span><strong>{submission.item_count}</strong></div>
        </header>
        <div className="confirmation-letter__salutation">
          <p>To my favorite person,</p>
          <p>Here are all the wishes you picked! Consider this my little promise to get every detail just right for you.</p>
        </div>
        <ol className="confirmation-gifts">
          {submission.submission_items.map((item, index) => {
            const choices = Object.entries(item.snapshot.selections);
            const customizations = Object.entries(item.snapshot.customizations);
            return (
              <li key={item.id} className="confirmation-gift">
                <span className="confirmation-gift__number" aria-hidden="true">{index + 1}</span>
                <div className="confirmation-gift__content">
                  <div className="confirmation-gift__title">
                    <div><span>{item.snapshot.category}</span><h2>{item.snapshot.title}</h2></div>
                    <JournalTag tone="periwinkle">Qty {item.quantity}</JournalTag>
                  </div>
                  <p>{item.snapshot.description}</p>
                  {(choices.length > 0 || customizations.length > 0) && <dl>
                    {choices.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                    {customizations.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>}
                </div>
              </li>
            );
          })}
        </ol>
        {submission.recipient_note && <blockquote className="confirmation-letter__note"><span>Your note</span><p>“{submission.recipient_note}”</p></blockquote>}
        <footer className="confirmation-letter__footer">
          <div><strong>Your keepsake code: {submission.public_reference}</strong><span>Save this page anytime if you want to look back at your favorite picks.</span></div>
          <JournalButtonLink href="/gifts" transitionTypes={["page-turn-back"]}>Back to the gift journal</JournalButtonLink>
        </footer>
      </JournalSheet>
    </article>
  );
}

export default function ConfirmationPage({ params }: ConfirmationPageProps) {
  return <JournalPageTransition><main className="journal-container confirmation-page"><Suspense fallback={<ConfirmationSkeleton />}><ConfirmationLetter params={params} /></Suspense></main></JournalPageTransition>;
}
