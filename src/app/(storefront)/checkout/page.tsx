import { CheckoutExperience } from "@/components/checkout/checkout-experience";
import { JournalContainer, JournalPageTransition } from "@/components/journal";

export default function CheckoutPage() {
  return (
    <JournalPageTransition>
      <main className="checkout-page">
        <JournalContainer width="full">
          <CheckoutExperience />
        </JournalContainer>
      </main>
    </JournalPageTransition>
  );
}
