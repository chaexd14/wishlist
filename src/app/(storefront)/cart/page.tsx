import { CartExperience } from "@/components/cart/cart-experience";
import { JournalContainer, JournalPageTransition } from "@/components/journal";

export default function CartPage() {
  return (
    <JournalPageTransition>
      <main className="cart-page">
        <JournalContainer width="full">
          <CartExperience />
        </JournalContainer>
      </main>
    </JournalPageTransition>
  );
}
