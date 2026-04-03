'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context
const ThemeContext = createContext();

// 2. Create the Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to Dark Mode

  // Check if the user already saved a preference when the app loads
  useEffect(() => {
    const savedTheme = localStorage.getItem('studentos-theme');
    if (savedTheme === 'light') {
      setIsDark(false);
    }
  }, []);

  // The function to flip the switch and save it to browser memory
  const toggleTheme = () => {
    setIsDark(!isDark);
    localStorage.setItem('studentos-theme', !isDark ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a custom hook so our pages can easily talk to this brain
export const useTheme = () => useContext(ThemeContext);