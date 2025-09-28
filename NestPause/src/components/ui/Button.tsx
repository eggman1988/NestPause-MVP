import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors } from './ThemeProvider';
import { ButtonProps, ComponentVariant, ComponentSize } from '../../types/design';
import { getColor } from '../../utils/colors';
import { sizes } from '../../constants/tokens';
import { Typography } from './Typography';

/**
 * Button component with consistent styling and behavior
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  style,
  ...props
}) => {
  const theme = useThemeColors();
  
  // Get button styles based on variant and size
  const buttonStyles = getButtonStyles(variant, size, disabled, theme);
  const textStyles = getButtonTextStyles(variant, size, disabled, theme);
  
  // Build container style
  const containerStyle: ViewStyle = {
    ...buttonStyles.container,
    ...(fullWidth && { width: '100%' }),
    ...(style && style),
  };

  const handlePress = () => {
    if (!disabled && !loading && onPress) {
      onPress();
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={textStyles.color}
          style={{ marginRight: icon ? 8 : 0 }}
        />
      );
    }

    const iconElement = icon ? (
      <Typography
        variant="button"
        style={{
          color: textStyles.color,
          fontSize: textStyles.fontSize,
          marginRight: iconPosition === 'left' ? 8 : 0,
          marginLeft: iconPosition === 'right' ? 8 : 0,
        }}
      >
        {icon}
      </Typography>
    ) : null;

    const textElement = children ? (
      <Typography
        variant="button"
        style={{
          color: textStyles.color,
          fontSize: textStyles.fontSize,
          fontWeight: textStyles.fontWeight,
        }}
      >
        {children}
      </Typography>
    ) : null;

    if (iconPosition === 'left') {
      return (
        <>
          {iconElement}
          {textElement}
        </>
      );
    }

    return (
      <>
        {textElement}
        {iconElement}
      </>
    );
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

// Helper function to get button styles
const getButtonStyles = (
  variant: ComponentVariant,
  size: ComponentSize,
  disabled: boolean,
  theme: any
): { container: ViewStyle } => {
  const sizeConfig = sizes.button[size];
  const baseStyles = {
    height: sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    borderRadius: 8,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  if (disabled) {
    return {
      container: {
        ...baseStyles,
        backgroundColor: theme.borderLight,
        borderWidth: 0,
      },
    };
  }

  switch (variant) {
    case 'primary':
      return {
        container: {
          ...baseStyles,
          backgroundColor: getColor('primary', 500),
          borderWidth: 0,
        },
      };
    case 'secondary':
      return {
        container: {
          ...baseStyles,
          backgroundColor: getColor('secondary', 500),
          borderWidth: 0,
        },
      };
    case 'tertiary':
      return {
        container: {
          ...baseStyles,
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        },
      };
    case 'ghost':
      return {
        container: {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 0,
        },
      };
    case 'destructive':
      return {
        container: {
          ...baseStyles,
          backgroundColor: getColor('error', 500),
          borderWidth: 0,
        },
      };
    default:
      return {
        container: {
          ...baseStyles,
          backgroundColor: getColor('primary', 500),
          borderWidth: 0,
        },
      };
  }
};

// Helper function to get button text styles
const getButtonTextStyles = (
  variant: ComponentVariant,
  size: ComponentSize,
  disabled: boolean,
  theme: any
): TextStyle => {
  const sizeConfig = sizes.button[size];
  
  if (disabled) {
    return {
      color: theme.textTertiary,
      fontSize: sizeConfig.fontSize,
      fontWeight: '500',
    };
  }

  switch (variant) {
    case 'primary':
    case 'secondary':
    case 'destructive':
      return {
        color: theme.background,
        fontSize: sizeConfig.fontSize,
        fontWeight: '500',
      };
    case 'tertiary':
      return {
        color: theme.text,
        fontSize: sizeConfig.fontSize,
        fontWeight: '500',
      };
    case 'ghost':
      return {
        color: getColor('primary', 500),
        fontSize: sizeConfig.fontSize,
        fontWeight: '500',
      };
    default:
      return {
        color: theme.background,
        fontSize: sizeConfig.fontSize,
        fontWeight: '500',
      };
  }
};

// Button variants for convenience
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const TertiaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="tertiary" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const DestructiveButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="destructive" {...props} />
);

// Export button component
export { Button };
export default Button;
