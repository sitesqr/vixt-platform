import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const vixtFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-vixt",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "VIXT — Tecnologia que simplifica o seu dia a dia",
    template: "%s | VIXT",
  },
  description:
    "Ecossistema VIXT: aplicativos gratuitos para pessoais, profissionais e empresas. Conheça e acesse sem cadastro ou assinatura.",
  applicationName: "VIXT",
  keywords: [
    "VIXT",
    "aplicativos gratuitos",
    "gestão empresarial",
    "oficina mecânica",
    "barbearia",
    "salão de beleza",
    "estética",
    "lava rápido",
  ],
  authors: [{ name: "VIXT" }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "VIXT",
    title: "VIXT — Tecnologia que simplifica o seu dia a dia",
    description:
      "Aplicativos gratuitos, inteligentes e acessíveis em um único ecossistema.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VIXT",
    description: "Tecnologia que simplifica o seu dia a dia.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={vixtFont.variable}>
      <body>{children}</body>
    </html>
  );
}
