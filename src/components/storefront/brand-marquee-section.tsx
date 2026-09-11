"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useBrands } from "@/hooks/use-products";
import type { Brand } from "@/types/catalog";

function BrandChip({ brand }: { brand: Brand }) {
  return (
    <Link
      href={`/products?brand=${brand.id}`}
      className="flex shrink-0 flex-col items-center gap-2 px-4 lg:px-6"
    >
      <div className="bg-card border-border/60 shadow-luxury-sm relative size-16 shrink-0 overflow-hidden rounded-full border sm:size-20 lg:size-28">
        {brand.logo ? (
          <Image src={brand.logo} alt={brand.name} fill sizes="112px" className="object-contain p-2" />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-lg font-semibold lg:text-2xl">
            {brand.name.charAt(0)}
          </div>
        )}
      </div>
      <p className="max-w-20 truncate text-center text-xs font-medium sm:max-w-24 sm:text-sm lg:max-w-28 lg:text-base">
        {brand.name}
      </p>
    </Link>
  );
}

export function BrandMarqueeSection() {
  const t = useTranslations("Home");
  const { data: brands, isLoading } = useBrands();

  if (!isLoading && (!brands || brands.length === 0)) return null;

  // Duplicate the list so the -50% translateX loop is seamless.
  const track = brands ? [...brands, ...brands] : [];

  return (
    <section className="py-10 sm:py-14">
      <div className="container-page mb-4 sm:mb-6">
        <h2 className="text-display text-xl sm:text-2xl">{t("shopByBrand")}</h2>
      </div>

      {isLoading ? (
        <div className="container-page flex gap-6 overflow-hidden">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="bg-muted size-16 animate-pulse rounded-full sm:size-20" />
              <div className="bg-muted h-3 w-14 animate-pulse rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="container-page flex justify-center overflow-hidden">
          <div className="animate-marquee-left flex w-max">
            {track.map((brand, index) => (
              <BrandChip key={`${brand.id}-${index}`} brand={brand} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}