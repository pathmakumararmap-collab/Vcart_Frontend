import Link from "next/link";

export function FlashSaleBanner() {
  return (
    <section className="container-page pt-3 sm:pt-10">
      <Link
        href="/products?sort=latest"
        className="hover-lift-sm shadow-luxury-sm block overflow-hidden boxed-2xl"
      >
        {/* Plain <img>, not next/image — the optimizer would strip the GIF's animation frames. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/flash_sale_banner1.png"
          alt="Flash Sale — up to 50% off, limited time"
          className="aspect-[800/193] w-full object-cover"
        />
      </Link>
    </section>
  );
}