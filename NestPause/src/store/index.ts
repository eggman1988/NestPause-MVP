import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState, AppActions, User, Family, Device, Rule, Request, Notification } from '@/types';
import { authService } from '@/services';

interface Store extends AppState, AppActions {
  // Real-time subscriptions
  subscriptions: {
    family?: () => void;
    devices?: () => void;
    rules?: () => void;
    requests?: () => void;
    notifications?: () => void;
  };
  
  // Actions for managing subscriptions
  initializeSubscriptions: (userId: string, familyId?: string) => void;
  cleanupSubscriptions: () => void;
  
  // Enhanced actions
  refreshData: () => Promise<void>;
  setOfflineMode: (offline: boolean) => void;
  isOffline: boolean;
}

export const useAppStore = create<Store>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial State
        user: null,
        family: null,
        devices: [],
        rules: [],
        requests: [],
        notifications: [],
        isLoading: false,
        error: null,
        isOffline: false,
        subscriptions: {},

        // Auth Actions
        setUser: (user) => {
          set({ user }, false, 'setUser');
          if (user) {
            get().initializeSubscriptions(user.id, user.familyId);
          } else {
            get().cleanupSubscriptions();
          }
        },
        
        signOut: async () => {
          get().cleanupSubscriptions();
          await authService.signOut();
          set({ 
            user: null, 
            family: null, 
            devices: [], 
            rules: [], 
            requests: [], 
            notifications: [],
            subscriptions: {}
          }, false, 'signOut');
        },

        // Family Actions
        setFamily: (family) => set({ family }, false, 'setFamily'),

        // Device Actions
        addDevice: (device) => set(
          (state) => ({ devices: [...state.devices, device] }),
          false,
          'addDevice'
        ),
        updateDevice: (deviceId, updates) => set(
          (state) => ({
            devices: state.devices.map(device =>
              device.id === deviceId ? { ...device, ...updates } : device
            )
          }),
          false,
          'updateDevice'
        ),
        removeDevice: (deviceId) => set(
          (state) => ({
            devices: state.devices.filter(device => device.id !== deviceId)
          }),
          false,
          'removeDevice'
        ),

        // Rule Actions
        addRule: (rule) => set(
          (state) => ({ rules: [...state.rules, rule] }),
          false,
          'addRule'
        ),
        updateRule: (ruleId, updates) => set(
          (state) => ({
            rules: state.rules.map(rule =>
              rule.id === ruleId ? { ...rule, ...updates } : rule
            )
          }),
          false,
          'updateRule'
        ),
        deleteRule: (ruleId) => set(
          (state) => ({
            rules: state.rules.filter(rule => rule.id !== ruleId)
          }),
          false,
          'deleteRule'
        ),

        // Request Actions
        addRequest: (request) => set(
          (state) => ({ requests: [...state.requests, request] }),
          false,
          'addRequest'
        ),
        updateRequest: (requestId, updates) => set(
          (state) => ({
            requests: state.requests.map(request =>
              request.id === requestId ? { ...request, ...updates } : request
            )
          }),
          false,
          'updateRequest'
        ),

        // Notification Actions
        addNotification: (notification) => set(
          (state) => ({ notifications: [...state.notifications, notification] }),
          false,
          'addNotification'
        ),
        markNotificationRead: (notificationId) => set(
          (state) => ({
            notifications: state.notifications.map(notification =>
              notification.id === notificationId 
                ? { ...notification, isRead: true }
                : notification
            )
          }),
          false,
          'markNotificationRead'
        ),
        clearNotifications: () => set({ notifications: [] }, false, 'clearNotifications'),

        // UI Actions
        setLoading: (isLoading) => set({ isLoading }, false, 'setLoading'),
        setError: (error) => set({ error }, false, 'setError'),
        clearError: () => set({ error: null }, false, 'clearError'),
        setOfflineMode: (isOffline) => set({ isOffline }, false, 'setOfflineMode'),

        // Subscription Management
        initializeSubscriptions: (userId: string, familyId?: string) => {
          const { subscriptions } = get();
          
          // Clean up existing subscriptions
          get().cleanupSubscriptions();
          
          // Import services dynamically to avoid circular dependencies
          Promise.resolve().then(async () => {
            const services = await import('@/services');
            const { 
              familyService, 
              deviceService, 
              ruleService, 
              requestService, 
              notificationService 
            } = services;
            const newSubscriptions: typeof subscriptions = {};
            
            // Subscribe to family data if familyId exists
            if (familyId) {
              newSubscriptions.family = familyService.subscribeToFamily(
                familyId,
                (family) => {
                  if (family) {
                    set({ family }, false, 'familyUpdated');
                  }
                }
              );
              
              newSubscriptions.devices = deviceService.subscribeToFamilyDevices(
                familyId,
                (devices) => set({ devices }, false, 'devicesUpdated')
              );
              
              newSubscriptions.rules = ruleService.subscribeToFamilyRules(
                familyId,
                (rules) => set({ rules }, false, 'rulesUpdated')
              );
              
              newSubscriptions.requests = requestService.subscribeToFamilyRequests(
                familyId,
                (requests) => set({ requests }, false, 'requestsUpdated')
              );
            }
            
            // Always subscribe to user notifications
            newSubscriptions.notifications = notificationService.subscribeToUserNotifications(
              userId,
              (notifications) => set({ notifications }, false, 'notificationsUpdated')
            );
            
            set({ subscriptions: newSubscriptions }, false, 'subscriptionsInitialized');
          }).catch(error => {
            console.error('Error initializing subscriptions:', error);
            get().setError({
              code: 'SUBSCRIPTION_ERROR',
              message: 'Failed to initialize real-time data subscriptions',
              details: error,
              timestamp: new Date(),
            });
          });
        },
        
        cleanupSubscriptions: () => {
          const { subscriptions } = get();
          
          Object.values(subscriptions).forEach(unsubscribe => {
            if (unsubscribe) {
              unsubscribe();
            }
          });
          
          set({ subscriptions: {} }, false, 'subscriptionsCleanedUp');
        },
        
        // Data refresh
        refreshData: async () => {
          const { user, family } = get();
          if (!user) return;
          
          set({ isLoading: true }, false, 'refreshDataStart');
          
          try {
            // Import services dynamically
            const services = await import('@/services');
            const { 
              familyService, 
              deviceService, 
              ruleService, 
              requestService, 
              notificationService 
            } = services;
            
            const promises = [];
            
            // Refresh family data if available
            if (family) {
              promises.push(familyService.getFamilyWithDetails(family.id));
              promises.push(deviceService.getDevicesByFamily(family.id));
              promises.push(ruleService.getRulesByFamily(family.id));
              promises.push(requestService.getRequestsByFamily(family.id));
            }
            
            // Always refresh notifications
            promises.push(notificationService.getNotificationsByUser(user.id));
            
            const results = await Promise.allSettled(promises);
            
            // Update state with successful results
            results.forEach((result, index) => {
              if (result.status === 'fulfilled' && result.value.success) {
                const data = result.value.data;
                if (Array.isArray(data)) {
                  if (index === 1 && family) set({ devices: data as Device[] });
                  if (index === 2 && family) set({ rules: data as Rule[] });
                  if (index === 3 && family) set({ requests: data as Request[] });
                  if (index === (family ? 4 : 0)) set({ notifications: data as Notification[] });
                } else if (data && index === 0 && family) {
                  set({ family: data as Family });
                }
              }
            });
            
          } catch (error) {
            console.error('Error refreshing data:', error);
            get().setError({
              code: 'REFRESH_ERROR',
              message: 'Failed to refresh data',
              details: error,
              timestamp: new Date(),
            });
          } finally {
            set({ isLoading: false }, false, 'refreshDataEnd');
          }
        },
      }),
      {
        name: 'nestpause-store',
        partialize: (state) => ({
          user: state.user,
          family: state.family,
          isOffline: state.isOffline,
          // Don't persist loading states, errors, subscriptions, or real-time data
        }),
      }
    ),
    {
      name: 'NestPause Store',
    }
  )
);

// Selectors for commonly used derived state
export const useUser = () => useAppStore((state) => state.user);
export const useFamily = () => useAppStore((state) => state.family);
export const useDevices = () => useAppStore((state) => state.devices);
export const useRules = () => useAppStore((state) => state.rules);
export const useRequests = () => useAppStore((state) => state.requests);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadNotifications = () => useAppStore((state) => 
  state.notifications.filter(n => !n.isRead)
);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
