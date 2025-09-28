# NestPause AI Development Rules

## Overview
This document establishes strict guidelines for AI-assisted development of the NestPause MVP. These rules ensure code quality, security, and maintainability while leveraging AI capabilities effectively.

## Core Development Principles

### 1. Type Safety First
- **MANDATORY**: All code must be fully typed with TypeScript
- Use strict TypeScript configuration (`strict: true`)
- No `any` types without explicit justification and documentation
- Define interfaces for all data structures before implementation
- Use type guards for runtime type checking

### 2. Security & Privacy
- **CRITICAL**: Never hardcode API keys, secrets, or sensitive data
- Use environment variables for all configuration
- Implement proper input validation and sanitization
- Follow COPPA compliance for child data handling
- Encrypt sensitive data at rest and in transit
- Implement proper authentication and authorization

### 3. Code Quality Standards
- Follow established patterns in the codebase
- Use design tokens from `tokens.ts` for all styling
- Implement proper error handling with user-friendly messages
- Write comprehensive tests for all new features (>80% coverage)
- Use meaningful variable and function names
- Document all exported functions and complex logic

### 4. Architecture Constraints
- Follow the feature-based folder structure strictly
- Use Zustand for global state management
- Implement custom hooks for business logic
- Use compound components for complex UI
- Separate concerns: UI, business logic, and data access
- Follow React Native best practices

### 5. Performance Requirements
- Optimize for mobile performance
- Implement lazy loading for heavy components
- Use React.memo and useMemo appropriately
- Minimize bundle size and dependencies
- Implement proper loading states and error boundaries

## Development Workflow Rules

### 1. Feature Development Process
1. **Planning Phase**: Define acceptance criteria and component interfaces
2. **Type Definition**: Create TypeScript types before implementation
3. **Test-Driven**: Write tests alongside implementation
4. **Review**: Validate against design system and patterns
5. **Integration**: Test with existing features

### 2. Code Review Checklist
- [ ] TypeScript compilation passes without errors
- [ ] All tests pass with >80% coverage
- [ ] Design tokens used consistently
- [ ] No hardcoded values or magic numbers
- [ ] Proper error handling implemented
- [ ] Accessibility standards met
- [ ] Performance optimized
- [ ] Security best practices followed

### 3. Git Workflow
- Use Conventional Commits format
- Create feature branches from main
- Squash commits before merging
- Include tests in the same commit as features
- Update documentation with changes

## Technology Stack Constraints

### 1. Approved Dependencies
**Core Framework:**
- React Native with Expo (managed workflow)
- Expo Router for navigation
- TypeScript for type safety

**State Management:**
- Zustand for global state
- React Context for component-level state
- React Query for server state (if needed)

**Backend Services:**
- Firebase Firestore for database
- Firebase Auth for authentication
- Firebase Cloud Functions for server logic
- Firebase Cloud Messaging for notifications

**UI & Styling:**
- React Native built-in components
- Expo Vector Icons
- Design tokens from tokens.ts
- No external UI libraries without approval

**Testing:**
- Jest for unit testing
- React Native Testing Library for component testing
- Detox for E2E testing (future)

### 2. Forbidden Dependencies
- No jQuery or DOM manipulation libraries
- No CSS-in-JS libraries (use StyleSheet)
- No state management libraries other than Zustand
- No UI component libraries without explicit approval
- No native modules without Expo compatibility

## Feature-Specific Rules

### 1. Authentication & User Management
- Use Firebase Auth exclusively
- Implement proper session management
- Handle offline authentication gracefully
- Validate user roles on both client and server
- Implement proper logout and session cleanup

### 2. Device Management & Pairing
- Use QR codes for device pairing
- Implement proper camera permissions
- Handle pairing failures gracefully
- Validate device compatibility
- Implement device removal and cleanup

### 3. Rules Engine
- Validate all time-based rules on server
- Handle timezone differences properly
- Implement rule conflict resolution
- Cache rules locally for offline access
- Provide clear rule violation feedback

### 4. Real-time Features
- Use Firebase Firestore real-time listeners
- Implement proper connection state handling
- Handle offline scenarios gracefully
- Optimize for battery usage
- Implement proper cleanup on unmount

### 5. Notifications
- Use Expo Notifications exclusively
- Handle notification permissions properly
- Implement notification categories
- Support both local and push notifications
- Provide notification settings

## UI/UX Guidelines

### 1. Design System Compliance
- Use only colors from the design tokens
- Follow spacing guidelines (8pt grid)
- Use consistent typography scale
- Implement proper touch targets (44pt minimum)
- Follow iOS Human Interface Guidelines

### 2. Accessibility Requirements
- Implement proper semantic labels
- Support screen readers
- Ensure sufficient color contrast
- Provide alternative text for images
- Support dynamic text sizing
- Test with accessibility tools

### 3. Responsive Design
- Design for multiple screen sizes
- Use flexible layouts
- Implement proper safe area handling
- Test on various device sizes
- Handle orientation changes

### 4. Loading & Error States
- Implement loading indicators for all async operations
- Provide meaningful error messages
- Implement retry mechanisms
- Show offline indicators
- Handle empty states gracefully

## Testing Requirements

### 1. Unit Testing
- Test all utility functions
- Test custom hooks
- Test business logic
- Mock external dependencies
- Achieve >80% code coverage

### 2. Component Testing
- Test component rendering
- Test user interactions
- Test prop variations
- Test error states
- Test accessibility features

### 3. Integration Testing
- Test feature workflows
- Test navigation flows
- Test state management
- Test API integrations
- Test real-time updates

## Security Guidelines

### 1. Data Protection
- Encrypt sensitive data
- Implement proper data validation
- Use secure communication protocols
- Follow COPPA compliance for child data
- Implement data retention policies

### 2. Authentication Security
- Use secure authentication methods
- Implement proper session management
- Handle authentication errors securely
- Implement account lockout mechanisms
- Use secure password requirements

### 3. API Security
- Validate all inputs
- Implement rate limiting
- Use proper authorization
- Log security events
- Handle errors securely

## Performance Guidelines

### 1. Mobile Optimization
- Minimize app startup time
- Optimize image loading
- Implement proper caching
- Minimize network requests
- Optimize battery usage

### 2. Memory Management
- Implement proper cleanup
- Avoid memory leaks
- Optimize component re-renders
- Use lazy loading appropriately
- Monitor memory usage

## Deployment Rules

### 1. Build Configuration
- Use production builds for releases
- Minimize bundle size
- Implement proper error reporting
- Configure proper app metadata
- Test on physical devices

### 2. Release Process
- Test on multiple devices
- Validate all features work offline
- Check performance benchmarks
- Verify security measures
- Update documentation

## Monitoring & Maintenance

### 1. Error Tracking
- Implement crash reporting
- Monitor performance metrics
- Track user behavior
- Monitor API usage
- Set up alerting

### 2. Updates & Maintenance
- Plan for regular updates
- Implement feature flags
- Monitor user feedback
- Track app store reviews
- Plan deprecation strategies

## AI Development Guidelines

### 1. AI-Assisted Coding
- Always validate AI-generated code
- Test all AI suggestions thoroughly
- Review for security vulnerabilities
- Ensure code follows established patterns
- Document AI-assisted implementations

### 2. Code Review Process
- Human review required for all AI-generated code
- Validate against these rules
- Test thoroughly before merging
- Update documentation as needed
- Learn from AI suggestions

This document serves as the definitive guide for all development decisions. Any deviations must be documented and approved through the proper channels.
