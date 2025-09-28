# NestPause Data Layer

This document provides a comprehensive overview of the NestPause data layer implementation, including Firebase configuration, service abstractions, state management, and offline support.

## Architecture Overview

The data layer is built with the following principles:

- **Type Safety**: Full TypeScript support throughout the entire stack
- **Real-time Updates**: Firebase Firestore real-time listeners for live data
- **Offline-First**: Robust offline support with operation queuing
- **Error Handling**: Comprehensive error handling and recovery
- **Security**: Firebase Security Rules compliance
- **Performance**: Optimized queries and efficient state management

## Components

### 1. Firebase Configuration (`src/config/firebase.ts`)

Centralized Firebase configuration with:
- Environment-based configuration
- Development emulator support
- Offline mode management
- Service initialization

```typescript
import { app, auth, firestore, functions, storage } from '@/config/firebase';
```

### 2. Base Service (`src/services/base/BaseService.ts`)

Abstract base class providing common CRUD operations:
- Type-safe document conversion
- Query building with filters and pagination
- Real-time subscriptions
- Batch operations
- Error handling

```typescript
class MyService extends BaseService<MyEntity> {
  constructor() {
    super('my-collection');
  }
}
```

### 3. Entity Services

#### Auth Service (`src/services/auth/AuthService.ts`)
- User authentication (email/password, Google)
- Profile management
- Password reset
- Auth state management

#### Family Service (`src/services/entities/FamilyService.ts`)
- Family creation and management
- Member management (parents/children)
- Device and rule associations

#### Device Service (`src/services/entities/DeviceService.ts`)
- Device registration and management
- Device status tracking
- Platform-specific operations

#### Rule Service (`src/services/entities/RuleService.ts`)
- Rule creation and management
- Schedule and restriction management
- Rule targeting and activation

#### Request Service (`src/services/entities/RequestService.ts`)
- Request creation and management
- Approval workflow
- Expiry handling

#### Notification Service (`src/services/entities/NotificationService.ts`)
- Notification creation and management
- Read/unread tracking
- Type-specific notifications

### 4. State Management (`src/store/index.ts`)

Enhanced Zustand store with:
- Real-time data synchronization
- Subscription management
- Offline state tracking
- Persistent storage

### 5. React Hooks (`src/hooks/`)

Custom hooks for easy integration:
- `useAuth`: Authentication operations
- `useFamily`: Family management
- `useRequests`: Request handling
- `useNotifications`: Notification management

### 6. Utilities

#### Error Handler (`src/utils/errorHandler.ts`)
- Error categorization and handling
- User-friendly error messages
- Retry logic
- Error reporting

#### Offline Manager (`src/utils/offlineManager.ts`)
- Network state monitoring
- Operation queuing
- Automatic retry on reconnection
- Offline mode management

## Usage Examples

### Authentication

```typescript
import { useAuth } from '@/hooks';

function LoginScreen() {
  const { signIn, signUp, user, isAuthenticated } = useAuth();
  
  const handleSignIn = async () => {
    const result = await signIn('user@example.com', 'password');
    if (!result.success) {
      // Handle error
    }
  };
  
  return (
    <Button title="Sign In" onPress={handleSignIn} />
  );
}
```

### Family Management

```typescript
import { useFamily } from '@/hooks';

function FamilyScreen() {
  const { 
    family, 
    devices, 
    rules, 
    createFamily, 
    addDevice 
  } = useFamily();
  
  const handleCreateFamily = async () => {
    const result = await createFamily('Smith Family', userId);
    if (result.success) {
      // Family created successfully
    }
  };
  
  return (
    <View>
      <Text>Family: {family?.name}</Text>
      <Text>Devices: {devices.length}</Text>
      <Text>Rules: {rules.length}</Text>
    </View>
  );
}
```

### Real-time Data

The store automatically subscribes to real-time updates when a user signs in:

```typescript
import { useAppStore } from '@/store';

function MyComponent() {
  const { user, family, devices, rules } = useAppStore();
  
  // Data automatically updates when Firebase changes
  return (
    <View>
      {/* Your UI with live data */}
    </View>
  );
}
```

### Offline Support

Operations are automatically queued when offline:

