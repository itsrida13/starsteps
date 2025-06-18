import React, { createContext, useState, useEffect } from 'react';
import { DarkTheme as PaperDark, DefaultTheme as PaperLight } from 'react-native-paper';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const theme = isDarkMode ? PaperDark : PaperLight;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
