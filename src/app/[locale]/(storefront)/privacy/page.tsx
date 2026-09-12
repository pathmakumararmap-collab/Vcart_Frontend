import type { Metadata } from "next";

import { PrivacyContent } from "@/components/storefront/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
