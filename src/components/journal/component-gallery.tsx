import { Buddy, Callout, Doodle } from "@plop-ui/react";

import {
  JournalButton,
  JournalHeading,
  JournalSheet,
  JournalTag,
} from "@/components/journal";
import { GalleryFormDemo } from "@/components/journal/gallery-form-demo";
import { UiLabPlayground } from "@/components/journal/ui-lab-playground";

export function ComponentGallery() {
  return (
    <div className="gallery-stack">
      <JournalSheet spacing="roomy" className="gallery-intro">
        <div className="gallery-intro__copy">
          <JournalHeading level={1} size="page" writeOn={false}>
            A little journal of wishes
          </JournalHeading>
          <p className="gallery-lede">
            The shared pieces for choosing gifts, adding the tiny details, and
            sending one very important birthday note.
          </p>
          <div className="gallery-actions">
            <JournalButton intent="romantic" size="lg" buddy="peek" burst="hearts" seed="choose-gifts">
              Choose gifts
            </JournalButton>
            <JournalButton intent="quiet" seed="preview-note">
              Preview my note
            </JournalButton>
          </div>
        </div>
        <div className="gallery-intro__mark" aria-hidden="true">
          <Doodle kind="heart" tone="tomato" size={82} tilt={-8} />
          <span>for her</span>
        </div>
      </JournalSheet>

      <nav className="lab-index" aria-label="UI Lab sections">
        <a href="#buttons">Buttons</a>
        <a href="#effects">Effects</a>
        <a href="#forms-title">Forms</a>
        <a href="#navigation">Navigation</a>
        <a href="#feedback">Feedback</a>
        <a href="#journal-content">Journal pieces</a>
      </nav>

      <UiLabPlayground />

      <section className="gallery-section" aria-labelledby="actions-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="actions-title" writeOn={false}>
            Stickers that do something
          </JournalHeading>
          <p>Clear actions first, with personality saved for the moments that matter.</p>
        </div>
        <div className="gallery-button-row">
          <JournalButton intent="primary" seed="save-choice">Save choice</JournalButton>
          <JournalButton intent="romantic" seed="add-cart">Add to my list</JournalButton>
          <JournalButton intent="secondary" seed="edit-details">Edit details</JournalButton>
          <JournalButton intent="quiet" seed="go-back">Go back</JournalButton>
          <JournalButton intent="danger" seed="remove-item">Remove</JournalButton>
          <JournalButton intent="primary" loading loadingLabel="Saving your choice">Saving</JournalButton>
          <JournalButton intent="quiet" disabled>Unavailable</JournalButton>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="tags-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="tags-title" writeOn={false}>
            Little labels, useful clues
          </JournalHeading>
          <p>Variants and status stay readable without turning into decoration-only color.</p>
        </div>
        <div className="gallery-tag-row">
          <JournalTag tone="bubblegum" seed="tag-picked">picked</JournalTag>
          <JournalTag tone="mint" seed="tag-ready">available</JournalTag>
          <JournalTag tone="mustard" seed="tag-limit">only two</JournalTag>
          <JournalTag tone="periwinkle" seed="tag-custom">customizable</JournalTag>
          <JournalTag tone="tomato" seed="tag-error">needs attention</JournalTag>
        </div>
      </section>

      <section className="gallery-section" aria-labelledby="forms-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="forms-title" writeOn={false}>
            Tell me exactly what you love
          </JournalHeading>
          <p>Every field has a visible name, useful help, and a clear recovery message.</p>
        </div>
        <JournalSheet tape="bubblegum" spacing="comfortable">
          <GalleryFormDemo />
        </JournalSheet>
      </section>

      <section className="gallery-section" id="edge-states" aria-labelledby="feedback-title">
        <div className="gallery-section__heading">
          <JournalHeading level={2} id="feedback-title" writeOn={false}>
            Reassurance at every step
          </JournalHeading>
          <p>Feedback names what happened and what to do next.</p>
        </div>
        <div className="gallery-feedback-grid">
          <Callout tone="success" title="Saved in your journal">
            Your color, quantity, and customization are ready for checkout.
          </Callout>
          <Callout tone="warn" title="One detail is missing">
            Choose a color before adding this gift to your list.
          </Callout>
          <JournalSheet tape="mint" spacing="compact" className="gallery-empty-state">
            <Buddy mood="thinking" size="md" label="A thoughtful journal buddy" />
            <div>
              <JournalHeading level={3} size="card" scribble={false} writeOn={false}>
                Nothing picked yet
              </JournalHeading>
              <p>Your favorite gifts will wait here when you find them.</p>
            </div>
          </JournalSheet>
        </div>
      </section>
    </div>
  );
}
