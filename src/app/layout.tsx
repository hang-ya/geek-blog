import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEK",
  description: "技术笔记、工具推荐与阅读思考 — 一个极客的个人博客",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full bg-bg text-text antialiased flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 group">
              <span className="w-7 h-7 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-sm font-bold font-mono group-hover:bg-accent/20 transition-colors">
                G
              </span>
              <span className="text-sm font-semibold tracking-[0.25em] text-text font-mono">
                GEEK
              </span>
            </a>
            <nav className="flex items-center gap-5 text-sm font-medium text-text-secondary">
              <a href="/" className="hover:text-accent transition-colors">文章</a>
              <a href="https://tzyday.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-1 hover:text-accent transition-colors">
                工具 <span className="text-[10px] text-text-muted">↗</span>
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16">
          <div className="max-w-3xl mx-auto px-5 text-center">
            <p className="text-xs text-text-muted font-mono">
              <span className="text-accent">~</span> Built with{" "}
              <a href="https://nextjs.org" className="text-text-secondary hover:text-accent transition-colors">Next.js</a>
              {" · "}
              <a href="https://pages.cloudflare.com" className="text-text-secondary hover:text-accent transition-colors">Cloudflare Pages</a>
              {" "}<span className="text-accent">~</span>
            </p>
            <p className="mt-1 text-[11px] text-text-muted">© 2026 GEEK</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
