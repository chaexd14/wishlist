import { ComponentGallery } from "@/components/journal/component-gallery";
import { JournalContainer, JournalPageTransition } from "@/components/journal";

export default function DesignSystemPage() {
  return (
    <JournalPageTransition>
      <main className="gallery-page">
        <JournalContainer>
          <ComponentGallery />
        </JournalContainer>
      </main>
    </JournalPageTransition>
  );
}
