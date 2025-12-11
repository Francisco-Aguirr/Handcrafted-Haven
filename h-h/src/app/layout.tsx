import Footer from "@/components/Footer";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';

export const metadata: Metadata = {
  title: {
    default: 'Handcrafted Haven | Unique Artisanal Marketplace',
    template: '%s | Handcrafted Haven',
  },
  description: 'Discover one-of-a-kind handmade products from verified artisans worldwide. From pottery and jewelry to textiles and woodwork, find unique creations with authentic stories.',
  authors: [
    { name: 'Ramon Douglas Nunez' },
    { name: 'Ebenezer Jules Samu' },
    { name: 'Francisco Javier Aguirre' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

