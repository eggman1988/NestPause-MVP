import React from 'react';
import { View, ViewStyle } from 'react-native';
import { ContainerProps } from '../../types/design';
import { getSpacingStyle, getMarginStyle, getGapStyle } from '../../utils/spacing';

/**
 * Container component for consistent layout and spacing
 */
const Container: React.FC<ContainerProps> = ({
  padding,
  margin,
  backgroundColor,
  flex,
  direction = 'column',
  justify = 'flex-start',
  align = 'stretch',
  wrap = 'nowrap',
  gap,
  style,
  children,
  ...props
}) => {
  // Build the container style
  const containerStyle: ViewStyle = {
    flexDirection: direction,
    justifyContent: justify,
    alignItems: align,
    flexWrap: wrap,
    ...(flex !== undefined && { flex }),
    ...(backgroundColor && { backgroundColor }),
    ...(padding && getSpacingStyle(padding)),
    ...(margin && getMarginStyle(margin)),
    ...(gap && getGapStyle(gap)),
    ...(style && style),
  };

  return (
    <View style={containerStyle} {...props}>
      {children}
    </View>
  );
};

// Specialized container variants
export const Row: React.FC<Omit<ContainerProps, 'direction'>> = (props) => (
  <Container direction="row" {...props} />
);

export const Column: React.FC<Omit<ContainerProps, 'direction'>> = (props) => (
  <Container direction="column" {...props} />
);

export const Center: React.FC<Omit<ContainerProps, 'justify' | 'align'>> = (props) => (
  <Container justify="center" align="center" {...props} />
);

export const SpaceBetween: React.FC<Omit<ContainerProps, 'justify'>> = (props) => (
  <Container justify="space-between" {...props} />
);

export const SpaceAround: React.FC<Omit<ContainerProps, 'justify'>> = (props) => (
  <Container justify="space-around" {...props} />
);

export const SpaceEvenly: React.FC<Omit<ContainerProps, 'justify'>> = (props) => (
  <Container justify="space-evenly" {...props} />
);

export const FlexStart: React.FC<Omit<ContainerProps, 'justify' | 'align'>> = (props) => (
  <Container justify="flex-start" align="flex-start" {...props} />
);

export const FlexEnd: React.FC<Omit<ContainerProps, 'justify' | 'align'>> = (props) => (
  <Container justify="flex-end" align="flex-end" {...props} />
);

// Screen-level containers
export const Screen: React.FC<ContainerProps> = ({ style, ...props }) => (
  <Container
    flex={1}
    padding={4}
    style={[{ backgroundColor: 'transparent' }, style]}
    {...props}
  />
);

export const SafeScreen: React.FC<ContainerProps> = ({ style, ...props }) => (
  <Container
    flex={1}
    padding={4}
    style={[{ backgroundColor: 'transparent' }, style]}
    {...props}
  />
);

// Content containers
export const Content: React.FC<ContainerProps> = ({ style, ...props }) => (
  <Container
    flex={1}
    style={[{ backgroundColor: 'transparent' }, style]}
    {...props}
  />
);

export const Card: React.FC<ContainerProps> = ({ style, ...props }) => (
  <Container
    padding={4}
    style={[{ backgroundColor: 'transparent' }, style]}
    {...props}
  />
);

// Export all container components
export { Container };
export default Container;
