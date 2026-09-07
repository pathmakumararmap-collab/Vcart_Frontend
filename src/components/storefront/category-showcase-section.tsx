"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useProducts } from "@/hooks/use-products";
import type { Category } from "@/types/catalog";

function CategoryShowcaseCard({ category }: { category: Category }) {
  const { data, isLoading } = useProducts({ category_id: category.id, per_page: 4 });
  const products = data?.data ?? [];

  return (
    <div className="bg-card border-border/60 shadow-luxury-sm flex flex-col rounded-2xl border p-4">
      <p className="mb-3 text-sm font-semibold">{category.name}</p>

      <div className="grid grid-cols-2 gap-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-lg" />
            ))
          : Array.from({ length: 4 }).map((_, index) => {
              const product = products[index];
              const image = product?.images?.find((img) => img.is_primary) ?? product?.images?.[0];

              return (
                <div key={index} className="bg-muted relative aspect-square overflow-hidden rounded-lg">
                  {image?.url && (
                    <Image
                      src={image.url}
                      alt={product?.name ?? category.name}
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  )}
                </div>
              );
            })}
      </div>

      <Link
        href={`/products?category=${category.id}`}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#FB6C00] hover:underline"
      >
        See more
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

export function CategoryShowcaseSection() {
  const { data: categories, isLoading } = useCategories();
  const topCategories = (categories ?? []).slice(0, 4);

  if (!isLoading && topCategories.length === 0) return null;

  return (
    <section className="container-page hidden pt-2 sm:pt-4 md:block">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card border-border/60 rounded-2xl border p-4">
                <Skeleton className="mb-3 h-4 w-24" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 4 }).map((_, tileIndex) => (
                    <Skeleton key={tileIndex} className="aspect-square rounded-lg" />
                  ))}
                </div>
              </div>
            ))
          : topCategories.map((category) => (
              <CategoryShowcaseCard key={category.id} category={category} />
            ))}
      </div>
    </section>
  );
}