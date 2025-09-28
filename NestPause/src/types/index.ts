// Core User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  familyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'parent' | 'child';

// Family & Device Types
export interface Family {
  id: string;
  name: string;
  parentIds: string[];
  childIds: string[];
  devices: Device[];
  rules: Rule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  userId: string;
  familyId: string;
  isActive: boolean;
  lastSeen: Date;
  platform: DevicePlatform;
  version: string;
}

export type DeviceType = 'phone' | 'tablet' | 'computer' | 'tv';
export type DevicePlatform = 'ios' | 'android' | 'windows' | 'macos' | 'web';

// Rules & Time Management
export interface Rule {
  id: string;
  familyId: string;
  name: string;
  type: RuleType;
  targetUserIds: string[];
  schedule: Schedule;
  restrictions: Restriction[];
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type RuleType = 'time_limit' | 'bedtime' | 'focus_block' | 'app_restriction';

export interface Schedule {
  timezone: string;
  weekdays: WeekdaySchedule[];
  exceptions: ScheduleException[];
}

export interface WeekdaySchedule {
  day: Weekday;
  timeSlots: TimeSlot[];
  dailyLimit?: number; // minutes
}

export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  type: 'allowed' | 'blocked' | 'focus';
}

export interface ScheduleException {
  date: string; // YYYY-MM-DD format
  type: 'override' | 'suspend';
  timeSlots?: TimeSlot[];
  reason?: string;
}

export interface Restriction {
  type: RestrictionType;
  target: string; // app bundle ID, website domain, or category
  action: RestrictionAction;
}

export type RestrictionType = 'app' | 'website' | 'category';
export type RestrictionAction = 'block' | 'limit' | 'monitor';

// Requests & Approvals
export interface Request {
  id: string;
  familyId: string;
  requesterId: string;
  type: RequestType;
  target: string;
  duration?: number; // minutes
  reason?: string;
  status: RequestStatus;
  approvals: Approval[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RequestType = 'extra_time' | 'app_access' | 'bedtime_extension' | 'rule_suspension';
export type RequestStatus = 'pending' | 'approved' | 'denied' | 'expired';

export interface Approval {
  parentId: string;
  decision: 'approve' | 'deny';
  reason?: string;
  timestamp: Date;
}

// Activity & Reports
export interface ActivitySession {
  id: string;
  userId: string;
  deviceId: string;
  appId?: string;
  category: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  isActive: boolean;
}

export interface DailyReport {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  totalScreenTime: number; // minutes
  appUsage: AppUsage[];
  rulesViolated: string[];
  requestsMade: number;
  focusTime: number; // minutes
}

export interface AppUsage {
  appId: string;
  appName: string;
  category: string;
  duration: number; // minutes
  sessions: number;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'request_received'
  | 'request_approved'
  | 'request_denied'
  | 'time_warning'
  | 'time_expired'
  | 'rule_violation'
  | 'device_paired'
  | 'system_update';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface BaseComponentProps {
  testID?: string;
  style?: any;
}

// Navigation Types (will be extended with Expo Router types)
export interface NavigationProps {
  navigation: any;
  route: any;
}

// Form Types
export interface FormField<T = string> {
  value: T;
  error?: string;
  touched: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormField<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Store Types (for Zustand)
export interface AppState {
  user: User | null;
  family: Family | null;
  devices: Device[];
  rules: Rule[];
  requests: Request[];
  notifications: Notification[];
  isLoading: boolean;
  error: AppError | null;
}

export interface AppActions {
  // Auth actions
  setUser: (user: User | null) => void;
  signOut: () => void;
  
  // Family actions
  setFamily: (family: Family | null) => void;
  
  // Device actions
  addDevice: (device: Device) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  removeDevice: (deviceId: string) => void;
  
  // Rule actions
  addRule: (rule: Rule) => void;
  updateRule: (ruleId: string, updates: Partial<Rule>) => void;
  deleteRule: (ruleId: string) => void;
  
  // Request actions
  addRequest: (request: Request) => void;
  updateRequest: (requestId: string, updates: Partial<Request>) => void;
  
  // Notification actions
  addNotification: (notification: Notification) => void;
  markNotificationRead: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: AppError | null) => void;
  clearError: () => void;
}
