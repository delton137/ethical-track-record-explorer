import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ethical Track Record Explorer",
  description:
    "Explore dated primary writings across ethical traditions, historical reforms, and future moral-circle scenarios.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
