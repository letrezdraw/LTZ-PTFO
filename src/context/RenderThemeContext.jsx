/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const THEME_COUNT = 5;
const STORAGE_KEY = 'ltz-render-style';

function readStoredTheme() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s == null) return 0;
    const n = parseInt(s, 10);
    if (!Number.isNaN(n) && n >= 0 && n < THEME_COUNT) return n;
  } catch {
    /* ignore */
  }
  return 0;
}

const RenderThemeContext = createContext(null);

export function RenderThemeProvider({ children }) {
  const [themeIndex, setThemeIndex] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.renderStyle = String(themeIndex + 1);
    try {
      localStorage.setItem(STORAGE_KEY, String(themeIndex));
    } catch {
      /* ignore */
    }
  }, [themeIndex]);

  const cycleTheme = useCallback(() => {
    setThemeIndex((i) => (i + 1) % THEME_COUNT);
  }, []);

  const value = useMemo(
    () => ({
      themeIndex,
      displayStyle: themeIndex + 1,
      cycleTheme,
      themeCount: THEME_COUNT
    }),
    [themeIndex, cycleTheme]
  );

  return <RenderThemeContext.Provider value={value}>{children}</RenderThemeContext.Provider>;
}

export function useRenderTheme() {
  const ctx = useContext(RenderThemeContext);
  if (!ctx) throw new Error('useRenderTheme must be used within RenderThemeProvider');
  return ctx;
}
