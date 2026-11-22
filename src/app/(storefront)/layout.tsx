import { Suspense, type ReactNode } from "react";

import { StorefrontHeader } from "@/components/storefront/storefront-header";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <StorefrontHeader />
      </Suspense>
      {children}
    </>
  );
}
