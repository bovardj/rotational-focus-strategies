import { ClerkProvider } from "@clerk/nextjs";
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import InstallPrompt from "@/app/components/InstallPromptClient";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: {
    default: "Rotational Focus Strategies",
    template: "%s — Rotational Focus Strategies",
  },
  description: "A focus strategy study for people with ADHD.",
  openGraph: {
    title: "Rotational Focus Strategies",
    description: "A research-backed focus app for people with ADHD.",
    url: "https://www.focusapp.dev",
    siteName: "Rotational Focus Strategies",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rotational Focus Strategies",
    description: "A research-backed focus app for people with ADHD.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <InstallPrompt />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
