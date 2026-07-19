import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEK",
  description: "技术笔记、工具推荐与阅读思考",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full bg-bg text-text antialiased flex flex-col">
        <header className="border-b border-border">
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-[0.15em] text-accent font-mono">
              GEEK
            </a>
            <nav className="flex items-center gap-5 text-sm text-text-secondary font-medium">
              <a href="/" className="hover:text-text transition-colors">文章</a>
              <a href="https://tzyday.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
                工具 ↗
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-8 mt-12">
          <div className="max-w-2xl mx-auto px-5 text-center text-xs text-text-muted font-mono">
            <p>Built with Next.js · Hosted on Cloudflare Pages</p>
            <p className="mt-1">© 2026 GEEK</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
