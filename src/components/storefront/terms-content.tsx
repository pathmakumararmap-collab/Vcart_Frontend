import { Link } from "@/i18n/navigation";

import { LegalPageLayout } from "@/components/storefront/legal-page-layout";
import { siteConfig } from "@/lib/constants/site";

export function TermsContent() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="12 September 2026">
      <p>
        These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the{" "}
        {siteConfig.fullName} website (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) and any
        purchase you make through it. By accessing the site or placing an order, you agree to be
        bound by these Terms. If you do not agree, please do not use the site.
      </p>

      <h2>1. Who we are</h2>
      <p>
        {siteConfig.fullName} is an online store based in Sri Lanka, operating at{" "}
        {siteConfig.contact.address}. You can reach us at{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
        {siteConfig.contact.phone}.
      </p>

      <h2>2. Accounts</h2>
      <ul>
        <li>You must provide accurate, current information when creating an account.</li>
        <li>You are responsible for keeping your password confidential and for all activity under your account.</li>
        <li>We may suspend or close accounts we reasonably believe are being used fraudulently or in violation of these Terms.</li>
      </ul>

      <h2>3. Orders and pricing</h2>
      <ul>
        <li>Placing an order is an offer to buy; we may accept or decline it at our discretion (for example, if a product is out of stock or priced incorrectly due to an error).</li>
        <li>Prices are shown in Sri Lankan Rupees (LKR) and include applicable taxes unless stated otherwise. Prices, offers, and product availability may change without prior notice.</li>
        <li>A contract of sale is formed only once we confirm your order and, for card payments, once payment is successfully processed.</li>
      </ul>

      <h2>4. Payment</h2>
      <p>
        We accept Cash on Delivery and online card payments through our payment gateway partner.
        Card details are processed securely by our payment provider and are never stored on our
        servers.
      </p>

      <h2>5. Delivery</h2>
      <ul>
        <li>Delivery timeframes shown at checkout are estimates and not guaranteed.</li>
        <li>Risk in the goods passes to you once they are delivered to the address provided at checkout.</li>
        <li>Please inspect your order on delivery and report any damage or missing items promptly using the contact details above.</li>
      </ul>

      <h2>6. Returns, refunds, and cancellations</h2>
      <p>
        Our returns and refunds process is set out in full in our{" "}
        <Link href="/refund-policy">Refund &amp; Return Policy</Link>, which forms part of these
        Terms.
      </p>

      <h2>7. Product information</h2>
      <p>
        We try to ensure product descriptions, images, and prices are accurate, but errors can
        occur. We do not guarantee that colours or details shown on your device exactly match the
        physical product.
      </p>

      <h2>8. Intellectual property</h2>
      <p>
        All content on this site — including text, graphics, logos, and images — belongs to{" "}
        {siteConfig.fullName} or its licensors and may not be copied or reused without permission.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the extent permitted by law, {siteConfig.fullName} is not liable for indirect or
        consequential losses arising from your use of the site or purchase of products. Nothing in
        these Terms limits liability that cannot be excluded under Sri Lankan law.
      </p>

      <h2>10. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the site after changes are
        posted means you accept the updated Terms.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka,
        and any disputes will be subject to the exclusive jurisdiction of the courts of Sri Lanka.
      </p>

      <h2>12. Contact us</h2>
      <p>
        Questions about these Terms can be sent to{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or by
        phone at {siteConfig.contact.phone}.
      </p>
    </LegalPageLayout>
  );
}
