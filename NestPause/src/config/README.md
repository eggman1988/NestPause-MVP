# Configuration Guide

This guide explains how to configure the NestPause application for different environments.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Firebase Configuration
# Get these values from your Firebase project settings
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Development Settings
EXPO_PUBLIC_USE_FIREBASE_EMULATORS=false

# Feature Flags
EXPO_PUBLIC_ENABLE_OFFLINE_MODE=true
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true

# Debug Settings
EXPO_PUBLIC_DEBUG_MODE=false
EXPO_PUBLIC_LOG_LEVEL=info
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication, Firestore, Functions, and Storage
4. Configure your project settings

### 2. Authentication Setup

1. Go to Authentication > Sign-in method
2. Enable Email/Password authentication
3. Enable Google authentication (optional)
4. Configure OAuth consent screen

### 3. Firestore Setup

1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules (see Security Rules section)
4. Configure indexes for your queries

### 4. Security Rules

Set up Firestore security rules:

```javascript
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
    
    // Devices belong to users
    match /devices/{deviceId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Rules belong to families
    match /rules/{ruleId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/families/$(resource.data.familyId)).data.parentIds;
    }
    
    // Requests belong to families
    match /requests/{requestId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.requesterId ||
         request.auth.uid in get(/databases/$(database)/documents/families/$(resource.data.familyId)).data.parentIds);
    }
    
    // Notifications belong to users
    match /notifications/{notificationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### 5. Storage Setup

1. Go to Storage
2. Set up Cloud Storage
3. Configure security rules for file uploads

## Development Environment

### Firebase Emulators

For local development, you can use Firebase emulators:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

3. Start emulators:
   ```bash
   firebase emulators:start
   ```

4. Set environment variable:
   ```bash
   EXPO_PUBLIC_USE_FIREBASE_EMULATORS=true
   ```

### Testing Configuration

For testing, create a separate Firebase project:

1. Create a test project in Firebase Console
2. Use test-specific environment variables
3. Set up test data and users
4. Configure separate security rules for testing

## Production Environment

### Firebase Production Setup

1. Create production Firebase project
2. Configure production security rules
3. Set up monitoring and alerting
4. Configure backup and disaster recovery

### Environment Variables

Use secure environment variable management:

1. Use Expo's environment variable system
2. Never commit sensitive keys to version control
3. Use different projects for different environments
4. Rotate keys regularly

### Monitoring

Set up monitoring for production:

1. Firebase Performance Monitoring
2. Firebase Crashlytics
3. Custom error tracking
4. Analytics and user behavior tracking

## Security Considerations

### API Keys

- Never expose Firebase API keys in client-side code
- Use Firebase App Check for additional security
- Rotate keys regularly
- Monitor for unauthorized usage

### Data Protection

- Implement proper data validation
- Use Firebase Security Rules
- Encrypt sensitive data
- Follow privacy regulations (GDPR, COPPA)

### Authentication

- Use strong authentication methods
- Implement proper session management
- Monitor for suspicious activity
- Use Firebase App Check

## Troubleshooting

### Common Configuration Issues

1. **API Key Issues**: Verify API keys are correct and enabled
2. **Permission Errors**: Check Firebase Security Rules
3. **Network Issues**: Verify Firebase project configuration
4. **Authentication Issues**: Check OAuth configuration

### Debug Mode

Enable debug mode for troubleshooting:

```bash
EXPO_PUBLIC_DEBUG_MODE=true
EXPO_PUBLIC_LOG_LEVEL=debug
```

### Firebase Emulator Issues

1. Ensure emulators are running on correct ports
2. Check firewall settings
3. Verify emulator configuration
4. Check network connectivity

## Best Practices

### Environment Management

- Use separate Firebase projects for different environments
- Keep production and development configurations separate
- Use environment-specific security rules
- Regular security audits

### Configuration Management

- Use environment variables for all configuration
- Never hardcode sensitive information
- Use configuration validation
- Document all configuration options

### Security

- Follow Firebase security best practices
- Implement proper data validation
- Use Firebase App Check
- Regular security updates

### Monitoring

- Set up comprehensive monitoring
- Use Firebase Performance Monitoring
- Implement error tracking
- Monitor for security issues
