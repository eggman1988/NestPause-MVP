import { typography } from '../constants/tokens';
import { FontSize, FontWeight } from '../types/design';
import { Platform } from 'react-native';

/**
 * Typography utility functions for the NestPause design system
 */

// Get font family based on platform
export const getFontFamily = (weight: FontWeight = 'normal'): string => {
  const platform = Platform.OS;
  
  if (platform === 'ios') {
    return (typography.fontFamily.ios as any)[weight] || typography.fontFamily.ios.regular;
  } else if (platform === 'android') {
    return (typography.fontFamily.android as any)[weight] || typography.fontFamily.android.regular;
  }
  
  return (typography.fontFamily as any)[weight] || typography.fontFamily.regular;
};

// Get font size
export const getFontSize = (size: FontSize): number => {
  return typography.fontSize[size] || typography.fontSize.base;
};

// Get line height
export const getLineHeight = (size: FontSize): number => {
  return typography.lineHeight[size] || typography.lineHeight.base;
};

// Get font weight
export const getFontWeight = (weight: FontWeight): string => {
  return typography.fontWeight[weight] || typography.fontWeight.normal;
};

// Typography scale presets
export const typographyScale = {
  h1: {
    fontSize: typography.fontSize['5xl'],
    lineHeight: typography.lineHeight['5xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: typography.fontSize['4xl'],
    lineHeight: typography.lineHeight['4xl'],
    fontWeight: typography.fontWeight.bold,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: typography.fontSize['3xl'],
    lineHeight: typography.lineHeight['3xl'],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0,
  },
  h4: {
    fontSize: typography.fontSize['2xl'],
    lineHeight: typography.lineHeight['2xl'],
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0,
  },
  h5: {
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0,
  },
  h6: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0,
  },
  body: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: typography.fontSize.lg,
    lineHeight: typography.lineHeight.lg,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: 0,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.normal,
    letterSpacing: 0.25,
  },
  label: {
    fontSize: typography.fontSize.sm,
    lineHeight: typography.lineHeight.sm,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.1,
  },
  button: {
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.base,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 0.25,
  },
  overline: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
} as const;

// Get typography style by variant
export const getTypographyStyle = (variant: keyof typeof typographyScale) => {
  const style = typographyScale[variant];
  return {
    fontFamily: getFontFamily(style.fontWeight as FontWeight),
    fontSize: style.fontSize,
    lineHeight: style.lineHeight,
    fontWeight: style.fontWeight,
    letterSpacing: style.letterSpacing,
    ...((style as any).textTransform && { textTransform: (style as any).textTransform }),
  };
};

// Responsive typography (for different screen sizes)
export const getResponsiveFontSize = (baseSize: FontSize, scale: number = 1): number => {
  const baseFontSize = getFontSize(baseSize);
  return Math.round(baseFontSize * scale);
};

// Calculate optimal line height based on font size
export const calculateLineHeight = (fontSize: number, ratio: number = 1.5): number => {
  return Math.round(fontSize * ratio);
};

// Text truncation utilities
export const getTruncationStyle = (numberOfLines?: number) => {
  if (numberOfLines === 1) {
    return {
      numberOfLines: 1,
      ellipsizeMode: 'tail' as const,
    };
  }
  
  if (numberOfLines && numberOfLines > 1) {
    return {
      numberOfLines,
      ellipsizeMode: 'tail' as const,
    };
  }
  
  return {};
};

// Text alignment utilities
export const getTextAlign = (align?: 'left' | 'center' | 'right' | 'justify') => {
  return align || 'left';
};

// Text color utilities
export const getTextColor = (variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled') => {
  // This would typically use theme colors, but for now we'll use static values
  switch (variant) {
    case 'primary':
      return '#111827'; // neutral-900
    case 'secondary':
      return '#6b7280'; // neutral-500
    case 'tertiary':
      return '#9ca3af'; // neutral-400
    case 'disabled':
      return '#d1d5db'; // neutral-300
    default:
      return '#111827';
  }
};

// Accessibility utilities
export const getMinimumFontSize = (): number => {
  // WCAG recommends minimum 16px for body text
  return 16;
};

export const getMaximumFontSize = (): number => {
  // Reasonable maximum for mobile
  return 60;
};

// Font loading utilities (for custom fonts)
export const loadCustomFonts = async () => {
  // This would be used if we had custom fonts to load
  // For now, we're using system fonts
  return Promise.resolve();
};

// Typography validation
export const isValidFontSize = (size: number): boolean => {
  return size >= getMinimumFontSize() && size <= getMaximumFontSize();
};

export const isValidFontWeight = (weight: string): boolean => {
  return Object.values(typography.fontWeight).includes(weight as any);
};

// Export typography presets for easy access
export const typographyPresets = {
  display: typographyScale.h1,
  headline: typographyScale.h2,
  title: typographyScale.h3,
  subtitle: typographyScale.h4,
  body: typographyScale.body,
  caption: typographyScale.caption,
  button: typographyScale.button,
  label: typographyScale.label,
} as const;
