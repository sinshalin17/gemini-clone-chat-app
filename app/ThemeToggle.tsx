"use client";
import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // On mount, sync with localStorage or system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('theme');
    let dark = false;
    if (saved === 'dark') dark = true;
    else if (saved === 'light') dark = false;
    else dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(dark);
    if (dark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <button
      aria-label="Toggle dark mode"
      className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded shadow focus:outline-none focus:ring"
      onClick={toggleTheme}
      tabIndex={0}
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
