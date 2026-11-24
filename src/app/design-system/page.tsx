import { ComponentGallery } from "@/components/journal/component-gallery";
import { JournalContainer, JournalPageTransition } from "@/components/journal";
import { notFound } from "next/navigation";

import { getAdminUser } from "@/lib/auth/admin";

export const instant = false;

export default async function DesignSystemPage() {
  if (process.env.NODE_ENV === "production" && !(await getAdminUser())) notFound();
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
