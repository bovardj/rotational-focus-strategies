import { ClerkProvider, SignedIn, UserButton } from "@clerk/nextjs";
import "@/app/ui/global.css";
import { inter, lusitana } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <header className="sticky flex justify-end items-center p-4 gap-4 h-16">
            <h1 className={`${lusitana.className} text-2xl font-bold`}>
              Rotational Focus Strategies
            </h1>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
