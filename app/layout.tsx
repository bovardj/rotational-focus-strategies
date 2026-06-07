import { ClerkProvider } from "@clerk/nextjs";
import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";
import InstallPrompt from "@/app/components/InstallPromptClient";
import type { Viewport } from "next";

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
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <InstallPrompt />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
