import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";

export const metadata: Metadata = {
  title: "暖圈 - 温暖相伴，暖心互动",
  description: "专为银发族设计的社交与陪伴平台，语音发帖、AI陪聊、志愿者关怀，让科技变得温暖易用",
  keywords: "老年人社交, 暖圈, AI陪聊, 语音发帖, 银发族",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FF6B6B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <main className="pb-20 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
