import React from 'react';
import {
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useThemeColors } from './ThemeProvider';
import { CardProps, SpacingKey, ShadowKey } from '../../types/design';
import { getSpacing } from '../../utils/spacing';
import { shadows, borderRadius } from '../../constants/tokens';

/**
 * Card component with consistent styling and behavior
 */
const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 4,
  shadow = 'base',
  onPress,
  children,
  style,
  ...props
}) => {
  const theme = useThemeColors();
  
  // Get card styles based on variant
  const cardStyles = getCardStyles(variant, padding, shadow, theme);
  
  // Build container style
  const containerStyle: ViewStyle = {
    ...cardStyles.container,
    ...(style && style),
  };

  const CardContent = () => (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <CardContent />
      </TouchableOpacity>
    );
  }

  return <CardContent />;
};

// Helper function to get card styles
const getCardStyles = (
  variant: 'elevated' | 'outlined' | 'filled',
  padding: SpacingKey,
  shadow: ShadowKey,
  theme: any
): { container: ViewStyle } => {
  const paddingValue = getSpacing(padding);
  const shadowStyle = shadows[shadow];
  
  const baseContainerStyle: ViewStyle = {
    padding: paddingValue,
    borderRadius: borderRadius.lg,
  };

  switch (variant) {
    case 'elevated':
      return {
        container: {
          ...baseContainerStyle,
          backgroundColor: theme.surface,
          ...shadowStyle,
        },
      };
    case 'outlined':
      return {
        container: {
          ...baseContainerStyle,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        },
      };
    case 'filled':
      return {
        container: {
          ...baseContainerStyle,
          backgroundColor: theme.surfaceVariant,
        },
      };
    default:
      return {
        container: {
          ...baseContainerStyle,
          backgroundColor: theme.surface,
          ...shadowStyle,
        },
      };
  }
};

// Card variants for convenience
export const ElevatedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="elevated" {...props} />
);

export const OutlinedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="outlined" {...props} />
);

export const FilledCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="filled" {...props} />
);

// Specialized card components
export const CompactCard: React.FC<CardProps> = ({ padding = 3, ...props }) => (
  <Card padding={padding} {...props} />
);

export const LargeCard: React.FC<CardProps> = ({ padding = 6, ...props }) => (
  <Card padding={padding} {...props} />
);

export const InteractiveCard: React.FC<CardProps> = ({ 
  onPress,
  shadow = 'sm',
  ...props 
}) => (
  <Card onPress={onPress} shadow={shadow} {...props} />
);

export const StatCard: React.FC<CardProps> = ({ 
  padding = 4,
  shadow = 'sm',
  ...props 
}) => (
  <Card padding={padding} shadow={shadow} {...props} />
);

// Export card component
export { Card };
export default Card;
