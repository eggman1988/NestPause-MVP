import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { themes } from '../../constants/tokens';
import { ThemeContextType, ThemeMode, Theme } from '../../types/design';

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: ThemeMode;
  enableSystemTheme?: boolean;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialTheme,
  enableSystemTheme = true,
}) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (initialTheme) return initialTheme;
    if (enableSystemTheme) {
      const systemTheme = Appearance.getColorScheme();
      return systemTheme === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });

  const [theme, setThemeState] = useState<Theme>(themes[mode]);

  // Listen to system theme changes
  useEffect(() => {
    if (!enableSystemTheme) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }: { colorScheme: ColorSchemeName }) => {
      if (colorScheme) {
        setMode(colorScheme === 'dark' ? 'dark' : 'light');
      }
    });

    return () => subscription?.remove();
  }, [enableSystemTheme]);

  // Update theme when mode changes
  useEffect(() => {
    setThemeState(themes[mode]);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    mode,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get theme colors
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme;
};

// Hook to get theme mode
export const useThemeMode = () => {
  const { mode, toggleTheme, setTheme } = useTheme();
  return { mode, toggleTheme, setTheme };
};

// Export theme context for advanced usage
export { ThemeContext };
