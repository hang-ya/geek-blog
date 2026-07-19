import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Search } from "@/components/Search";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEK",
  description: "技术笔记、工具推荐与阅读思考",
};

function ThemeScript() {
  const code = `try{var t=localStorage.getItem('theme')||'light';document.documentElement.className=t}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-bg text-text antialiased flex flex-col">
        <header className="border-b border-border bg-bg/95 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="font-bold text-xl tracking-[0.08em] text-accent font-mono">
              GEEK
            </a>
            <nav className="flex items-center gap-5 text-base text-text-secondary font-medium">
              <a href="/" className="hover:text-text transition-colors">文章</a>
              <a href="/collections" className="hover:text-text transition-colors">合集</a>
              <a href="https://tzyday.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
                生活
              </a>
              <ThemeToggle />
              <Search />
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-10 mt-20">
          <div className="max-w-3xl mx-auto px-6 text-center text-sm text-text-muted font-mono">
            <p>© 2026 GEEK</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
