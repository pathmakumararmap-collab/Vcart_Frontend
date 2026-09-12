import type { Metadata } from "next";

import { TermsContent } from "@/components/storefront/terms-content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms and conditions that apply when you use our website or place an order.",
};

export default function TermsPage() {
  return <TermsContent />;
}
