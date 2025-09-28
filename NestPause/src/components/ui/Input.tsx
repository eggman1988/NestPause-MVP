import React, { useState } from 'react';
import {
  TextInput,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColors } from './ThemeProvider';
import { InputProps, ComponentSize } from '../../types/design';
import { getColor, getSemanticColor } from '../../utils/colors';
import { sizes } from '../../constants/tokens';
import { Typography } from './Typography';

/**
 * Input component with consistent styling and behavior
 */
const Input: React.FC<InputProps> = ({
  value,
  placeholder,
  size = 'md',
  disabled = false,
  error = false,
  errorMessage,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  maxLength,
  style,
  ...props
}) => {
  const theme = useThemeColors();
  const [isFocused, setIsFocused] = useState(false);
  
  // Get input styles based on size and state
  const inputStyles = getInputStyles(size, disabled, error, isFocused, multiline, theme);
  
  // Build container style
  const containerStyle: ViewStyle = {
    ...inputStyles.container,
    ...(style && style),
  };

  // Build text input style
  const textInputStyle: TextStyle = {
    ...inputStyles.text,
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handleChangeText = (text: string) => {
    onChangeText?.(text);
  };

  return (
    <View style={{ marginBottom: errorMessage ? 4 : 0 }}>
      <View style={containerStyle}>
        <TextInput
          style={textInputStyle}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={theme.textTertiary}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          editable={!disabled}
          {...props}
        />
      </View>
      {errorMessage && (
        <Typography
          variant="caption"
          style={{ color: getSemanticColor('error', 500), marginTop: 4 }}
        >
          {errorMessage}
        </Typography>
      )}
    </View>
  );
};

// Helper function to get input styles
const getInputStyles = (
  size: ComponentSize,
  disabled: boolean,
  error: boolean,
  isFocused: boolean,
  multiline: boolean,
  theme: any
): { container: ViewStyle; text: TextStyle } => {
  const sizeConfig = sizes.input[size];
  
  const baseContainerStyle: ViewStyle = {
    height: multiline ? undefined : sizeConfig.height,
    paddingHorizontal: sizeConfig.paddingHorizontal,
    paddingVertical: multiline ? 12 : 8,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: multiline ? 'flex-start' : 'center',
    minHeight: multiline ? sizeConfig.height : undefined,
  };

  const baseTextStyle: TextStyle = {
    fontSize: sizeConfig.fontSize,
    color: disabled ? theme.textTertiary : theme.text,
    flex: 1,
    textAlignVertical: multiline ? 'top' : 'center',
  };

  if (disabled) {
    return {
      container: {
        ...baseContainerStyle,
        backgroundColor: theme.surfaceVariant,
        borderColor: theme.borderLight,
      },
      text: {
        ...baseTextStyle,
        color: theme.textTertiary,
      },
    };
  }

  if (error) {
    return {
      container: {
        ...baseContainerStyle,
        backgroundColor: theme.background,
        borderColor: getSemanticColor('error', 500),
      },
      text: baseTextStyle,
    };
  }

  if (isFocused) {
    return {
      container: {
        ...baseContainerStyle,
        backgroundColor: theme.background,
        borderColor: getColor('primary', 500),
        borderWidth: 2,
      },
      text: baseTextStyle,
    };
  }

  return {
    container: {
      ...baseContainerStyle,
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    text: baseTextStyle,
  };
};

// Input variants for convenience
export const SmallInput: React.FC<Omit<InputProps, 'size'>> = (props) => (
  <Input size="sm" {...props} />
);

export const LargeInput: React.FC<Omit<InputProps, 'size'>> = (props) => (
  <Input size="lg" {...props} />
);

export const EmailInput: React.FC<Omit<InputProps, 'keyboardType' | 'autoCapitalize'>> = (props) => (
  <Input
    keyboardType="email-address"
    autoCapitalize="none"
    {...props}
  />
);

export const PasswordInput: React.FC<Omit<InputProps, 'secureTextEntry'>> = (props) => (
  <Input secureTextEntry {...props} />
);

export const PhoneInput: React.FC<Omit<InputProps, 'keyboardType'>> = (props) => (
  <Input keyboardType="phone-pad" {...props} />
);

export const NumberInput: React.FC<Omit<InputProps, 'keyboardType'>> = (props) => (
  <Input keyboardType="numeric" {...props} />
);

export const MultilineInput: React.FC<Omit<InputProps, 'multiline'>> = (props) => (
  <Input multiline numberOfLines={4} {...props} />
);

// Export input component
export { Input };
export default Input;
