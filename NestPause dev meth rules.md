# NestPause Claude Code Development Framework

## Overview

This document establishes a comprehensive methodology for developing the NestPause MVP using Claude Code, based on industry best practices and agentic coding principles. The framework emphasizes iterative development, clear communication patterns, and production-ready code generation.

## Core Methodology: "THINK-BUILD-REVIEW" (TBR)

Based on research, the most effective Claude Code methodology follows a three-phase approach:

### Phase 1: THINK (Planning & Architecture)
- Use the keyword "think" to trigger extended thinking mode
- Break down complex features into manageable tasks
- Define clear acceptance criteria before coding
- Establish data flow and component relationships

### Phase 2: BUILD (Implementation)
- Implement features incrementally using parallel workflows
- Follow established patterns and conventions
- Generate comprehensive tests alongside code
- Maintain consistent code quality standards

### Phase 3: REVIEW (Quality Assurance)
- Conduct thorough code reviews for each change
- Validate against acceptance criteria
- Test integration points and edge cases
- Document implementation decisions

## Claude Code Setup & Configuration

### 1. Environment Preparation

```bash
# Install Claude Code extension
# Supported editors: VS Code, Cursor, Windsurf

# Project initialization
npx create-expo-app NestPause --template typescript
cd NestPause
```

### 2. CLAUDE.md Documentation

Create a comprehensive `CLAUDE.md` file in your project root:

```markdown
# NestPause Development Guide for Claude Code

## Project Overview
NestPause is a family screen-time management app built with React Native/Expo.

## Architecture
- Frontend: React Native with Expo
- Backend: Firebase (Firestore, Auth, Cloud Functions)
- State Management: React Context + Zustand
- Navigation: Expo Router
- Testing: Jest + React Native Testing Library
- CI/CD: Expo EAS

## Key Design Patterns
1. Feature-based folder structure
2. Custom hooks for business logic
3. Compound components for complex UI
4. Service layer for API interactions
5. Type-safe development with TypeScript

## Development Rules
- Follow existing AI_RULES.md constraints
- Use design tokens from tokens.ts
- Write tests for all new features
- Document exported functions
- Use Conventional Commits format
```

### 3. Project Structure Template

```
app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Basic UI primitives
│   │   └── composite/      # Complex composite components
│   ├── features/           # Feature-based modules
│   │   ├── onboarding/
│   │   ├── rules/
│   │   ├── requests/
│   │   ├── reports/
│   │   └── shared/
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and external services
│   ├── store/              # Global state management
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── constants/          # App constants and config
├── __tests__/              # Test files
├── docs/                   # Documentation
└── CLAUDE.md              # AI development guide
```

## Claude Code Communication Patterns

### 1. Task Definition Format

Use this structure for all Claude Code tasks:

```
## Task: [Epic.Story] - [Brief Description]

**Context**: Reference to user story and acceptance criteria
**Scope**: Specific files/components to modify
**Requirements**: 
- Functional requirements
- Technical constraints
- Design system compliance

**Definition of Done**:
- [ ] Feature implemented according to acceptance criteria
- [ ] Tests written and passing
- [ ] TypeScript types defined
- [ ] Design tokens used consistently
- [ ] Documentation updated

**Think**: [Trigger extended thinking mode for complex tasks]
```

### 2. Parallel Workflow Commands

For complex features, use parallel development:

```bash
# Simultaneous development of related components
claude-code --parallel "
Task 1: Implement QR code generation component
Task 2: Create QR code scanning interface  
Task 3: Add device pairing service layer
"
```

### 3. Review and Validation Commands

```bash
# Code quality validation
claude-code --review "
- Check TypeScript compliance
- Validate design token usage
- Ensure test coverage >80%
- Verify accessibility standards
"
```

## Development Workflow

### Sprint Setup (Pre-Development)

1. **Epic Planning Session**
   ```
   Task: Epic Planning - [Epic Name]
   
   Think: Analyze the user stories in this epic and break them down into implementable tasks. Consider:
   - Dependencies between stories
   - Shared components that can be reused
   - API contracts needed
   - Testing strategy
   
   Create a detailed implementation plan with:
   - Task breakdown structure
   - Component hierarchy
   - Data flow diagrams
   - Testing approach
   ```

2. **Architecture Review**
   ```
   Task: Architecture Validation - [Epic Name]
   
   Review the planned architecture for this epic:
   - Component interfaces and props
   - State management strategy
   - API integration points
   - Error handling approach
   - Performance considerations
   ```

### Story Implementation (Development Phase)

#### Step 1: Foundation Setup
```
Task: [Story ID] Foundation - Set up basic structure

Create the foundational structure for this story:
- Feature folder structure
- Basic component shells
- Type definitions
- Test file templates
- Navigation integration points
```

