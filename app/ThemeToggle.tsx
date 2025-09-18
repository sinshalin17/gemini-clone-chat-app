"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // On mount, sync with localStorage or system preference
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else if (saved === 'light') {
      setDark(false);
      document.documentElement.classList.remove('dark');
    } else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // When dark changes, update html class and localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded shadow focus:outline-none focus:ring"
      onClick={() => setDark((d) => !d)}
      tabIndex={0}
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
