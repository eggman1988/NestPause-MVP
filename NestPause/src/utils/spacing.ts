import { spacing } from '../constants/tokens';
import { SpacingKey } from '../types/design';

/**
 * Spacing utility functions for the NestPause design system
 */

// Get spacing value
export const getSpacing = (key: SpacingKey): number => {
  return spacing[key];
};

// Convert spacing array to React Native style
export const getSpacingStyle = (spacingValue: SpacingKey | SpacingKey[]): any => {
  if (Array.isArray(spacingValue)) {
    const [top, right, bottom, left] = spacingValue;
    return {
      paddingTop: getSpacing(top),
      paddingRight: getSpacing(right),
      paddingBottom: getSpacing(bottom),
      paddingLeft: getSpacing(left),
    };
  }
  
  const value = getSpacing(spacingValue);
  return {
    padding: value,
  };
};

// Get margin style
export const getMarginStyle = (spacingValue: SpacingKey | SpacingKey[]): any => {
  if (Array.isArray(spacingValue)) {
    const [top, right, bottom, left] = spacingValue;
    return {
      marginTop: getSpacing(top),
      marginRight: getSpacing(right),
      marginBottom: getSpacing(bottom),
      marginLeft: getSpacing(left),
    };
  }
  
  const value = getSpacing(spacingValue);
  return {
    margin: value,
  };
};

// Get padding style
export const getPaddingStyle = (spacingValue: SpacingKey | SpacingKey[]): any => {
  return getSpacingStyle(spacingValue);
};

// Get gap style
export const getGapStyle = (spacingValue: SpacingKey): any => {
  return {
    gap: getSpacing(spacingValue),
  };
};

// Spacing presets for common layouts
export const spacingPresets = {
  // Container spacing
  container: {
    padding: spacing[4] as SpacingKey, // 16px
    margin: spacing[0] as SpacingKey, // 0px
  },
  containerLarge: {
    padding: spacing[6] as SpacingKey, // 24px
    margin: spacing[0] as SpacingKey, // 0px
  },
  containerSmall: {
    padding: spacing[3] as SpacingKey, // 12px
    margin: spacing[0] as SpacingKey, // 0px
  },
  
  // Card spacing
  card: {
    padding: spacing[4] as SpacingKey, // 16px
    margin: spacing[2] as SpacingKey, // 8px
  },
  cardCompact: {
    padding: spacing[3] as SpacingKey, // 12px
    margin: spacing[1] as SpacingKey, // 4px
  },
  
  // Button spacing
  button: {
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
    paddingVertical: spacing[2] as SpacingKey, // 8px
  },
  buttonLarge: {
    paddingHorizontal: spacing[6] as SpacingKey, // 24px
    paddingVertical: spacing[3] as SpacingKey, // 12px
  },
  buttonSmall: {
    paddingHorizontal: spacing[3] as SpacingKey, // 12px
    paddingVertical: spacing[1] as SpacingKey, // 4px
  },
  
  // Input spacing
  input: {
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
    paddingVertical: spacing[2] as SpacingKey, // 8px
  },
  inputLarge: {
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
    paddingVertical: spacing[3] as SpacingKey, // 12px
  },
  inputSmall: {
    paddingHorizontal: spacing[3] as SpacingKey, // 12px
    paddingVertical: spacing[1] as SpacingKey, // 4px
  },
  
  // List item spacing
  listItem: {
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
    paddingVertical: spacing[3] as SpacingKey, // 12px
  },
  listItemCompact: {
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
    paddingVertical: spacing[2] as SpacingKey, // 8px
  },
  
  // Section spacing
  section: {
    paddingVertical: spacing[6] as SpacingKey, // 24px
    paddingHorizontal: spacing[4] as SpacingKey, // 16px
  },
  sectionLarge: {
    paddingVertical: spacing[8] as SpacingKey, // 32px
    paddingHorizontal: spacing[6] as SpacingKey, // 24px
  },
  
  // Grid spacing
  grid: {
    gap: spacing[4] as SpacingKey, // 16px
  },
  gridLarge: {
    gap: spacing[6] as SpacingKey, // 24px
  },
  gridSmall: {
    gap: spacing[2] as SpacingKey, // 8px
  },
} as const;

// Responsive spacing utilities
export const getResponsiveSpacing = (baseSpacing: SpacingKey, scale: number = 1): number => {
  return Math.round(getSpacing(baseSpacing) * scale);
};

// Spacing validation
export const isValidSpacingKey = (key: any): key is SpacingKey => {
  return typeof key === 'string' && key in spacing;
};

// Convert pixel values to spacing keys (for dynamic spacing)
export const pixelToSpacingKey = (pixels: number): SpacingKey => {
  // Find the closest spacing value
  const spacingValues = Object.entries(spacing);
  const closest = spacingValues.reduce((prev, [key, value]) => {
    return Math.abs(value - pixels) < Math.abs(prev[1] - pixels) ? [key, value] : prev;
  });
  
  return closest[0] as unknown as SpacingKey;
};

// Get spacing for different screen densities
export const getDensitySpacing = (baseSpacing: SpacingKey, density: number = 1): number => {
  return Math.round(getSpacing(baseSpacing) * density);
};

// Export commonly used spacing combinations
export const commonSpacing = {
  xs: spacing[1], // 4px
  sm: spacing[2], // 8px
  md: spacing[4], // 16px
  lg: spacing[6], // 24px
  xl: spacing[8], // 32px
  xxl: spacing[12], // 48px
} as const;
