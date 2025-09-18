"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark') setDark(true);
    }
  }, []);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [dark]);
  return (
    <button
      aria-label="Toggle dark mode"
      className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded shadow focus:outline-none focus:ring"
      onClick={() => setDark((d) => !d)}
      tabIndex={0}
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