#### Step 2: Core Implementation
```
Task: [Story ID] Implementation - Core functionality

Think: Implement the core functionality step by step:
1. Data models and types
2. Service layer functions
3. Custom hooks for business logic
4. UI components with proper design token usage
5. Integration with existing features

Requirements:
- Follow existing patterns in the codebase
- Use design tokens from tokens.ts
- Implement proper error handling
- Add loading states and user feedback
```

#### Step 3: Testing & Validation
```
Task: [Story ID] Testing - Comprehensive test coverage

Add comprehensive tests:
- Unit tests for utilities and hooks
- Component tests for UI behavior
- Integration tests for workflows
- Accessibility tests
- Edge case handling

Ensure all tests pass and coverage meets requirements.
```

### Quality Assurance Workflow

#### Code Review Checklist
```
Task: Code Review - [Story ID]

Review the implementation against these criteria:
- [ ] Follows AI_RULES.md constraints
- [ ] Uses design tokens consistently
- [ ] TypeScript errors resolved
- [ ] Test coverage >80%
- [ ] Accessibility compliance
- [ ] Performance optimized
- [ ] Error handling implemented
- [ ] Documentation complete
```

#### Integration Testing
```
Task: Integration Testing - [Epic Name]

Test the integration between components:
- Navigation flows work correctly
- State management functions properly
- API calls handle errors gracefully
- Real-time updates work as expected
- Performance meets requirements
```

## Best Practices for Claude Code

### 1. Effective Prompting Techniques

**Use "Think" for Complex Tasks**
Claude Code supports extended thinking mode when you use the word "think" in your prompts, which is crucial for complex architectural decisions.

**Be Specific and Structured**
- Provide clear context about the existing codebase
- Reference specific files and functions
- Include acceptance criteria in prompts
- Ask for specific deliverables

### 2. Incremental Development

**Small, Focused Tasks**
Maintain active oversight to prevent technical debt accumulation by breaking large features into smaller, reviewable chunks.

**Parallel Workflows**
Unlike copy-paste workflows, Claude Code allows you to set tasks, monitor progress in real-time, and review completed work.

### 3. Code Quality Maintenance

**Continuous Review**
- Review each change before proceeding
- Validate against existing patterns
- Check for consistency with design system
- Ensure proper error handling

**Technical Debt Prevention**
- Regular refactoring sessions
- Consistent coding standards
- Automated testing requirements
- Documentation updates

## Feature-Specific Guidelines

### Epic 1: Onboarding & Pairing
```
Development Focus:
- QR code generation/scanning components
- Authentication flow integration
- Device registration service
- Permission handling utilities

Key Considerations:
- Camera permissions for QR scanning
- Real-time WebSocket connections for pairing
- Error states for failed pairing attempts
- Accessibility for vision-impaired users
```

### Epic 2: Rules Engine
```
Development Focus:
- Time management utilities
- Rule validation logic
- Device activity integration
- Notification scheduling

Key Considerations:
- Timezone handling across devices
- Background task management
- iOS Family Controls integration
- VPN/DNS fallback implementation
```

### Epic 3: Requests & Approvals
```
Development Focus:
- Push notification handling
- Real-time state synchronization
- Request UI components
- Parent approval workflow

Key Considerations:
- Background app refresh
- Notification action handlers
- Conflict resolution for simultaneous approvals
- Request expiration logic
```

## Testing Strategy

### Unit Testing
```typescript
// Example test structure
describe('QuotaManager', () => {
  describe('calculateRemainingTime', () => {
    it('should return correct remaining time for daily quota', () => {
      // Test implementation
    });
    
    it('should handle weekend bonus correctly', () => {
      // Test implementation  
    });
    
    it('should respect focus block restrictions', () => {
      // Test implementation
    });
  });
});
```

### Integration Testing
- Authentication flow end-to-end
- Device pairing workflow
- Rule enforcement scenarios
- Request/approval cycles

### Performance Testing
- Component render performance
- API response times
- Background task efficiency
- Memory usage optimization

## Deployment Preparation

### Pre-Deployment Checklist
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] Design system compliance verified
- [ ] Accessibility testing complete
- [ ] Performance benchmarks met
- [ ] Security review completed
- [ ] App Store guidelines compliance
- [ ] Privacy policy implementation

### Release Management
```
Task: Release Preparation - MVP v1.0

Prepare the app for release:
1. Version bumping and changelog
2. App Store metadata and screenshots
3. TestFlight beta distribution
4. Performance optimization
5. Final security audit
6. Documentation completion
```

## Monitoring and Maintenance

### Post-Launch Tasks
```
Task: Post-Launch Monitoring Setup

Implement monitoring and analytics:
- Crash reporting integration
- User behavior analytics
- Performance monitoring
- Error tracking and alerting
- User feedback collection
```

This framework provides a structured approach to developing NestPause with Claude Code, ensuring high-quality, maintainable code that meets all requirements while leveraging the full power of AI-assisted development.