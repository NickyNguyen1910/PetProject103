import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import SeedDemo from "@/components/SeedDemo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StarCard - Photocard Idol K-pop",
  description: "Shop photocard idol K-pop chính hãng - BTS, BLACKPINK, aespa, NewJeans và nhiều hơn nữa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>
            <SeedDemo />
            <Header />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-white/10 py-8 mt-16">
              <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                <p className="text-2xl mb-2">✦</p>
                <p className="text-gray-300 font-semibold mb-1">StarCard</p>
                <p>© 2025 StarCard. Photocard K-pop chính hãng.</p>
              </div>
            </footer>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
