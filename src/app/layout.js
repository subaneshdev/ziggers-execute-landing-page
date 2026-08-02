import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ziggers Execute | On-Ground Marketing Execution Platform",
  description: "India's premier B2B platform for retail activation, visual audits, and physical product sampling campaigns. Real-time GPS verification, escrow protections, and 100% compliant operations.",
  metadataBase: new URL("https://execute.ziggers.in"),
  alternates: {
    canonical: "/",
  },
  other: {
    'google-site-verification': 'need-to-set',
  }
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ziggers Execute",
    "url": "https://execute.ziggers.in/",
    "logo": "https://execute.ziggers.in/icon.png",
    "sameAs": [
      "https://www.crunchbase.com/organization/ziggers",
      "https://www.producthunt.com/products/ziggers"
    ]
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
