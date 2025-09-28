import { colors, themes } from '../constants/tokens';
import { ColorKey, ColorShade, ThemeMode } from '../types/design';

/**
 * Color utility functions for the NestPause design system
 */

// Get color from the color palette
export const getColor = (colorKey: ColorKey, shade: ColorShade = 500): string => {
  const colorScale = colors[colorKey] as any;
  if (!colorScale || typeof colorScale !== 'object') {
    console.warn(`Color key "${colorKey}" not found in color palette`);
    return colors.primary[500]; // Fallback color
  }
  
  return colorScale[shade] || colorScale[500] || '#000000';
};

// Get theme color
export const getThemeColor = (themeMode: ThemeMode, colorKey: keyof typeof themes.light): string => {
  return themes[themeMode][colorKey];
};

// Get semantic color based on context
export const getSemanticColor = (type: 'success' | 'warning' | 'error' | 'info', shade: ColorShade = 500): string => {
  switch (type) {
    case 'success':
      return getColor('success', shade);
    case 'warning':
      return getColor('warning', shade);
    case 'error':
      return getColor('error', shade);
    case 'info':
      return getColor('primary', shade);
    default:
      return getColor('primary', shade);
  }
};

// Get iOS system color
export const getIOSColor = (colorName: keyof typeof colors.ios): string => {
  return colors.ios[colorName];
};

// Color manipulation utilities
export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Lighten or darken a color
export const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * amount);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
};

// Get contrast color (black or white) for a given background
export const getContrastColor = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? colors.neutral[900] : colors.neutral[0];
};

// Get hover/focus states for interactive elements
export const getInteractiveColor = (baseColor: string, state: 'hover' | 'active' | 'disabled' = 'hover'): string => {
  switch (state) {
    case 'hover':
      return adjustColor(baseColor, -10); // Slightly darker
    case 'active':
      return adjustColor(baseColor, -20); // Darker
    case 'disabled':
      return hexToRgba(baseColor, 0.5); // Semi-transparent
    default:
      return baseColor;
  }
};

// Generate color variants for a component
export const generateColorVariants = (baseColor: string) => {
  return {
    default: baseColor,
    hover: getInteractiveColor(baseColor, 'hover'),
    active: getInteractiveColor(baseColor, 'active'),
    disabled: getInteractiveColor(baseColor, 'disabled'),
    background: hexToRgba(baseColor, 0.1),
    border: hexToRgba(baseColor, 0.2),
  };
};

// Color validation
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

// Convert color name to hex (for common color names)
export const colorNameToHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    black: '#000000',
    white: '#ffffff',
    red: '#ff0000',
    green: '#008000',
    blue: '#0000ff',
    yellow: '#ffff00',
    orange: '#ffa500',
    purple: '#800080',
    pink: '#ffc0cb',
    gray: '#808080',
    grey: '#808080',
  };
  
  return colorMap[colorName.toLowerCase()] || colorName;
};

// Get color palette for a specific color family
export const getColorPalette = (colorKey: ColorKey) => {
  return colors[colorKey];
};

// Export commonly used color combinations
export const colorCombinations = {
  primary: {
    background: colors.primary[500],
    text: colors.neutral[0],
    border: colors.primary[600],
  },
  secondary: {
    background: colors.secondary[500],
    text: colors.neutral[0],
    border: colors.secondary[600],
  },
  success: {
    background: colors.success[500],
    text: colors.neutral[0],
    border: colors.success[600],
  },
  warning: {
    background: colors.warning[500],
    text: colors.neutral[0],
    border: colors.warning[600],
  },
  error: {
    background: colors.error[500],
    text: colors.neutral[0],
    border: colors.error[600],
  },
  neutral: {
    background: colors.neutral[100],
    text: colors.neutral[900],
    border: colors.neutral[200],
  },
};

// Accessibility color utilities
export const getAccessibleColor = (backgroundColor: string, textColor?: string): string => {
  if (textColor) return textColor;
  return getContrastColor(backgroundColor);
};

// Check if two colors have sufficient contrast (WCAG AA)
export const hasSufficientContrast = (color1: string, color2: string, _ratio: number = 4.5): boolean => {
  // This is a simplified check - in a real app, you'd use a proper contrast calculation library
  const contrastColor = getContrastColor(color1);
  return contrastColor === color2;
};
