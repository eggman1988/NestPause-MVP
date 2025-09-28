import { BaseService, EntityWithTimestamps } from '../base/BaseService';
import { Device, DeviceType, DevicePlatform, ApiResponse } from '@/types';

export class DeviceService extends BaseService<EntityWithTimestamps<Device>> {
  constructor() {
    super('devices');
  }

  /**
   * Create a new device
   */
  async createDevice(
    name: string,
    type: DeviceType,
    userId: string,
    familyId: string,
    platform: DevicePlatform,
    version: string
  ): Promise<ApiResponse<Device>> {
    const deviceData = {
      name,
      type,
      userId,
      familyId,
      isActive: true,
      lastSeen: new Date(),
      platform,
      version,
    };

    return this.create(deviceData);
  }

  /**
   * Update device last seen timestamp
   */
  async updateLastSeen(deviceId: string): Promise<ApiResponse<Device>> {
    return this.update(deviceId, { lastSeen: new Date() });
  }

  /**
   * Activate/deactivate a device
   */
  async setActive(deviceId: string, isActive: boolean): Promise<ApiResponse<Device>> {
    return this.update(deviceId, { isActive });
  }

  /**
   * Get devices by user ID
   */
  async getDevicesByUser(userId: string): Promise<ApiResponse<Device[]>> {
    return this.query({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Get devices by family ID
   */
  async getDevicesByFamily(familyId: string): Promise<ApiResponse<Device[]>> {
    return this.query({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Get active devices by family ID
   */
  async getActiveDevicesByFamily(familyId: string): Promise<ApiResponse<Device[]>> {
    return this.query({
      where: [
        { field: 'familyId', operator: '==', value: familyId },
        { field: 'isActive', operator: '==', value: true },
      ],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Get devices by type
   */
  async getDevicesByType(type: DeviceType, familyId?: string): Promise<ApiResponse<EntityWithTimestamps<Device>[]>> {
    const whereConditions = [{ field: 'type', operator: '==', value: type }];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Get devices by platform
   */
  async getDevicesByPlatform(platform: DevicePlatform, familyId?: string): Promise<ApiResponse<EntityWithTimestamps<Device>[]>> {
    const whereConditions = [{ field: 'platform', operator: '==', value: platform }];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Check if device exists for user
   */
  async deviceExistsForUser(userId: string, deviceName: string): Promise<boolean> {
    const result = await this.query({
      where: [
        { field: 'userId', operator: '==', value: userId },
        { field: 'name', operator: '==', value: deviceName },
      ],
      limit: 1,
    });

    return result.success && result.data!.length > 0;
  }

  /**
   * Update device version
   */
  async updateVersion(deviceId: string, version: string): Promise<ApiResponse<Device>> {
    return this.update(deviceId, { version });
  }

  /**
   * Get offline devices (not seen in the last X minutes)
   */
  async getOfflineDevices(minutesOffline = 30): Promise<ApiResponse<Device[]>> {
    const cutoffTime = new Date(Date.now() - minutesOffline * 60 * 1000);
    
    return this.query({
      where: [{ field: 'lastSeen', operator: '<', value: cutoffTime }],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    });
  }

  /**
   * Bulk update devices for a family
   */
  async updateFamilyDevices(familyId: string, updates: Partial<Device>): Promise<ApiResponse<Device[]>> {
    const devices = await this.getDevicesByFamily(familyId);
    if (!devices.success || !devices.data) {
      return devices;
    }

    const updatePromises = devices.data.map(device => 
      this.update(device.id, updates)
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
        error: `${successful.length} out of ${results.length} devices updated successfully`,
      };
    }
  }

  /**
   * Subscribe to user devices
   */
  subscribeToUserDevices(userId: string, callback: (devices: Device[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'userId', operator: '==', value: userId }],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    }, callback);
  }

  /**
   * Subscribe to family devices
   */
  subscribeToFamilyDevices(familyId: string, callback: (devices: Device[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'lastSeen', direction: 'desc' }],
    }, callback);
  }

  /**
   * Get device statistics for a family
   */
  async getFamilyDeviceStats(familyId: string): Promise<{
    total: number;
    active: number;
    byType: Record<DeviceType, number>;
    byPlatform: Record<DevicePlatform, number>;
  }> {
    const devices = await this.getDevicesByFamily(familyId);
    
    if (!devices.success || !devices.data) {
      return {
        total: 0,
        active: 0,
        byType: {} as Record<DeviceType, number>,
        byPlatform: {} as Record<DevicePlatform, number>,
      };
    }

    const deviceList = devices.data;
    const active = deviceList.filter(d => d.isActive).length;
    
    const byType = deviceList.reduce((acc, device) => {
      acc[device.type] = (acc[device.type] || 0) + 1;
      return acc;
    }, {} as Record<DeviceType, number>);

    const byPlatform = deviceList.reduce((acc, device) => {
      acc[device.platform] = (acc[device.platform] || 0) + 1;
      return acc;
    }, {} as Record<DevicePlatform, number>);

    return {
      total: deviceList.length,
      active,
      byType,
      byPlatform,
    };
  }
}

export const deviceService = new DeviceService();
export default deviceService;
