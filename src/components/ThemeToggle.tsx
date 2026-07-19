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
      className="text-xl text-text-muted hover:text-text transition-colors leading-none"
      title={dark ? "浅色模式" : "深色模式"}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}
