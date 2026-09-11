import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "si", "ta"],
  defaultLocale: "en",
  // English stays un-prefixed (matches existing URLs/SEO); Sinhala and
  // Tamil get a /si or /ta prefix.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
