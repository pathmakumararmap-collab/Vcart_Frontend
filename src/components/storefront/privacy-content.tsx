import { Link } from "@/i18n/navigation";

import { LegalPageLayout } from "@/components/storefront/legal-page-layout";
import { siteConfig } from "@/lib/constants/site";

export function PrivacyContent() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="12 September 2026">
      <p>
        This Privacy Policy explains how {siteConfig.fullName} (&quot;we&quot;, &quot;us&quot;,
        &quot;our&quot;) collects, uses, and protects your personal information when you use our
        website or place an order with us.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li>
          <strong>Account &amp; order details:</strong> name, email address, phone number,
          delivery and billing addresses.
        </li>
        <li>
          <strong>Order history:</strong> products purchased, order value, and payment status
          (we do not store your full card number — that is handled directly by our payment
          gateway partner).
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, and pages visited, collected
          automatically to keep the site secure and working correctly.
        </li>
        <li>
          <strong>Communications:</strong> messages you send us through live chat, email, or
          phone, so we can respond and keep a record of support requests.
        </li>
      </ul>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To process and deliver your orders, including sending order and delivery updates by email or SMS.</li>
        <li>To provide customer support and respond to enquiries.</li>
        <li>To maintain your account and order history.</li>
        <li>To improve our website, products, and service.</li>
        <li>To meet our legal and tax obligations.</li>
      </ul>
      <p>We do not sell your personal information to third parties.</p>

      <h2>3. Who we share information with</h2>
      <ul>
        <li>Payment gateway providers, to process card payments securely.</li>
        <li>Courier and delivery partners, to fulfil your order.</li>
        <li>Email and SMS providers, to send order confirmations and updates.</li>
        <li>Government or regulatory authorities, where required by law.</li>
      </ul>

      <h2>4. Cookies</h2>
      <p>
        We use cookies and similar technologies to keep you signed in, remember items in your
        cart, and understand how the site is used. You can control cookies through your browser
        settings, though some parts of the site may not work correctly if cookies are disabled.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We keep your account and order information for as long as your account is active, and
        afterwards for as long as needed to meet legal, tax, and accounting requirements.
      </p>

      <h2>6. Data security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your information.
        However, no method of transmission over the internet is completely secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>7. Your rights</h2>
      <p>
        You can review and update your account details at any time from your dashboard. To
        request a copy of your data, ask us to correct it, or ask us to delete your account,
        contact us using the details below.
      </p>

      <h2>8. Children&apos;s privacy</h2>
      <p>Our site is not directed at children, and we do not knowingly collect personal information from children.</p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Continued use of the site after
        changes are posted means you accept the updated policy.
      </p>

      <h2>10. Contact us</h2>
      <p>
        For any privacy-related question or request, contact us at{" "}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a> or{" "}
        {siteConfig.contact.phone}. See also our{" "}
        <Link href="/terms">Terms &amp; Conditions</Link> and{" "}
        <Link href="/refund-policy">Refund &amp; Return Policy</Link>.
      </p>
    </LegalPageLayout>
  );
}
