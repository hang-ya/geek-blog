import type { Metadata } from "next";
import { ThemeToggle } from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "GEEK",
  description: "技术笔记、工具推荐与阅读思考",
};

function ThemeScript() {
  // Inline script to prevent flash of wrong theme
  const code = `try{var t=localStorage.getItem('theme')||'light';document.documentElement.className=t}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full bg-bg text-text antialiased flex flex-col transition-colors">
        <header className="border-b border-border bg-bg/90 backdrop-blur sticky top-0 z-50 transition-colors">
          <div className="max-w-2xl mx-auto px-5 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-[0.1em] text-accent font-mono">
              GEEK
            </a>
            <nav className="flex items-center gap-4 text-sm text-text-secondary font-medium">
              <a href="/" className="hover:text-text transition-colors">文章</a>
              <a href="https://tzyday.com" target="_blank" rel="noopener noreferrer" className="hover:text-text transition-colors">
                工具
              </a>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border py-8 mt-16 transition-colors">
          <div className="max-w-2xl mx-auto px-5 text-center text-xs text-text-muted font-mono">
            <p>© 2026 GEEK</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
