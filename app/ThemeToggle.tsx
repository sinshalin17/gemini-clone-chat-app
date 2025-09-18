"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  // Sync state with html class and localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  // On mount, check localStorage and system preference
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDark(true);
    else if (saved === 'light') setDark(false);
    else {
      // If no preference, use system
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDark(true);
      }
    }
  }, []);

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
