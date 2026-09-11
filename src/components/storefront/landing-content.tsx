"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { HeroSection } from "@/components/storefront/hero-section";
import { CategoryShowcaseSection } from "@/components/storefront/category-showcase-section";
import { BrandMarqueeSection } from "@/components/storefront/brand-marquee-section";
import { FlashSaleBanner } from "@/components/storefront/flash-sale-banner";
import { FlashSaleSection } from "@/components/storefront/flash-sale-section";
import { CategoryCard } from "@/components/storefront/category-card";
import { DesktopCategorySection } from "@/components/storefront/desktop-category-section";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { useCategories, useProducts } from "@/hooks/use-products";

export function LandingContent() {
  const t = useTranslations("Home");
  const tCommon = useTranslations("Common");
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: featured, isLoading: featuredLoading } = useProducts({
    is_featured: true,
    per_page: 8,
  });
  const { data: latest, isLoading: latestLoading } = useProducts({
    sort: "latest",
    per_page: 8,
  });

  return (
    <div>
      <HeroSection />

      <CategoryShowcaseSection />

      <div className="bg-neutral-100 pb-20">
        <FlashSaleBanner />

        <FlashSaleSection />

        <section className="container-page pt-4 pb-14 sm:pt-6 sm:pb-16">
          <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
            <div className="space-y-1.5">
              <p className="text-eyebrow text-primary hidden sm:block">{t("explore")}</p>
              <h2 className="text-display text-2xl sm:text-3xl">{t("shopByCategory")}</h2>
              <p className="text-muted-foreground hidden text-sm sm:block">
                {t("exploreCollections")}
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/categories">
                {tCommon("viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          {categoriesLoading ? (
            <>
              <div className="grid auto-cols-[33.333%] grid-flow-col grid-rows-2 gap-x-2 gap-y-4 overflow-hidden pb-1 md:hidden">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center gap-1.5">
                    <Skeleton className="size-14 rounded-full" />
                    <Skeleton className="h-2.5 w-12 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="hidden space-y-4 md:block">
                <div className="grid grid-cols-4 gap-4 lg:grid-cols-8">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 rounded-2xl" />
                  ))}
                </div>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <Skeleton className="h-48 flex-1 rounded-2xl" />
                  <Skeleton className="h-48 flex-1 rounded-2xl" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Mobile/tablet: 4-per-row, 2-row grid — extra categories scroll in as more columns */}
              <div className="grid auto-cols-[33.333%] grid-flow-col grid-rows-2 gap-x-2 gap-y-4 overflow-x-auto pb-1 md:hidden">
                {(categories ?? []).slice(0, 16).map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>

              {/* Desktop: icon-card row + promo banners */}
              <DesktopCategorySection categories={categories ?? []} />
            </>
          )}
        </section>

        <BrandMarqueeSection />

        <section className="container-page border-t border-border/60 py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-eyebrow text-primary">{t("curated")}</p>
              <h2 className="text-display text-2xl sm:text-3xl">{t("featuredProducts")}</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products?featured=1">
                {tCommon("viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={featured?.data ?? []} isLoading={featuredLoading} />
        </section>

        <section className="container-page border-t border-border/60 py-14 sm:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div className="space-y-1.5">
              <p className="text-eyebrow text-primary">{t("justIn")}</p>
              <h2 className="text-display text-2xl sm:text-3xl">{t("newArrivals")}</h2>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/products">
                {tCommon("viewAll")}
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <ProductGrid products={latest?.data ?? []} isLoading={latestLoading} />
        </section>
      </div>
    </div>
  );
}