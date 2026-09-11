import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";

import { Logo } from "@/components/shared/logo";
import { siteConfig } from "@/lib/constants/site";
import { FacebookIcon, InstagramIcon, XIcon } from "@/components/icons/social-icons";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";

export function SiteFooter() {
  const t = useTranslations("Footer");

  const FOOTER_LINKS = [
    {
      title: t("shop"),
      links: [
        { href: "/products", label: t("allProducts") },
        { href: "/categories", label: t("categories") },
        { href: "/search", label: t("search") },
        { href: "/wishlist", label: t("wishlist") },
      ],
    },
    {
      title: t("account"),
      links: [
        { href: "/dashboard", label: t("dashboard") },
        { href: "/dashboard/orders", label: t("myOrders") },
        { href: "/dashboard/addresses", label: t("addresses") },
        { href: "/dashboard/coupons", label: t("coupons") },
      ],
    },
    {
      title: t("company"),
      links: [
        { href: "/login", label: t("signIn") },
        { href: "/register", label: t("createAccount") },
      ],
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/60">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-10">
        <div className="space-y-5">
          <Logo />
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed text-pretty">
            {siteConfig.description}
          </p>
          <div className="flex gap-2">
            <Link
              href={siteConfig.links.facebook}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex size-9 items-center justify-center rounded-full transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon className="size-4.5" />
            </Link>
            <Link
              href={siteConfig.links.instagram}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex size-9 items-center justify-center rounded-full transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon className="size-4.5" />
            </Link>
            <Link
              href={siteConfig.links.twitter}
              className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex size-9 items-center justify-center rounded-full transition-colors"
              aria-label="Twitter"
            >
              <XIcon className="size-4.5" />
            </Link>
          </div>
        </div>

        {FOOTER_LINKS.map((section) => (
          <div key={section.title} className="space-y-4">
            <h4 className="text-eyebrow text-muted-foreground">{section.title}</h4>
            <ul className="space-y-2.5">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-4">
          <h4 className="text-eyebrow text-muted-foreground">{t("contact")}</h4>
          <ul className="text-muted-foreground space-y-2.5 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="text-primary mt-0.5 size-4 shrink-0" />
              <span>{siteConfig.contact.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="text-primary size-4 shrink-0" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="text-primary size-4 shrink-0" />
              <span>{siteConfig.contact.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <Separator className="bg-border/60" />
      <div className="container-page flex flex-col items-center justify-between gap-2 py-7 text-xs sm:flex-row">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.fullName}. {t("allRightsReserved")}
        </p>
        <p className="text-muted-foreground">{t("madeBy")}</p>
      </div>
    </footer>
  );
}
