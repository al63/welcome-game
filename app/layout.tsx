import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welcome To Your Perfect Home",
  description: "Play Welcome To Your Perfect Home online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-red-950`}>{children}</body>
    </html>
  );
}
