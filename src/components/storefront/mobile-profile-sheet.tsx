"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Inbox,
  MessageCircle,
  MoreVertical,
  Repeat,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/shared/logo";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { siteConfig } from "@/lib/constants/site";

function useGreeting() {
  const [greeting, setGreeting] = React.useState("Good Morning");
  React.useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening");
  }, []);
  return greeting;
}

function LanguagePill() {
  const locale = useLocale();
  const t = useTranslations("Language");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="border-border/60 flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm font-medium"
        >
          <Globe className="size-4" />
          {t(locale)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((code) => (
          <DropdownMenuItem key={code} onClick={() => router.replace(pathname, { locale: code })}>
            {t(code)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface RowProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function Row({ icon, label, onClick }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-border/60 flex w-full items-center gap-4 border-b px-4 py-4 text-left"
    >
      <span className="text-foreground">{icon}</span>
      <span className="flex-1 text-[15px]">{label}</span>
      <ChevronRight className="text-muted-foreground size-4" />
    </button>
  );
}

export function MobileProfileSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const greeting = useGreeting();
  const [showLangPill, setShowLangPill] = React.useState(false);

  if (!open) return null;

  function go(path: string) {
    onClose();
    router.push(path);
  }

  function handleAuthButton() {
    onClose();
    const hasAccount = typeof window !== "undefined" && localStorage.getItem("vcart-has-account") === "1";
    router.push(hasAccount ? "/login" : "/register");
  }

  function handleMyOrders() {
    if (!user) {
      toast.error("Please sign up or log in to view your orders.");
      return;
    }
    go("/dashboard/orders");
  }

  return (
    <div className="bg-background fixed inset-0 z-50 flex flex-col overflow-y-auto md:hidden">
      <div className="flex items-center justify-between bg-neutral-200/70 px-4 py-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onClose} aria-label="Back">
            <ArrowLeft className="size-5" />
          </button>
          <p className="text-lg font-bold">My Profile</p>
        </div>

        {showLangPill ? (
          <LanguagePill />
        ) : (
          <button type="button" onClick={() => setShowLangPill(true)} aria-label="More options">
            <MoreVertical className="size-5" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <p className="text-base font-medium">{greeting},</p>
          <p className="text-base font-medium">Welcome to Vcart!</p>
        </div>
        {user ? (
          <Button size="sm" variant="outline" onClick={() => logout.mutate()} disabled={logout.isPending}>
            Log out
          </Button>
        ) : (
          <Button size="sm" onClick={handleAuthButton}>
            LOGIN / SIGNUP
          </Button>
        )}
      </div>

      <div>
        <Row icon={<Inbox className="size-5" />} label="My Oders" onClick={handleMyOrders} />
        <Row icon={<FileText className="size-5" />} label="Terms & Conditions" onClick={() => go("/terms")} />
        <Row icon={<ShieldCheck className="size-5" />} label="Privacy Policy" onClick={() => go("/privacy")} />
        <Row icon={<Repeat className="size-5" />} label="Refund & Return Policy" onClick={() => go("/refund-policy")} />
        <Row icon={<MessageCircle className="size-5" />} label="Customer Support" onClick={() => go("/chat")} />
      </div>

      <div className="mt-auto flex flex-col items-center gap-4 px-6 py-8 text-center">
        <Logo className="h-10 w-auto" />
        <p className="text-muted-foreground text-sm">{siteConfig.description}</p>
                <div className="flex gap-4">
          <FacebookIcon className="text-muted-foreground size-4.5" />
          <InstagramIcon className="text-muted-foreground size-4.5" />
        </div>
        <div className="text-muted-foreground w-full space-y-2 text-left text-sm">
          <p className="font-semibold tracking-wide">CONTACT</p>
          <p>{siteConfig.contact.address}</p>
          <p>{siteConfig.contact.phone}</p>
          <p>{siteConfig.contact.email}</p>
        </div>
        <p className="text-muted-foreground pt-4 text-xs">
          © {new Date().getFullYear()} Vcart Pvt Limited. All rights reserved.
        </p>
      </div>
    </div>
  );
}