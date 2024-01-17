import "~/styles/globals.css";

import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { TopBarUserSection } from "~/components/topBarUser";
import { cn } from "~/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Miguis",
  description: "Bem vindo ao Miguis",
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
          "bg-background dark min-h-screen font-sans antialiased",
          inter.variable,
        )}
      >
        <ClerkProvider>
          <TRPCReactProvider>
            <TopBar />
            {children}
          </TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

const TopBar = () => {
  return (
    <header className="flex justify-end">
      <div className="flex w-full justify-between border-b-2 p-2 px-10">
        <div className="content-center items-center">
          <h1>Miguis</h1>
        </div>
        <TopBarUserSection />
      </div>
    </header>
  );
};
