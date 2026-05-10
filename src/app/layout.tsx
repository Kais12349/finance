import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Global Tech Finance Intel",
  description: "全球科技金融实时情报网页平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
