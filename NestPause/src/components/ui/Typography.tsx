import React from 'react';
import { Text, TextStyle } from 'react-native';
import { TypographyProps } from '../../types/design';
import { getTypographyStyle, getTruncationStyle, getTextAlign } from '../../utils/typography';

/**
 * Typography component for consistent text styling across the app
 */
const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  size,
  weight,
  color,
  align,
  numberOfLines,
  style,
  children,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  ...props
}) => {
  // Get base typography style
  const typographyStyle = getTypographyStyle(variant);
  
  // Build the final style
  const textStyle: TextStyle = {
    ...typographyStyle,
    ...(size && { fontSize: size }),
    ...(weight && { fontWeight: weight }),
    ...(color && { color }),
    ...(align && { textAlign: getTextAlign(align) }),
    ...(style && style),
  };

  // Get truncation props
  const truncationProps = getTruncationStyle(numberOfLines);

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      {...truncationProps}
      {...props}
    >
      {children}
    </Text>
  );
};

// Export typography variants as separate components for convenience
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h1" {...props} />
);

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h2" {...props} />
);

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h3" {...props} />
);

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h4" {...props} />
);

export const H5: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h5" {...props} />
);

export const H6: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="h6" {...props} />
);

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodyLarge: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodySmall: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label" {...props} />
);

export const ButtonText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="button" {...props} />
);

export const Overline: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="overline" {...props} />
);

// Export all typography components
export { Typography };
export default Typography;
