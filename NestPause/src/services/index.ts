// Export all services
export { default as authService } from './auth/AuthService';
export { default as familyService } from './entities/FamilyService';
export { default as deviceService } from './entities/DeviceService';
export { default as ruleService } from './entities/RuleService';
export { default as requestService } from './entities/RequestService';
export { default as notificationService } from './entities/NotificationService';

// Export base service for custom implementations
export { BaseService } from './base/BaseService';
export type { BaseEntity, QueryOptions, PaginationOptions } from './base/BaseService';

// Export auth types
export type { 
  AuthState, 
  SignUpData, 
  SignInData, 
  UserProfileUpdate 
} from './auth/AuthService';
