import { Link } from "@/i18n/navigation";

import { LegalPageLayout } from "@/components/storefront/legal-page-layout";
import { siteConfig } from "@/lib/constants/site";

export function RefundPolicyContent() {
  return (
    <LegalPageLayout title="Refund & Return Policy" lastUpdated="12 September 2026">
      <p>
        We want you to be happy with your order. This policy explains when you can return a
        product or request a refund, and how the process works.
      </p>

      <h2>1. Eligibility for returns</h2>
      <ul>
        <li>Items can be returned within 7 days of delivery, unused, unwashed, and in their original packaging with all tags attached.</li>
        <li>Please share clear photos of the issue when contacting us for a damaged, defective, or incorrect item, to help us process your request quickly.</li>
      </ul>

      <h2>2. Items that cannot be returned</h2>
      <ul>
        <li>Perishable goods (including groceries and fresh food items).</li>
        <li>Personal care, cosmetic, or intimate items that have been opened or used, for hygiene reasons.</li>
        <li>Items marked as final sale or clearance at the time of purchase.</li>
        <li>Products returned without their original packaging, accessories, or proof of purchase.</li>
      </ul>

      <h2>3. How to request a return or refund</h2>
      <ul>
        <li>
          Contact us at{" "}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
          {siteConfig.contact.phone} with your order number and the reason for the return.
        </li>
        <li>We&apos;ll confirm whether the item is eligible and, if so, arrange collection or provide a return address.</li>
        <li>Once we receive and inspect the returned item, we&apos;ll notify you of the outcome.</li>
      </ul>

      <h2>4. Damaged, defective, or wrong items</h2>
      <p>
        If an item arrives damaged, defective, or different from what you ordered, contact us
        within 48 hours of delivery. We&apos;ll arrange a free replacement or a full refund,
        including any delivery charges paid on that order.
      </p>

      <h2>5. Change of mind</h2>
      <p>
        If you simply change your mind about an eligible item, you can return it within the
        7-day window above. Original delivery charges are non-refundable in this case, and return
        delivery costs may be your responsibility unless the item was damaged or incorrect.
      </p>

      <h2>6. Refund method and timing</h2>
      <ul>
        <li>Card payments are refunded to the original card, typically within 5–10 business days once the return is approved, depending on your bank.</li>
        <li>Cash on Delivery orders are refunded via bank transfer to an account you provide.</li>
        <li>You&apos;ll receive an email or SMS once your refund has been processed.</li>
      </ul>

      <h2>7. Order cancellations</h2>
      <p>
        You can cancel an order from your account dashboard while it is still in{" "}
        <strong>Pending</strong> or <strong>Confirmed</strong> status. Once an order has been
        shipped, it can no longer be cancelled — you&apos;ll need to follow the return process
        above after delivery.
      </p>

      <h2>8. Need help?</h2>
      <p>
        Our support team is happy to help with any return or refund question — reach us at{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>,{" "}
        {siteConfig.contact.phone}, or through the chat icon on our website. See also our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link>.
      </p>
    </LegalPageLayout>
  );
}
