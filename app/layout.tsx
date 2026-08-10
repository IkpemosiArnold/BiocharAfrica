import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Archivo } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import PerfDebug from "./components/PerfDebug";
import "./globals.css";

/* Display voice: a tall condensed industrial grotesque. The reference is
   stencilled marking on grain sacks, kiln plate and shipping crates, not
   editorial elegance. Set uppercase and very large.

   Carries an optical-size axis, which genuinely matters here: the display sizes
   run to 13rem, and opsz 72 tightens spacing and thins the strokes for exactly
   that use, while headings nearer body size get the sturdier low-opsz cut. */
const display = Big_Shoulders({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-display-face",
  display: "swap",
  // Next cannot derive override metrics for this family, so without an explicit
  // condensed fallback the swap lands as a visible reflow on the largest type on
  // the page. These are the closest widely-installed condensed faces.
  fallback: [
    "Arial Narrow",
    "Helvetica Neue Condensed",
    "Liberation Sans Narrow",
    "sans-serif",
  ],
});

/* Working voice: variable grotesque. The width axis carries the measured,
   technical register for labels, data and captions. */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biocharsolutions.africa"),
  title: {
    default: "Biochar Solutions Africa: The black that feeds",
    template: "%s · Biochar Solutions Africa",
  },
  description:
    "We turn Nigerian crop waste into biochar: a stable carbon that locks CO₂ out of the atmosphere for a thousand years and makes tired soil fertile again. Field-proven in Niger State.",
  keywords: [
    "biochar",
    "Nigeria",
    "carbon sequestration",
    "soil health",
    "regenerative agriculture",
    "Niger State",
    "Abuja",
    "carbon removal",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Biochar Solutions Africa",
    title: "Biochar Solutions Africa: The black that feeds",
    description:
      "Carbon out of the sky, into Nigerian soil, for a thousand years.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#16130f",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-NG" className={`${display.variable} ${archivo.variable}`}>
      <head>
        {/* Field footage and photography are same-origin; no third-party media
            hosts, so there is nothing to preconnect to. Fonts are self-hosted
            by next/font at build time for the same reason. */}
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        {/* One shared emulsion over everything, see globals.css */}
        <div className="grain" aria-hidden="true" />
        <PerfDebug />
      </body>
    </html>
  );
}
