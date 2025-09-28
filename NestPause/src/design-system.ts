/**
 * NestPause Design System
 * 
 * This file serves as the main entry point for the design system.
 * Import from here to get access to all design system components, utilities, and tokens.
 */

// Components
export * from './components/ui/index';

// Utilities
export * from './utils/colors';
export * from './utils/typography';
export * from './utils/spacing';

// Types
export * from './types/design';

// Constants
export * from './constants/tokens';

// Default exports for common usage
export { ThemeProvider as DesignSystemProvider } from './components/ui/ThemeProvider';
export { Typography } from './components/ui/Typography';
export { Button } from './components/ui/Button';
export { Input } from './components/ui/Input';
export { Card } from './components/ui/Card';
export { Container } from './components/ui/Container';
