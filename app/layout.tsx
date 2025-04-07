import {
  ClerkProvider,
  // SignInButton,
  // SignUpButton,
  SignedIn,
  // SignedOut,
  UserButton,
} from '@clerk/nextjs'
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            {/* <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut> */}
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
