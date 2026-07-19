"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDark(stored === "dark");
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    const cls = next ? "dark" : "light";
    localStorage.setItem("theme", cls);
    document.documentElement.className = cls;
  }

  return (
    <button
      onClick={toggle}
      aria-label="切换主题"
      className="text-sm text-text-muted hover:text-text transition-colors font-mono"
    >
      {dark ? "浅色" : "深色"}
    </button>
  );
}
