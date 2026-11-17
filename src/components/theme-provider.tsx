"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};
const ThemeContext = createContext<ThemeContextValue | null>(null);

function savedTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem("gin-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });
  function applyPreference() {
    const saved = savedTheme();
    root.classList.toggle(
      "dark",
      saved === "dark" || (saved === null && system.matches),
    );
  }
  function onStorage(event: StorageEvent) {
    if (event.key === "gin-theme" || event.key === null) applyPreference();
  }
  system.addEventListener("change", applyPreference);
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    system.removeEventListener("change", applyPreference);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}
function getServerSnapshot(): Theme {
  return "light";
}

let transitionTimer: ReturnType<typeof setTimeout> | undefined;

function toggleTheme() {
  const root = document.documentElement;
  const next = getSnapshot() === "dark" ? "light" : "dark";
  clearTimeout(transitionTimer);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    root.classList.add("theme-fading");
    transitionTimer = setTimeout(() => root.classList.remove("theme-fading"), 320);
  } else {
    root.classList.remove("theme-fading");
  }
  root.classList.toggle("dark", next === "dark");
  try {
    window.localStorage.setItem("gin-theme", next);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
