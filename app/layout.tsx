import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "GrandStay | Hotel Management",
  description: "Professional hotel operations, reservations, rooms and payments",
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}