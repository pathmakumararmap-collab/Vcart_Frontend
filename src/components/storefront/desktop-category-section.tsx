import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { iconForCategory } from "@/components/storefront/hero-section";
import { Link } from "@/i18n/navigation";
import type { Category } from "@/types/catalog";

// Cycled by index — gives each category card a distinct pastel accent,
// matching the reference design.
const ICON_TINTS = [
  "bg-indigo-100 text-indigo-600",
  "bg-rose-100 text-rose-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-lime-100 text-lime-700",
  "bg-sky-100 text-sky-600",
  "bg-amber-100 text-amber-700",
];

function CategoryIconCard({ category, index }: { category: Category; index: number }) {
  const Icon = iconForCategory(category.name);

  return (
    <Link
      href={`/products?category=${category.id}`}
      className="hover-lift-sm bg-card border-border/60 shadow-luxury-sm flex flex-col items-center gap-3 rounded-2xl border p-5"
    >
      <span
        className={`flex size-12 items-center justify-center rounded-full ${ICON_TINTS[index % ICON_TINTS.length]}`}
      >
        <Icon className="size-6" />
      </span>
      <p className="text-sm font-medium">{category.name}</p>
    </Link>
  );
}

function PromoBanner({
  eyebrow,
  heading,
  subtitle,
  buttonLabel,
  href,
  variant,
  icon: Icon,
}: {
  eyebrow: string;
  heading: React.ReactNode;
  subtitle: string;
  buttonLabel: string;
  href: string;
  variant: "navy" | "teal";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`relative flex-1 overflow-hidden rounded-2xl p-8 ${
        variant === "navy"
          ? "bg-gradient-to-br from-[#0f1b3d] to-[#1a2a5e]"
          : "bg-gradient-to-br from-[#0d7d6f] to-[#12a894]"
      }`}
    >
      <Icon className="absolute right-8 bottom-0 size-28 text-white/15" />
      <div className="relative max-w-xs space-y-3">
        <p
          className={`text-xs font-semibold tracking-wide uppercase ${
            variant === "navy" ? "text-cyan-300" : "text-emerald-200"
          }`}
        >
          {eyebrow}
        </p>
        <h3 className="text-2xl leading-tight font-bold text-white">{heading}</h3>
        <p className="text-sm text-white/75">{subtitle}</p>
        <Button
          asChild
          className={
            variant === "navy"
              ? "bg-[#FB6C00] text-white hover:bg-[#FB6C00]/90"
              : "bg-white text-[#0d7d6f] hover:bg-white/90"
          }
        >
          <Link href={href}>{buttonLabel}</Link>
        </Button>
      </div>
    </div>
  );
}

export function DesktopCategorySection({ categories }: { categories: Category[] }) {
  const t = useTranslations("Home");
  return (
    <div className="hidden space-y-4 md:block">
      <div className="grid grid-cols-4 gap-4 lg:grid-cols-8">
        {categories.slice(0, 8).map((category, index) => (
          <CategoryIconCard key={category.id} category={category} index={index} />
        ))}
      </div>

      {/* Promo copy below is a static example — edit the text/links/icons to
          match your own current offers. */}
      <div className="flex flex-col gap-4 lg:flex-row">
        <PromoBanner
          eyebrow={t("flashOfferEyebrow")}
          heading={
            <>
              {t("mobilesPromoHeading1")}
              <br />
              {t("mobilesPromoHeading2")}
            </>
          }
          subtitle={t("mobilesPromoSubtitle")}
          buttonLabel={t("shopMobiles")}
          href="/products?category=mobiles"
          variant="navy"
          icon={iconForCategory("Mobiles")}
        />
        <PromoBanner
          eyebrow={t("newSeasonEyebrow")}
          heading={
            <>
              {t("fashionPromoHeading1")}
              <br />
              {t("fashionPromoHeading2")}
            </>
          }
          subtitle={t("fashionPromoSubtitle")}
          buttonLabel={t("exploreFashion")}
          href="/products?category=fashion"
          variant="teal"
          icon={iconForCategory("Fashion")}
        />
      </div>
    </div>
  );
}