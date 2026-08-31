"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "percolia-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={
        theme === "light" ? "Passer en thème sombre" : "Passer en thème clair"
      }
      title={
        theme === "light" ? "Passer en thème sombre" : "Passer en thème clair"
      }
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
