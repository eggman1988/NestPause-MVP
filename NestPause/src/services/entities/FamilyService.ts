import { BaseService } from '../base/BaseService';
import { Family, Device, Rule, ApiResponse } from '@/types';

export class FamilyService extends BaseService<Family> {
  constructor() {
    super('families');
  }

  /**
   * Create a new family
   */
  async createFamily(
    name: string, 
    parentId: string,
    initialDevices: Device[] = [],
    initialRules: Rule[] = []
  ): Promise<ApiResponse<Family>> {
    const familyData = {
      name,
      parentIds: [parentId],
      childIds: [],
      devices: initialDevices,
      rules: initialRules,
    };

    return this.create(familyData);
  }

  /**
   * Get family by ID with related data
   */
  async getFamilyWithDetails(familyId: string): Promise<ApiResponse<Family>> {
    return this.getById(familyId);
  }

  /**
   * Add a parent to the family
   */
  async addParent(familyId: string, parentId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedParentIds = [...family.data.parentIds, parentId];
    return this.update(familyId, { parentIds: updatedParentIds });
  }

  /**
   * Add a child to the family
   */
  async addChild(familyId: string, childId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedChildIds = [...family.data.childIds, childId];
    return this.update(familyId, { childIds: updatedChildIds });
  }

  /**
   * Remove a parent from the family
   */
  async removeParent(familyId: string, parentId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedParentIds = family.data.parentIds.filter(id => id !== parentId);
    
    // If no parents left, delete the family
    if (updatedParentIds.length === 0) {
      const deleteResult = await this.delete(familyId);
      if (deleteResult.success) {
        return {
          success: true,
          data: family.data,
          message: 'Family deleted as no parents remain',
        } as ApiResponse<Family>;
      }
      return deleteResult;
    }

    return this.update(familyId, { parentIds: updatedParentIds });
  }

  /**
   * Remove a child from the family
   */
  async removeChild(familyId: string, childId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedChildIds = family.data.childIds.filter(id => id !== childId);
    return this.update(familyId, { childIds: updatedChildIds });
  }

  /**
   * Add a device to the family
   */
  async addDevice(familyId: string, device: Device): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedDevices = [...family.data.devices, device];
    return this.update(familyId, { devices: updatedDevices });
  }

  /**
   * Update a device in the family
   */
  async updateDevice(familyId: string, deviceId: string, deviceUpdates: Partial<Device>): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedDevices = family.data.devices.map(device =>
      device.id === deviceId ? { ...device, ...deviceUpdates } : device
    );

    return this.update(familyId, { devices: updatedDevices });
  }

  /**
   * Remove a device from the family
   */
  async removeDevice(familyId: string, deviceId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedDevices = family.data.devices.filter(device => device.id !== deviceId);
    return this.update(familyId, { devices: updatedDevices });
  }

  /**
   * Add a rule to the family
   */
  async addRule(familyId: string, rule: Rule): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedRules = [...family.data.rules, rule];
    return this.update(familyId, { rules: updatedRules });
  }

  /**
   * Update a rule in the family
   */
  async updateRule(familyId: string, ruleId: string, ruleUpdates: Partial<Rule>): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedRules = family.data.rules.map(rule =>
      rule.id === ruleId ? { ...rule, ...ruleUpdates } : rule
    );

    return this.update(familyId, { rules: updatedRules });
  }

  /**
   * Remove a rule from the family
   */
  async removeRule(familyId: string, ruleId: string): Promise<ApiResponse<Family>> {
    const family = await this.getById(familyId);
    if (!family.success || !family.data) {
      return family;
    }

    const updatedRules = family.data.rules.filter(rule => rule.id !== ruleId);
    return this.update(familyId, { rules: updatedRules });
  }

  /**
   * Get families by parent ID
   */
  async getFamiliesByParent(parentId: string): Promise<ApiResponse<Family[]>> {
    return this.query({
      where: [{ field: 'parentIds', operator: 'array-contains', value: parentId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get families by child ID
   */
  async getFamiliesByChild(childId: string): Promise<ApiResponse<Family[]>> {
    return this.query({
      where: [{ field: 'childIds', operator: 'array-contains', value: childId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Subscribe to family updates
   */
  subscribeToFamily(familyId: string, callback: (family: Family | null) => void) {
    return this.subscribeToDocument(familyId, callback);
  }

  /**
   * Subscribe to families for a user
   */
  subscribeToUserFamilies(userId: string, callback: (families: Family[]) => void) {
    return this.subscribeToCollection({
      where: [
        { field: 'parentIds', operator: 'array-contains', value: userId },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }
}

export const familyService = new FamilyService();
export default familyService;
