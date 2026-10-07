import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  beginnerMode: boolean;
  toggleBeginnerMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  toggleTheme: () => {},
  beginnerMode: false,
  toggleBeginnerMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('mco_theme');
    return saved ? saved === 'dark' : true; // Default to dark navy theme
  });

  const [beginnerMode, setBeginnerMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mco_beginner_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mco_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('mco_beginner_mode', String(beginnerMode));
  }, [beginnerMode]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const toggleBeginnerMode = () => setBeginnerMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, beginnerMode, toggleBeginnerMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
