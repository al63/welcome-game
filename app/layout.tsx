import { Footer } from "./components/Footer";
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
        <div className="mt-8">
          <Footer />
        </div>
      </body>
    </html>
  );
}
