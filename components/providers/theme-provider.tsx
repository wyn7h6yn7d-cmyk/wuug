"use client";

import * as React from "react";

type Theme = "light" | "dark";
type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "wuug.theme";

function applyTheme(t: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "dark") root.classList.add("theme-dark");
  else root.classList.remove("theme-dark");
  root.style.colorScheme = t;
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");

  React.useEffect(() => {
    const initial = getInitialTheme();
    setThemeState(initial);
    applyTheme(initial);
  }, []);

  const setTheme = React.useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {}
  }, []);

  const toggle = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = React.useMemo<ThemeContextValue>(() => ({ theme, setTheme, toggle }), [theme, setTheme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: "light",
      setTheme: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

/** Inline script that sets the theme class before paint to avoid flashes. */
export const ThemeScript = (
  <script
    dangerouslySetInnerHTML={{
      __html: `(()=>{try{var t=localStorage.getItem('${STORAGE_KEY}');if(!t){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}var d=document.documentElement;if(t==='dark'){d.classList.add('theme-dark')}d.style.colorScheme=t;}catch(e){}})();`,
    }}
  />
);
