import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoGen",
  description: "Generate documents from Word templates and Excel data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
