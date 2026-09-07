import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants/site";

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
    >
      {/* Drop your logo file at /public/images/logo.png (or change the
          path below). Height is fixed at 32px; width scales to match your
          image's aspect ratio. If your logo already includes the brand
          name, delete the <span> below it so the name isn't duplicated. */}
      <Image
        src="/images/vcart-logo.svg"
        alt={siteConfig.name}
        width={32}
        height={32}
        className="h-12 w-auto shrink-0"
        priority
      />
      
    </Link>
  );
}