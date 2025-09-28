import { useState, useCallback } from 'react';
import { notificationService } from '@/services';
import { useAppStore } from '@/store';
import { Notification, NotificationType } from '@/types';

export const useNotifications = () => {
  const { 
    notifications, 
    addNotification, 
    markNotificationRead, 
    clearNotifications,
    setLoading, 
    setError, 
    clearError 
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const markAsRead = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.markAsRead(notificationId);
      
      if (result.success && result.data) {
        markNotificationRead(notificationId);
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'MARK_READ_ERROR',
          message: result.error || 'Failed to mark notification as read',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as read';
      setError({
        code: 'MARK_READ_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [markNotificationRead, setError, clearError]);

  const markAsUnread = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.markAsUnread(notificationId);
      
      if (result.success && result.data) {
        // Update the notification in the store
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'MARK_UNREAD_ERROR',
          message: result.error || 'Failed to mark notification as unread',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark notification as unread';
      setError({
        code: 'MARK_UNREAD_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  const markAllAsRead = useCallback(async (userId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.markAllAsRead(userId);
      
      if (result.success && result.data) {
        // Update all notifications in the store
        result.data.forEach(notification => {
          markNotificationRead(notification.id);
        });
        return { success: true, notifications: result.data };
      } else {
        setError({
          code: 'MARK_ALL_READ_ERROR',
          message: result.error || 'Failed to mark all notifications as read',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to mark all notifications as read';
      setError({
        code: 'MARK_ALL_READ_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [markNotificationRead, setError, clearError]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.deleteNotification(notificationId);
      
      if (result.success) {
        // Remove from store (this would need to be implemented in the store)
        return { success: true };
      } else {
        setError({
          code: 'DELETE_NOTIFICATION_ERROR',
          message: result.error || 'Failed to delete notification',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete notification';
      setError({
        code: 'DELETE_NOTIFICATION_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  const clearUserNotifications = useCallback(async (userId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.clearUserNotifications(userId);
      
      if (result.success) {
        clearNotifications();
        return { success: true, count: result.data };
      } else {
        setError({
          code: 'CLEAR_NOTIFICATIONS_ERROR',
          message: result.error || 'Failed to clear notifications',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to clear notifications';
      setError({
        code: 'CLEAR_NOTIFICATIONS_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [clearNotifications, setError, clearError]);

  const createRequestNotification = useCallback(async (
    userId: string,
    requestId: string,
    type: 'request_received' | 'request_approved' | 'request_denied',
    title: string,
    message: string
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.createRequestNotification(
        userId,
        requestId,
        type,
        title,
        message
      );
      
      if (result.success && result.data) {
        addNotification(result.data);
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'CREATE_REQUEST_NOTIFICATION_ERROR',
          message: result.error || 'Failed to create request notification',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create request notification';
      setError({
        code: 'CREATE_REQUEST_NOTIFICATION_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, setError, clearError]);

  const createTimeNotification = useCallback(async (
    userId: string,
    type: 'time_warning' | 'time_expired',
    title: string,
    message: string,
    data?: Record<string, any>
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.createTimeNotification(
        userId,
        type,
        title,
        message,
        data
      );
      
      if (result.success && result.data) {
        addNotification(result.data);
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'CREATE_TIME_NOTIFICATION_ERROR',
          message: result.error || 'Failed to create time notification',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create time notification';
      setError({
        code: 'CREATE_TIME_NOTIFICATION_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, setError, clearError]);

  const createRuleViolationNotification = useCallback(async (
    userId: string,
    ruleId: string,
    violationDetails: Record<string, any>
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.createRuleViolationNotification(
        userId,
        ruleId,
        violationDetails
      );
      
      if (result.success && result.data) {
        addNotification(result.data);
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'CREATE_VIOLATION_NOTIFICATION_ERROR',
          message: result.error || 'Failed to create rule violation notification',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create rule violation notification';
      setError({
        code: 'CREATE_VIOLATION_NOTIFICATION_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, setError, clearError]);

  const createDeviceNotification = useCallback(async (
    userId: string,
    type: 'device_paired' | 'system_update',
    title: string,
    message: string,
    deviceId: string
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.createDeviceNotification(
        userId,
        type,
        title,
        message,
        deviceId
      );
      
      if (result.success && result.data) {
        addNotification(result.data);
        return { success: true, notification: result.data };
      } else {
        setError({
          code: 'CREATE_DEVICE_NOTIFICATION_ERROR',
          message: result.error || 'Failed to create device notification',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create device notification';
      setError({
        code: 'CREATE_DEVICE_NOTIFICATION_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addNotification, setError, clearError]);

  const getNotificationCount = useCallback(async (userId: string, unreadOnly = false) => {
    setIsLoading(true);
    clearError();

    try {
      const count = await notificationService.getNotificationCount(userId, unreadOnly);
      return { success: true, count };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get notification count';
      setError({
        code: 'GET_NOTIFICATION_COUNT_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  const cleanupOldNotifications = useCallback(async (daysOld = 90) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await notificationService.cleanupOldNotifications(daysOld);
      
      if (result.success) {
        return { success: true, count: result.data };
      } else {
        setError({
          code: 'CLEANUP_NOTIFICATIONS_ERROR',
          message: result.error || 'Failed to cleanup old notifications',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup old notifications';
      setError({
        code: 'CLEANUP_NOTIFICATIONS_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  // Helper functions for derived data
  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  const unreadCount = unreadNotifications.length;

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getRecentNotifications = useCallback((days = 7) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return notifications.filter(notification => notification.createdAt >= cutoffDate);
  }, [notifications]);

  const hasUnreadNotifications = useCallback((type?: NotificationType) => {
    if (type) {
      return notifications.some(notification => 
        notification.type === type && !notification.isRead
      );
    }
    return unreadCount > 0;
  }, [notifications, unreadCount]);

  return {
    notifications,
    unreadNotifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
    deleteNotification,
    clearUserNotifications,
    createRequestNotification,
    createTimeNotification,
    createRuleViolationNotification,
    createDeviceNotification,
    getNotificationCount,
    cleanupOldNotifications,
    getNotificationsByType,
    getRecentNotifications,
    hasUnreadNotifications,
  };
};
