"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  BookOpen,
  Dumbbell,
  Laptop2,
  Popcorn,
  Shapes,
  Shirt,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
} from "lucide-react";

import { useCategories } from "@/hooks/use-products";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/catalog";

const CATEGORY_ICON_RULES: { match: RegExp; icon: React.ComponentType<{ className?: string }> }[] = [
  { match: /mobile|phone|accessor/i, icon: Smartphone },
  { match: /electronic|device|gadget/i, icon: Laptop2 },
  { match: /fashion|apparel|cloth/i, icon: Shirt },
  { match: /beauty|health|cosmetic/i, icon: Sparkles },
  { match: /home|living|furniture|kitchen/i, icon: Sofa },
  { match: /book/i, icon: BookOpen },
  { match: /sport|outdoor|fitness|gym/i, icon: Dumbbell },
  { match: /grocery|groceries|food|essential/i, icon: ShoppingCart },
  { match: /baby|kid|toy/i, icon: Baby },
  { match: /snack|beverage/i, icon: Popcorn },
];

export function iconForCategory(name: string) {
  return CATEGORY_ICON_RULES.find((rule) => rule.match.test(name))?.icon ?? Shapes;
}

function CategorySidebar({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-card border-border/60 shadow-luxury-sm hidden w-64 shrink-0 flex-col overflow-hidden rounded-2xl border md:flex">
      {categories.slice(0, 8).map((category) => {
        const Icon = iconForCategory(category.name);
        return (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className="hover:bg-muted border-border/40 text-foreground flex items-center gap-3 border-b px-4 py-3 text-sm transition-colors last:border-b-0"
          >
            <Icon className="text-muted-foreground size-4 shrink-0" />
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}

// Drop real banner photos into /public/images/ with these filenames (or
// change the paths below) to replace the desktop hero banner images.
const DESKTOP_HERO_SLIDES = [
  { src: "/images/hero-banner-1.png", alt: "Shop smarter, live better" },
  { src: "/images/hero-banner-2.png", alt: "New arrivals every week" },
  { src: "/images/hero-banner-3.png", alt: "Island-wide delivery" },
];

// Drop real banner photos into /public/images/ with these filenames (or
// change the paths below) to replace the mobile hero slider images.
const MOBILE_HERO_SLIDES = [
  { src: "/images/hero-slide-1.png", alt: "New arrivals" },
  { src: "/images/hero-slide-2.png", alt: "Island-wide delivery" },
  { src: "/images/hero-slide-3.png", alt: "Secure checkout" },
];

const AUTO_ADVANCE_MS = 4000;
const SWIPE_THRESHOLD_PX = 40;

function useAutoAdvance(length: number, intervalMs: number) {
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((index) => (index + 1) % length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [length, intervalMs]);

  return [activeIndex, setActiveIndex] as const;
}

function MobileHeroSlider() {
  const [activeIndex, setActiveIndex] = useAutoAdvance(MOBILE_HERO_SLIDES.length, AUTO_ADVANCE_MS);
  const touchStartX = React.useRef<number | null>(null);

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX.current;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD_PX) {
      setActiveIndex((index) => {
        const direction = deltaX < 0 ? 1 : -1;
        return (index + direction + MOBILE_HERO_SLIDES.length) % MOBILE_HERO_SLIDES.length;
      });
    }
    touchStartX.current = null;
  }

  return (
    <div className="md:hidden">
      <div
        className="border-border/60 shadow-luxury-sm relative aspect-[16/6] w-full overflow-hidden rounded-2xl border"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={MOBILE_HERO_SLIDES[activeIndex].src}
              alt={MOBILE_HERO_SLIDES[activeIndex].alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
          {MOBILE_HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "h-1.5 rounded-full shadow-sm transition-all",
                index === activeIndex ? "bg-white w-6" : "bg-white/60 w-1.5"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  const { data: categories } = useCategories();
  const [activeSlide, setActiveSlide] = useAutoAdvance(DESKTOP_HERO_SLIDES.length, AUTO_ADVANCE_MS);

  return (
    <section className="relative overflow-hidden bg-white md:bg-[#133458]">
      <div className="container-page py-6 md:py-10">
        <MobileHeroSlider />

        <div className="hidden gap-6 md:flex">
          <CategorySidebar categories={categories ?? []} />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="border-border/60 shadow-luxury-sm relative min-h-[420px] flex-1 overflow-hidden rounded-2xl border"
          >
            {/* Drop real lifestyle/banner photos at these paths (any aspect
                ratio — each fills the banner via object-cover). */}
            <AnimatePresence initial={false}>
              <motion.div
                key={activeSlide}
                initial={{ x: "100%" }}
                animate={{ x: "0%" }}
                exit={{ x: "-100%" }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={DESKTOP_HERO_SLIDES[activeSlide].src}
                  alt={DESKTOP_HERO_SLIDES[activeSlide].alt}
                  fill
                  sizes="(min-width: 768px) 70vw, 100vw"
                  className="object-cover"
                  priority={activeSlide === 0}
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute right-6 bottom-6 flex items-center gap-1.5">
              {DESKTOP_HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Show slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                  className={cn(
                    "h-1.5 rounded-full shadow-sm transition-all",
                    index === activeSlide ? "bg-white w-6" : "bg-white/50 w-1.5"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}