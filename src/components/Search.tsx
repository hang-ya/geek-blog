"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface Entry {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[]>([]);
  const [results, setResults] = useState<Entry[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setIndex)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!query.trim() || index.length === 0) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matched = index
      .filter((e) => {
        if (e.title.toLowerCase().includes(q)) return true;
        if (e.description.toLowerCase().includes(q)) return true;
        if (e.tags.some((t) => t.toLowerCase().includes(q))) return true;
        if (e.content.toLowerCase().includes(q)) return true;
        return false;
      })
      .slice(0, 8);
    setResults(matched);
  }, [query, index]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        (ref.current?.querySelector("input") as HTMLInputElement)?.focus();
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const select = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-text-muted hover:text-text transition-colors font-mono flex items-center gap-1"
        title="搜索 (Ctrl+K)"
      >
        ⌘K
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章..."
            className="w-full px-4 py-3 bg-transparent text-text placeholder-text-muted outline-none border-b border-border text-sm"
          />

          <div className="max-h-80 overflow-y-auto">
            {query && results.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-text-muted">没有找到相关文章</p>
            ) : results.length > 0 ? (
              results.map((entry) => (
                <Link
                  key={entry.slug}
                  href={`/posts/${entry.slug}`}
                  onClick={select}
                  className="block px-4 py-3 hover:bg-bg-secondary transition-colors border-b border-border-light last:border-0"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text">{entry.title}</h3>
                    <time className="shrink-0 text-xs text-text-muted font-mono">{entry.date}</time>
                  </div>
                  <p className="mt-0.5 text-xs text-text-secondary line-clamp-2">{entry.description}</p>
                </Link>
              ))
            ) : (
              <p className="px-4 py-6 text-center text-sm text-text-muted">
                输入关键词搜索文章标题、描述和标签
              </p>
            )}
          </div>

          <div className="px-4 py-2 border-t border-border text-[10px] text-text-muted font-mono flex gap-3">
            <span>↑↓ 导航</span>
            <span>↵ 打开</span>
            <span>Esc 关闭</span>
          </div>
        </div>
      )}
    </div>
  );
}
