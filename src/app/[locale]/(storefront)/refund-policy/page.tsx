import type { Metadata } from "next";

import { RefundPolicyContent } from "@/components/storefront/refund-policy-content";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description: "When and how you can return a product or request a refund.",
};

export default function RefundPolicyPage() {
  return <RefundPolicyContent />;
}
