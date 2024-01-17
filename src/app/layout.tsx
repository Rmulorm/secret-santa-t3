import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { TopBarUserSection } from "~/components/topBarUser";
import { cn } from "~/lib/utils";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Migui",
  description: "Bem vindo ao Migui",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable,
        )}
      >
        <ClerkProvider>
          <TRPCReactProvider>
            <TopBar />
            <main className="flex h-screen justify-center">
              <div className="w-full border-x md:max-w-4xl">
                <div className="h-16" />
                {children}
              </div>
            </main>
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

const TopBar = () => {
  return (
    <header className="fixed left-0 right-0 top-0 flex h-16 items-center justify-between bg-primary p-2 px-8 text-2xl text-foreground shadow-md transition-all duration-500 dark:bg-gray-800">
      <Link className="flex items-center gap-2" href="/">
        <h1>Miguis</h1>
      </Link>

      <TopBarUserSection />
    </header>
  );
};