```typescript
import { offlineManager } from '@/utils';

// This will work offline and sync when back online
const result = await createRequest(familyId, userId, 'extra_time', 'YouTube');
```

### Error Handling

```typescript
import { useAuth } from '@/hooks';
import { errorHandler } from '@/utils';

function MyComponent() {
  const { signIn } = useAuth();
  
  const handleSignIn = async () => {
    const result = await signIn('user@example.com', 'password');
    if (!result.success) {
      const friendlyMessage = errorHandler.getUserFriendlyMessage(result.error);
      Alert.alert('Error', friendlyMessage);
    }
  };
}
```

## Data Models

### Core Entities

- **User**: Authentication and profile information
- **Family**: Family group with members and settings
- **Device**: Registered devices with status tracking
- **Rule**: Time limits and restrictions
- **Request**: Permission requests from children
- **Notification**: System and user notifications

### Relationships

```
Family
├── Users (parents/children)
├── Devices
├── Rules
└── Requests

User
├── Family (belongs to)
├── Devices (owns)
├── Requests (creates/approves)
└── Notifications (receives)
```

## Security

### Firebase Security Rules

The data layer is designed to work with Firebase Security Rules:

```javascript
// Example security rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Family members can access family data
    match /families/{familyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.parentIds ||
        request.auth.uid in resource.data.childIds;
    }
  }
}
```

### Data Validation

All services include data validation:
- Type checking with TypeScript
- Required field validation
- Business logic validation
- Input sanitization

## Performance Considerations

### Query Optimization

- Indexed queries for common operations
- Pagination for large datasets
- Selective field queries
- Cached queries where appropriate

### Real-time Efficiency

- Selective subscriptions (only subscribe to needed data)
- Automatic cleanup of unused subscriptions
- Efficient listener management
- Minimal re-renders

### Offline Performance

- Local caching with Firestore offline persistence
- Efficient operation queuing
- Batch operations where possible
- Smart retry strategies

## Testing

### Unit Tests

Each service includes comprehensive unit tests:
- CRUD operation testing
- Error handling testing
- Mock Firebase responses
- Edge case coverage

### Integration Tests

- End-to-end data flow testing
- Real-time update testing
- Offline/online transition testing
- Error recovery testing

## Deployment

### Environment Configuration

Configure Firebase for different environments:

```typescript
// Development
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_DEV,
  projectId: 'nestpause-dev',
  // ...
};

// Production
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY_PROD,
  projectId: 'nestpause-prod',
  // ...
};
```

### Security Rules Deployment

Deploy security rules for each environment:

```bash
# Development
firebase deploy --only firestore:rules --project nestpause-dev

# Production
firebase deploy --only firestore:rules --project nestpause-prod
```

## Monitoring

### Error Tracking

- Comprehensive error logging
- User-friendly error messages
- Error categorization and reporting
- Performance monitoring

### Analytics

- User behavior tracking
- Feature usage analytics
- Performance metrics
- Error rates and patterns

## Best Practices

### Code Organization

- Services organized by domain
- Consistent error handling patterns
- Type-safe interfaces throughout
- Comprehensive documentation

### Performance

- Lazy loading of services
- Efficient subscription management
- Minimal re-renders
- Optimized queries

### Security

- Input validation at all levels
- Secure data handling
- Proper error message sanitization
- Regular security audits

### Maintenance

- Comprehensive logging
- Error monitoring and alerting
- Regular dependency updates
- Performance monitoring

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Firebase configuration and credentials
2. **Permission Denied**: Verify security rules and user permissions
3. **Network Issues**: Check offline manager and retry logic
4. **Real-time Updates**: Verify subscription management and cleanup

### Debug Tools

- Firebase Emulator Suite for local development
- Redux DevTools for state inspection
- Network monitoring tools
- Error logging and reporting

## Contributing

### Code Standards

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Comprehensive testing

### Pull Request Process

1. Write comprehensive tests
2. Update documentation
3. Follow code standards
4. Include error handling
5. Test offline scenarios

## Support

For questions or issues with the data layer:

1. Check this documentation
2. Review error logs
3. Test with Firebase Emulator
4. Create detailed issue reports
5. Include reproduction steps
