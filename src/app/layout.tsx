import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "EduMaroc – Enseignement Supérieur au Maroc",
    template: "%s | EduMaroc",
  },
  description:
    "Découvrez les meilleures universités et grandes écoles du Maroc. Comparez les programmes, les frais de scolarité et trouvez l'établissement idéal pour votre avenir.",
  keywords: [
    "université maroc",
    "grandes écoles maroc",
    "enseignement supérieur",
    "études maroc",
    "bac maroc",
    "CPGE",
    "ingénieur maroc",
  ],
  authors: [{ name: "EduMaroc" }],
  creator: "EduMaroc",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://edumaroc.ma",
    title: "EduMaroc – Enseignement Supérieur au Maroc",
    description: "La plateforme de référence pour l'enseignement supérieur au Maroc",
    siteName: "EduMaroc",
  },
  twitter: {
    card: "summary_large_image",
    title: "EduMaroc",
    description: "La plateforme de référence pour l'enseignement supérieur au Maroc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
