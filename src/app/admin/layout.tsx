import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type * as React from "react";

import { AppProviders } from "@/providers/app-providers";
import { AdminShell } from "@/components/admin/admin-shell";
import { RequireStaff } from "@/components/shared/require-auth";
import { siteConfig } from "@/lib/constants/site";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Admin | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name} Admin`,
  },
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <RequireStaff>
            <AdminShell>{children}</AdminShell>
          </RequireStaff>
        </AppProviders>
      </body>
    </html>
  );
}
