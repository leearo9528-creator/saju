import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const notoSerif = Noto_Serif_KR({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-serif",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a23",
};

export const metadata: Metadata = {
  title: "나의 사주 운명 확인",
  description: "이름과 생년월일로 알아보는 나의 사주 성향",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={notoSerif.variable}>
      <body className="antialiased min-h-screen pattern-bg font-serif">
        {children}
      </body>
    </html>
  );
}
