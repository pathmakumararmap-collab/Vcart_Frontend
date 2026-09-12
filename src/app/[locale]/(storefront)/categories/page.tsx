import type { Metadata } from "next";

import { CategoriesContent } from "@/components/storefront/categories-content";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories at Vcart.",
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
