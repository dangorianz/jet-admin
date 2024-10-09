import { Navbar } from "@/components/layout/Navbar";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "JET",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex h-screen">
            <Navbar />
            <div className="flex-1 bg-slate-100 overflow-y-scroll overflow-hidden">
                {children}
            </div>
        </main>
      </body>
    </html>
  );
}
