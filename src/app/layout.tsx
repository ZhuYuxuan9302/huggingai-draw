import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 抽奖",
  description: "充值就是抽抽奖，逢抽必中",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
