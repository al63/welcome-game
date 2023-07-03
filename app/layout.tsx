import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Welcome To... online board game",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-red-950`}>
        {children}
        <div className="w-full text-center py-4 bottom-0 bg-gray-400 text-white">
          Made by <a href="https://alec-lee.com">Alec</a> and Liz
        </div>
      </body>
    </html>
  );
}
