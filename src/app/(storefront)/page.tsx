import { JournalContainer, JournalPageTransition } from "@/components/journal";
import { WelcomeExperience } from "@/components/welcome/welcome-experience";
import { welcomeLetter } from "@/content/welcome-letter";

export default function HomePage() {
  return (
    <JournalPageTransition>
      <main className="welcome-page">
        <JournalContainer>
          <WelcomeExperience content={welcomeLetter} />
        </JournalContainer>
      </main>
    </JournalPageTransition>
  );
}
