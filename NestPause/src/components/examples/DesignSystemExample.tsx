import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import {
  ThemeProvider,
  Typography,
  Button,
  Input,
  Card,
  Container,
  Row,
  Column,
  SpaceBetween,
  Center,
  useThemeMode,
} from '../ui';

/**
 * Example screen demonstrating the NestPause Design System
 * This can be used as a reference for implementing the design system
 */
export const DesignSystemExample: React.FC = () => {
  return (
    <ThemeProvider>
      <DesignSystemContent />
    </ThemeProvider>
  );
};

const DesignSystemContent: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = () => {
    Alert.alert(
      'Form Submitted',
      `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
      [{ text: 'OK' }]
    );
  };

  const isFormValid = formData.name.trim() && formData.email.trim();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Container padding={4} gap={6}>
        {/* Header */}
        <Card>
          <SpaceBetween>
            <Typography variant="h2">NestPause Design System</Typography>
            <Button variant="ghost" onPress={toggleTheme}>
              {mode === 'light' ? '🌙' : '☀️'} {mode}
            </Button>
          </SpaceBetween>
          <Typography variant="body" style={{ marginTop: 8 }}>
            A comprehensive design system built with React Native and TypeScript.
          </Typography>
        </Card>

        {/* Typography Showcase */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Typography Scale</Typography>
          <Column gap={8}>
            <Typography variant="h1">Heading 1</Typography>
            <Typography variant="h2">Heading 2</Typography>
            <Typography variant="h3">Heading 3</Typography>
            <Typography variant="h4">Heading 4</Typography>
            <Typography variant="h5">Heading 5</Typography>
            <Typography variant="h6">Heading 6</Typography>
            <Typography variant="body">
              This is body text that demonstrates the typography system with proper spacing and readability.
            </Typography>
            <Typography variant="caption">
              Caption text for secondary information and metadata.
            </Typography>
          </Column>
        </Card>

        {/* Button Showcase */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Button Variants</Typography>
          <Column gap={12}>
            <Row gap={8} wrap="wrap">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </Row>
            <Typography variant="h6">Button Sizes</Typography>
            <Row gap={8} wrap="wrap">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </Row>
            <Typography variant="h6">Button States</Typography>
            <Row gap={8} wrap="wrap">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button icon="→" iconPosition="right">With Icon</Button>
            </Row>
          </Column>
        </Card>

        {/* Input Showcase */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Input Components</Typography>
          <Column gap={12}>
            <Input
              placeholder="Default input"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <Input
              placeholder="Email input"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            <Input
              placeholder="Multiline input"
              multiline
              numberOfLines={3}
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
            />
            <Input
              placeholder="Input with error"
              error
              errorMessage="This field is required"
            />
          </Column>
        </Card>

        {/* Interactive Form */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Interactive Form</Typography>
          <Column gap={12}>
            <Input
              placeholder="Your name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            <Input
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
            />
            <Input
              placeholder="Your message"
              multiline
              numberOfLines={3}
              value={formData.message}
              onChangeText={(text) => setFormData(prev => ({ ...prev, message: text }))}
            />
            <Button
              variant="primary"
              fullWidth
              disabled={!isFormValid}
              onPress={handleSubmit}
            >
              Submit Form
            </Button>
          </Column>
        </Card>

        {/* Card Variants */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Card Variants</Typography>
          <Column gap={12}>
            <Card variant="elevated">
              <Typography variant="h6">Elevated Card</Typography>
              <Typography variant="body">
                This card has an elevated shadow for depth and prominence.
              </Typography>
            </Card>
            <Card variant="outlined">
              <Typography variant="h6">Outlined Card</Typography>
              <Typography variant="body">
                This card has a border outline for subtle definition.
              </Typography>
            </Card>
            <Card variant="filled">
              <Typography variant="h6">Filled Card</Typography>
              <Typography variant="body">
                This card has a filled background for visual grouping.
              </Typography>
            </Card>
          </Column>
        </Card>

        {/* Layout Examples */}
        <Card>
          <Typography variant="h4" style={{ marginBottom: 16 }}>Layout Components</Typography>
          <Column gap={12}>
            <Card>
              <Typography variant="h6" style={{ marginBottom: 8 }}>Space Between</Typography>
              <SpaceBetween>
                <Typography variant="body">Left content</Typography>
                <Typography variant="body">Right content</Typography>
              </SpaceBetween>
            </Card>
            <Card>
              <Typography variant="h6" style={{ marginBottom: 8 }}>Row Layout</Typography>
              <Row gap={8}>
                <Button size="sm">Action 1</Button>
                <Button size="sm" variant="secondary">Action 2</Button>
                <Button size="sm" variant="tertiary">Action 3</Button>
              </Row>
            </Card>
            <Card>
              <Typography variant="h6" style={{ marginBottom: 8 }}>Center Layout</Typography>
              <Center>
                <Button variant="primary">Centered Button</Button>
              </Center>
            </Card>
          </Column>
        </Card>

        {/* Footer */}
        <Card>
          <Center>
            <Typography variant="caption" align="center">
              Built with ❤️ for NestPause
            </Typography>
          </Center>
        </Card>
      </Container>
    </ScrollView>
  );
};

export default DesignSystemExample;
