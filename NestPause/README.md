# NestPause MVP

A family screen-time management app built with React Native and Expo, designed to help parents monitor and control their children's device usage through intelligent rules, real-time monitoring, and collaborative family management.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.19.4 or higher
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NestPause
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## 📱 Features

### MVP Features
- **Family Account Management** - Create and manage family accounts with parent/child roles
- **Device Pairing** - Secure QR code-based device pairing system
- **Screen Time Rules** - Create time limits, bedtime restrictions, and focus blocks
- **Request System** - Children can request additional time or app access
- **Real-time Monitoring** - Live device usage tracking and reporting
- **Push Notifications** - Instant notifications for requests and violations

### Planned Features
- Advanced analytics and insights
- Cross-platform support (Android)
- AI-powered usage recommendations
- Integration with school systems
- Parental collaboration features

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native 0.76+ with Expo 52+
- **Navigation**: Expo Router with typed routes
- **State Management**: Zustand for global state
- **Backend**: Firebase (Firestore, Auth, Cloud Functions)
- **Notifications**: Firebase Cloud Messaging
- **Testing**: Jest + React Native Testing Library
- **Language**: TypeScript with strict mode

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic primitives (Button, Input, Card)
│   └── composite/      # Complex components (RuleCard, DeviceStatus)
├── features/           # Feature-based modules
│   ├── onboarding/     # Registration, pairing, setup
│   ├── rules/          # Rule creation and management
│   ├── requests/       # Request and approval system
│   ├── reports/        # Usage monitoring and reports
│   └── shared/         # Shared feature components
├── hooks/              # Custom React hooks
├── services/           # API and external services
├── store/              # Zustand global state
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── constants/          # App constants and design tokens
```

## 🎨 Design System

The app uses a comprehensive design system with:
- **Color Palette**: Primary, secondary, semantic, and neutral colors
- **Typography**: iOS-native font stack with consistent sizing
- **Spacing**: 8pt grid system for consistent layouts
- **Components**: Reusable UI components with design tokens
- **Accessibility**: WCAG compliant with screen reader support

## 🧪 Testing

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Testing Strategy
- **Unit Tests**: Utility functions, hooks, business logic
- **Component Tests**: UI components and user interactions
- **Integration Tests**: Feature workflows and API integrations
- **E2E Tests**: Complete user journeys (planned)

### Coverage Requirements
- Minimum 80% code coverage
- All new features must include tests
- Critical paths require comprehensive testing

## 🔧 Development

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lint:fix      # Fix ESLint issues
npm run type-check    # Run TypeScript compiler
```

### Development Guidelines
- Follow the established patterns in the codebase
- Use design tokens from `src/constants/tokens.ts`
- Write comprehensive tests for all new features
- Follow TypeScript strict mode requirements
- Use Conventional Commits format

### AI-Assisted Development
This project is optimized for AI-assisted development. See:
- `CLAUDE.md` - Development guide for AI assistants
- `docs/AI_RULES.md` - Strict development rules and constraints
- `docs/plan.md` - Comprehensive implementation plan

## 🔐 Security & Privacy

### Security Measures
- End-to-end encryption for sensitive data
- Secure Firebase authentication
- Input validation and sanitization
- Regular security audits
- COPPA compliance for child data

### Privacy Features
- Minimal data collection
- Transparent privacy policy
- User data control
- Secure data transmission
- Local data encryption

## 🚀 Deployment

### Development Build
```bash
expo build:ios --type simulator    # iOS Simulator
expo build:android --type apk      # Android APK
```

### Production Build
```bash
expo build:ios --type archive      # iOS App Store
expo build:android --type app-bundle # Google Play Store
```

### Environment Configuration
- Development: Firebase emulators
- Staging: Firebase staging project
- Production: Firebase production project

## 📚 Documentation

- **[Development Rules](docs/AI_RULES.md)** - Strict development guidelines
- **[Implementation Plan](docs/plan.md)** - Comprehensive project roadmap
- **[AI Development Guide](CLAUDE.md)** - Guide for AI-assisted development
- **[Design Tokens](src/constants/tokens.ts)** - Design system tokens
- **[Type Definitions](src/types/index.ts)** - TypeScript interfaces

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Follow the established patterns and guidelines
3. Write tests for all new functionality
4. Ensure all tests pass and coverage requirements are met
5. Submit pull request with detailed description

### Code Review Checklist
- [ ] TypeScript compilation passes
- [ ] All tests pass with >80% coverage
- [ ] Design tokens used consistently
- [ ] Accessibility standards met
- [ ] Security best practices followed
- [ ] Documentation updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For development questions or issues:
1. Check the documentation in the `docs/` directory
2. Review the AI development guide in `CLAUDE.md`
3. Check existing issues and discussions
4. Create a new issue with detailed information

## 🗺️ Roadmap

### Phase 1: Foundation (Weeks 1-2) ✅
- Project setup and configuration
- Basic navigation structure
- Authentication system
- Firebase integration

### Phase 2: Onboarding (Weeks 3-4)
- User registration and login
- Family setup workflow
- Device pairing system
- Permission handling

### Phase 3: Rules Engine (Weeks 5-7)
- Rule creation interface
- Time-based scheduling
- App restriction system
- Rule enforcement

### Phase 4: Requests & Approvals (Weeks 8-9)
- Request creation system
- Notification system
- Parent approval interface
- Request history

### Phase 5: Monitoring & Reports (Weeks 10-11)
- Usage monitoring
- Report generation
- Data visualization
- Alert system

### Phase 6: Polish & Testing (Weeks 12-13)
- Bug fixes and optimizations
- Comprehensive testing
- Performance improvements
- App store preparation

---

**NestPause** - Empowering families with intelligent screen-time management.
