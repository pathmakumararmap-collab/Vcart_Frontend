"use client";

import { CategoryCard } from "@/components/storefront/category-card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { useCategories } from "@/hooks/use-products";
import { Shapes } from "lucide-react";

export function CategoriesContent() {
  const { data: categories, isLoading, isError, refetch } = useCategories();

  return (
    <div className="container-page py-12">
      <div className="mb-10 space-y-1.5">
        <p className="text-eyebrow text-primary">Browse</p>
        <h1 className="text-display text-2xl sm:text-3xl">All categories</h1>
        <p className="text-muted-foreground text-pretty">Browse our full range of product categories.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center gap-1.5">
              <Skeleton className="size-[96.95px] rounded-2xl lg:size-[140px]" />
              <Skeleton className="h-2.5 w-14 rounded-full" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : !categories?.length ? (
        <EmptyState icon={Shapes} title="No categories yet" />
      ) : (
        <div className="grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}