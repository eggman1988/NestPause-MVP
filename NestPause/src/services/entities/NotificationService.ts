import { BaseService, EntityWithTimestamps } from '../base/BaseService';
import { Notification, NotificationType, ApiResponse } from '@/types';

export class NotificationService extends BaseService<EntityWithTimestamps<Notification>> {
  constructor() {
    super('notifications');
  }

  /**
   * Create a new notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<ApiResponse<Notification>> {
    const notificationData = {
      userId,
      type,
      title,
      message,
      data,
      isRead: false,
    };

    return this.create(notificationData);
  }

  /**
   * Get notifications by user ID
   */
  async getNotificationsByUser(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.query({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get unread notifications by user ID
   */
  async getUnreadNotifications(userId: string): Promise<ApiResponse<Notification[]>> {
    return this.query({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get notifications by type
   */
  async getNotificationsByType(type: NotificationType, userId?: string): Promise<ApiResponse<Notification[]>> {
    const whereConditions = [{ field: 'type', operator: '==', value: type }];
    
    if (userId) {
      whereConditions.push({ field: 'userId', operator: '==', value: userId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.update(notificationId, { isRead: true });
  }

  /**
   * Mark notification as unread
   */
  async markAsUnread(notificationId: string): Promise<ApiResponse<Notification>> {
    return this.update(notificationId, { isRead: false });
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<ApiResponse<Notification[]>> {
    const notifications = await this.getUnreadNotifications(userId);
    
    if (!notifications.success || !notifications.data) {
      return notifications;
    }

    const updatePromises = notifications.data.map(notification =>
      this.markAsRead(notification.id)
    );

    const results = await Promise.all(updatePromises);
    const successful = results.filter(result => result.success);

    if (successful.length === results.length) {
      return {
        success: true,
        data: successful.map(result => result.data!),
      };
    } else {
      return {
        success: false,
        error: `${successful.length} out of ${results.length} notifications marked as read`,
      };
    }
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return this.delete(notificationId);
  }

  /**
   * Clear all notifications for a user
   */
  async clearUserNotifications(userId: string): Promise<ApiResponse<number>> {
    const notifications = await this.getNotificationsByUser(userId);
    
    if (!notifications.success || !notifications.data) {
      return {
        success: false,
        error: 'Failed to fetch notifications',
      };
    }

    const deletePromises = notifications.data.map(notification =>
      this.delete(notification.id)
    );

    const results = await Promise.all(deletePromises);
    const successful = results.filter(result => result.success);

    return {
      success: true,
      data: successful.length,
      message: `Deleted ${successful.length} notifications`,
    };
  }

  /**
   * Get notification count for user
   */
  async getNotificationCount(userId: string, unreadOnly = false): Promise<number> {
    const options = unreadOnly 
      ? { where: [
          { field: 'userId', operator: '==', value: userId },
          { field: 'isRead', operator: '==', value: false },
        ]}
      : { where: [{ field: 'userId', operator: '==', value: userId }]};

    return this.count(options);
  }

  /**
   * Create request-related notifications
   */
  async createRequestNotification(
    userId: string,
    requestId: string,
    type: 'request_received' | 'request_approved' | 'request_denied',
    title: string,
    message: string
  ): Promise<ApiResponse<Notification>> {
    return this.createNotification(
      userId,
      type,
      title,
      message,
      { requestId }
    );
  }

  /**
   * Create time-related notifications
   */
  async createTimeNotification(
    userId: string,
    type: 'time_warning' | 'time_expired',
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<ApiResponse<Notification>> {
    return this.createNotification(
      userId,
      type,
      title,
      message,
      data
    );
  }

  /**
   * Create rule violation notification
   */
  async createRuleViolationNotification(
    userId: string,
    ruleId: string,
    violationDetails: Record<string, any>
  ): Promise<ApiResponse<Notification>> {
    return this.createNotification(
      userId,
      'rule_violation',
      'Rule Violation Detected',
      'A rule violation has been detected on your device.',
      { ruleId, ...violationDetails }
    );
  }

  /**
   * Create device-related notification
   */
  async createDeviceNotification(
    userId: string,
    type: 'device_paired' | 'system_update',
    title: string,
    message: string,
    deviceId: string
  ): Promise<ApiResponse<Notification>> {
    return this.createNotification(
      userId,
      type,
      title,
      message,
      { deviceId }
    );
  }

  /**
   * Get recent notifications (last 30 days)
   */
  async getRecentNotifications(userId: string, days = 30): Promise<ApiResponse<Notification[]>> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return this.query({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'createdAt', operator: '>=', value: cutoffDate },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Subscribe to user notifications
   */
  subscribeToUserNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Subscribe to unread notifications
   */
  subscribeToUnreadNotifications(userId: string, callback: (notifications: Notification[]) => void) {
    return this.subscribeToCollection({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'isRead', operator: '==', value: false },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Get notification statistics for a user
   */
  async getUserNotificationStats(userId: string): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
  }> {
    const notifications = await this.getNotificationsByUser(userId);
    
    if (!notifications.success || !notifications.data) {
      return {
        total: 0,
        unread: 0,
        byType: {} as Record<NotificationType, number>,
      };
    }

    const notificationList = notifications.data;
    const unread = notificationList.filter(n => !n.isRead).length;
    
    const byType = notificationList.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {} as Record<NotificationType, number>);

    return {
      total: notificationList.length,
      unread,
      byType,
    };
  }

  /**
   * Clean up old notifications (older than specified days)
   */
  async cleanupOldNotifications(daysOld = 90): Promise<ApiResponse<number>> {
    const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    
    const oldNotifications = await this.query({
      where: [{ field: 'createdAt', operator: '<', value: cutoffDate }],
    });

    if (!oldNotifications.success || !oldNotifications.data) {
      return {
        success: false,
        error: 'Failed to fetch old notifications',
      };
    }

    const deletePromises = oldNotifications.data.map(notification =>
      this.delete(notification.id)
    );

    const results = await Promise.all(deletePromises);
    const successful = results.filter(result => result.success);

    return {
      success: true,
      data: successful.length,
      message: `Cleaned up ${successful.length} old notifications`,
    };
  }
}

export const notificationService = new NotificationService();
export default notificationService;
