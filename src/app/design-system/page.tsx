import { ComponentGallery } from "@/components/journal/component-gallery";
import { JournalContainer } from "@/components/journal";

export default function DesignSystemPage() {
  return (
    <main className="gallery-page">
      <JournalContainer>
        <ComponentGallery />
      </JournalContainer>
    </main>
  );
}
