"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <button
    className="bg-current text-current font-bold py-2 px-4 rounded"
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
  >
    {theme === "light" ? "🌜" : "☀️"}
  </button>
  )
}