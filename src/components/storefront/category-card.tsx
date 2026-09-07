import Image from "next/image";
import Link from "next/link";

import { iconForCategory } from "@/components/storefront/hero-section";
import type { Category } from "@/types/catalog";

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconForCategory(category.name);

  return (
    <Link href={`/products?category=${category.id}`} className="flex flex-col items-center gap-1 text-center">
      <div className="bg-muted relative size-[96.95px] shrink-0 overflow-hidden rounded-2xl lg:size-[140px]">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 140px, 97px"
            className="object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <Icon className="size-9 lg:size-12" />
          </div>
        )}
      </div>
      <p className="line-clamp-1 w-full text-[11px] font-medium lg:text-sm">{category.name}</p>
      {typeof category.products_count === "number" && (
        <p className="text-muted-foreground text-[10px] lg:text-xs">
          {category.products_count}+ Products
        </p>
      )}
    </Link>
  );
}