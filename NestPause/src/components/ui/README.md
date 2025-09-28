# NestPause Design System

A comprehensive design system built with React Native, TypeScript, and modern design principles. This design system provides a consistent, accessible, and scalable foundation for building beautiful user interfaces.

## 🎨 Features

- **Comprehensive Token System**: Colors, typography, spacing, shadows, and more
- **Light/Dark Mode Support**: Automatic theme switching with system preference detection
- **TypeScript First**: Full type safety and excellent developer experience
- **Accessibility Ready**: WCAG compliant components with proper accessibility props
- **iOS Design Guidelines**: Follows Apple's Human Interface Guidelines
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Component Stories**: Comprehensive examples and documentation

## 📦 Installation

The design system is already integrated into the NestPause project. Import components from the main entry point:

```typescript
import { Button, Input, Card, Typography, ThemeProvider } from '@/src/design-system';
```

## 🚀 Quick Start

### 1. Wrap your app with the ThemeProvider

```typescript
import React from 'react';
import { ThemeProvider } from '@/src/design-system';

export default function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Use components in your screens

```typescript
import React from 'react';
import { View } from 'react-native';
import { Button, Input, Card, Typography } from '@/src/design-system';

export function LoginScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Typography variant="h2">Welcome Back</Typography>
      
      <Card>
        <Input placeholder="Email" keyboardType="email-address" />
        <Input placeholder="Password" secureTextEntry />
        <Button variant="primary" fullWidth>Sign In</Button>
      </Card>
    </View>
  );
}
```

## 🎯 Core Components

### Typography

```typescript
import { Typography, H1, H2, H3, Body, Caption } from '@/src/design-system';

// Using the main Typography component
<Typography variant="h1">Heading 1</Typography>
<Typography variant="body">Body text</Typography>

// Using convenience components
<H1>Heading 1</H1>
<Body>Body text</Body>
<Caption>Caption text</Caption>
```

### Buttons

```typescript
import { Button, PrimaryButton, SecondaryButton } from '@/src/design-system';

// Different variants
<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="tertiary">Tertiary Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Destructive Button</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// With icons and states
<Button icon="→" iconPosition="right">With Icon</Button>
<Button loading>Loading</Button>
<Button disabled>Disabled</Button>
```

### Inputs

```typescript
import { Input, EmailInput, PasswordInput } from '@/src/design-system';

// Basic input
<Input placeholder="Enter text..." />

// Specialized inputs
<EmailInput placeholder="Enter email..." />
<PasswordInput placeholder="Enter password..." />

// With validation
<Input 
  placeholder="Required field"
  error
  errorMessage="This field is required"
/>

// Multiline
<Input 
  placeholder="Enter description..."
  multiline
  numberOfLines={4}
/>
```

### Cards

```typescript
import { Card, ElevatedCard, OutlinedCard } from '@/src/design-system';

// Different variants
<Card variant="elevated">
  <Typography variant="h6">Elevated Card</Typography>
</Card>

<Card variant="outlined">
  <Typography variant="h6">Outlined Card</Typography>
</Card>

<Card variant="filled">
  <Typography variant="h6">Filled Card</Typography>
</Card>

// Interactive card
<Card onPress={() => console.log('Card pressed')}>
  <Typography variant="h6">Clickable Card</Typography>
</Card>
```

### Layout

```typescript
import { Container, Row, Column, Center, SpaceBetween } from '@/src/design-system';

// Container with padding and gap
<Container padding={4} gap={16}>
  <Typography variant="h3">Title</Typography>
  <Typography variant="body">Content</Typography>
</Container>

// Row layout
<Row gap={8}>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</Row>

// Column layout
<Column gap={12}>
  <Input placeholder="Input 1" />
  <Input placeholder="Input 2" />
</Column>

// Space between
<SpaceBetween>
  <Typography variant="body">Left content</Typography>
  <Typography variant="body">Right content</Typography>
</SpaceBetween>

// Center content
<Center>
  <Button>Centered Button</Button>
</Center>
```

## 🎨 Theming

### Using the Theme Hook

```typescript
import { useThemeColors, useThemeMode } from '@/src/design-system';

function MyComponent() {
  const theme = useThemeColors();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <View style={{ backgroundColor: theme.surface }}>
      <Typography style={{ color: theme.text }}>
        Current theme: {mode}
      </Typography>
      <Button onPress={toggleTheme}>
        Toggle Theme
      </Button>
    </View>
  );
}
```

### Custom Theme Provider

```typescript
import { ThemeProvider } from '@/src/design-system';

// With initial theme
<ThemeProvider initialTheme="dark">
  {/* Your app */}
</ThemeProvider>

// Disable system theme detection
<ThemeProvider enableSystemTheme={false}>
  {/* Your app */}
</ThemeProvider>
```

## 🎯 Design Tokens

### Colors

```typescript
import { colors } from '@/src/design-system';

// Primary colors
colors.primary[500] // Main brand color
colors.primary[600] // Darker shade
colors.primary[400] // Lighter shade

// Semantic colors
colors.success[500] // Success state
colors.warning[500] // Warning state
colors.error[500]   // Error state

// Neutral colors
colors.neutral[900] // Dark text
colors.neutral[500] // Medium text
colors.neutral[100] // Light background
```

### Typography

```typescript
import { typography } from '@/src/design-system';

// Font sizes
typography.fontSize.sm    // 14px
typography.fontSize.base  // 16px
typography.fontSize.lg    // 18px
typography.fontSize.xl    // 20px

// Font weights
typography.fontWeight.normal   // 400
typography.fontWeight.medium   // 500
typography.fontWeight.semibold // 600
typography.fontWeight.bold     // 700
```

### Spacing

```typescript
import { spacing } from '@/src/design-system';

// 8pt grid system
spacing[1]  // 4px
spacing[2]  // 8px
spacing[4]  // 16px
spacing[6]  // 24px
spacing[8]  // 32px
```

## 📱 Responsive Design

The design system uses a mobile-first approach with flexible layouts:

```typescript
import { Container, Row, Column } from '@/src/design-system';

// Responsive container
<Container 
  padding={[2, 4, 6]} // Different padding for different screen sizes
  direction="row"     // Horizontal on larger screens
>
  {/* Content */}
</Container>
```

## ♿ Accessibility

All components are built with accessibility in mind:

```typescript
import { Button, Input, Typography } from '@/src/design-system';

// Accessible button
<Button
  accessibilityLabel="Sign in to your account"
  accessibilityHint="Double tap to sign in"
>
  Sign In
</Button>

// Accessible input
<Input
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email address"
  placeholder="Email"
/>

// Accessible typography
<Typography
  variant="h1"
  accessibilityRole="header"
>
  Welcome
</Typography>
```

## 🧪 Testing

The design system includes comprehensive stories for testing and documentation. Each component has multiple variants and states demonstrated in the stories.

## 📚 Storybook

View all components and their variants in Storybook:

```bash
npm run storybook
```

## 🤝 Contributing

When adding new components to the design system:

1. Follow the existing patterns and naming conventions
2. Add comprehensive TypeScript types
3. Include accessibility props
4. Create stories for documentation
5. Test in both light and dark modes
6. Ensure mobile responsiveness

## 📄 License

This design system is part of the NestPause project and follows the same licensing terms.
