import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DeliveryX - Peça comida com facilidade",
  description: "Delivery de comida rápido e prático. Peça dos melhores restaurantes da sua região.",
  keywords: ["delivery", "comida", "restaurante", "pedido online"],
  authors: [{ name: "DeliveryX" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#ef4444",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${sora.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}

