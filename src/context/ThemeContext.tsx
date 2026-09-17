import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeId = 'obsidian' | 'nordic-light' | 'warm-paper';

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  mode: 'dark' | 'light';
  description: string;
  bgHex: string;
  cardHex: string;
  textHex: string;
  accentHex: string;
}

export const THEME_PRESETS: ThemeMeta[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Studio',
    mode: 'dark',
    description: 'Deep onyx dark canvas with crisp high-contrast neon accents.',
    bgHex: '#09090b',
    cardHex: '#18181b',
    textHex: '#f4f4f5',
    accentHex: '#22d3ee',
  },
  {
    id: 'nordic-light',
    name: 'Nordic Light',
    mode: 'light',
    description: 'Cool porcelain slate canvas with crisp sky blue & midnight navy typography.',
    bgHex: '#f1f5f9',
    cardHex: '#ffffff',
    textHex: '#0f172a',
    accentHex: '#0284c7',
  },
  {
    id: 'warm-paper',
    name: 'Warm Paper',
    mode: 'light',
    description: 'Warm editorial cream canvas with terracotta accents & warm charcoal typography.',
    bgHex: '#f4efe6',
    cardHex: '#fffdfa',
    textHex: '#1c1917',
    accentHex: '#c2410c',
  },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  currentThemeMeta: ThemeMeta;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('speckit_theme_id') as ThemeId;
    return saved && THEME_PRESETS.some((t) => t.id === saved) ? saved : 'obsidian';
  });

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('speckit_theme_id', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'obsidian') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [theme]);

  const currentThemeMeta = THEME_PRESETS.find((t) => t.id === theme) || THEME_PRESETS[0];
  const isDark = currentThemeMeta.mode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentThemeMeta, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
