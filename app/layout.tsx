import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const title = "Welcome To Your Perfect Home";
const description = "Play Welcome To Your Perfect Home online";

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://welcome-to-your-perfect-home.vercel.app",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-red-950`}>{children}</body>
    </html>
  );
}
