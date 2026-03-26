import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContentHub - Content Management Dashboard",
  description: "Manage your content, track analytics, and stay ahead of competitors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Sidebar />
        <main className="min-h-screen p-4 pt-16 md:ml-64 md:p-8">{children}</main>
      </body>
    </html>
  );
}
