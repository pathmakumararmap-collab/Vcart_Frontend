import type * as React from "react";

export function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <h1 className="text-display text-3xl sm:text-4xl">{title}</h1>
      <p className="text-muted-foreground mt-2 text-sm">Last updated: {lastUpdated}</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed sm:text-base [&_h2]:text-display [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:first:mt-0 [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
    </div>
  );
}
