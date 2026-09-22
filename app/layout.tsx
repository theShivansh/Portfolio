import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteNav } from "@/components/navigation/SiteNav";
import { SkipLinks } from "@/components/navigation/SkipLinks";
import { Footer } from "@/components/contact/Footer";
import { Tracker } from "@/components/accessibility/Tracker";
import { bootScript } from "@/lib/motion";
import { site } from "@/lib/site";
import "./globals.css";

/* Self-hosted (app/fonts, SIL OFL): no third-party request at build or runtime. */
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin-var.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-bricolage",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
});

const plexMono = localFont({
  src: [
    { path: "./fonts/ibm-plex-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/ibm-plex-mono-latin-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

/* Annotations only: not needed for first paint, so not preloaded. */
const caveat = localFont({
  src: "./fonts/caveat-latin-var.woff2",
  weight: "400 700",
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.codename,
  authors: [{ name: site.name, url: site.github }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: "en",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f3f1e9",
  colorScheme: "light",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: "AI Engineer",
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.github, site.huggingface, site.linkedin].filter(Boolean),
  knowsAbout: [
    "Retrieval-augmented generation",
    "Multi-agent systems",
    "LLM evaluation",
    "Monte Carlo simulation",
    "Full-stack web development",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${plexMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <SkipLinks />
        <div className="field-grid" aria-hidden="true" />
        <SiteNav />
        {children}
        <Footer />
        <Tracker />
      </body>
    </html>
  );
}
