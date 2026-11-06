import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Charlie Hair Studio | Premium Unisex Salon in Ahmedabad",
  description:
    "Look Good • Feel Good. Premium haircuts, grooming, chemical hair treatments, relaxing spas, and bridal/groom packages at Charlie Hair Studio, Jodhpur Village, Ahmedabad.",
  keywords: [
    "Barber Ahmedabad",
    "Unisex Salon Ahmedabad",
    "Haircut Jodhpur Village",
    "Charlie Hair Studio",
    "Bridal Makeup Ahmedabad",
    "Groom Packages Ahmedabad",
    "Men Grooming Salon",
  ],
  authors: [{ name: "Charlie Hair Studio" }],
  openGraph: {
    title: "Charlie Hair Studio | Unisex Salon Ahmedabad",
    description: "Premium hair, skin, and grooming treatments. Book online today.",
    url: "https://charliehairstudio.com",
    siteName: "Charlie Hair Studio",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="bg-charcoal-900 text-offwhite min-h-screen flex flex-col antialiased selection:bg-gold-500 selection:text-charcoal-950">
        {children}
      </body>
    </html>
  );
}
