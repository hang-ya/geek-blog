import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEEK",
  description: "一个极客的个人博客 — 技术、工具、阅读与思考",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full bg-bg text-text-body antialiased flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <a
              href="/"
              className="text-lg font-bold tracking-[0.2em] text-accent font-mono"
            >
              GEEK
            </a>
            <nav className="flex items-center gap-4 text-sm font-medium text-text-secondary">
              <a href="/" className="hover:text-text-body transition-colors">
                Posts
              </a>
              <a
                href="https://tzyday.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-text-body transition-colors"
              >
                TZYDAY →
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-12">
          <div className="max-w-2xl mx-auto px-5 text-center text-xs text-text-muted font-mono">
            <p>
              Built with{" "}
              <a href="https://nextjs.org" className="underline underline-offset-2 hover:text-accent">
                Next.js
              </a>
              {" "}· Hosted on{" "}
              <a href="https://pages.cloudflare.com" className="underline underline-offset-2 hover:text-accent">
                Cloudflare Pages
              </a>
            </p>
            <p className="mt-1">© 2026 GEEK</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
