"use client";

import * as React from "react";
import { Home, Menu, Heart, ShoppingCart, User } from "lucide-react";

import { Link, usePathname } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useUiStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { MobileProfileSheet } from "@/components/storefront/mobile-profile-sheet";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: cart } = useCart();
  const { count: wishlistCount } = useWishlist();
  const setMobileNavOpen = useUiStore((state) => state.setMobileNavOpen);
  const setCartOpen = useUiStore((state) => state.setCartOpen);
  const [profileOpen, setProfileOpen] = React.useState(false);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const isHome = pathname === "/";

  return (
    <>
      <nav className="bg-background border-border/60 fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t px-2 py-2 md:hidden">
        <Link
          href="/"
          aria-label="Home"
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            isHome ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="size-6" strokeWidth={isHome ? 2.5 : 2} />
        </Link>

        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Menu"
          className="text-muted-foreground flex size-11 items-center justify-center rounded-full"
        >
          <Menu className="size-6" />
        </button>

        <Link
          href="/wishlist"
          aria-label="Wishlist"
          className="text-muted-foreground relative flex size-11 items-center justify-center rounded-full"
        >
          <Heart className="size-6" />
          {wishlistCount > 0 && (
            <Badge className="bg-gradient-gold text-accent-foreground absolute top-0.5 right-0.5 h-4.5 min-w-4.5 justify-center rounded-full border-0 px-1 text-[10px] shadow-sm">
              {wishlistCount}
            </Badge>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label="Cart"
          className="text-muted-foreground relative flex size-11 items-center justify-center rounded-full"
        >
          <ShoppingCart className="size-6" />
          {cartCount > 0 && (
            <Badge className="bg-gradient-gold text-accent-foreground absolute top-0.5 right-0.5 h-4.5 min-w-4.5 justify-center rounded-full border-0 px-1 text-[10px] shadow-sm">
              {cartCount}
            </Badge>
          )}
        </button>

        <button
          type="button"
          onClick={() => setProfileOpen(true)}
          aria-label="Profile"
          className="text-muted-foreground flex size-11 items-center justify-center rounded-full"
        >
          <User className="size-6" />
        </button>
      </nav>

           <MobileProfileSheet open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}