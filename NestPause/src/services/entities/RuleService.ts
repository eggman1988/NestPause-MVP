import { BaseService } from '../base/BaseService';
import { Rule, RuleType, RequestStatus, ApiResponse } from '@/types';

export class RuleService extends BaseService<Rule> {
  constructor() {
    super('rules');
  }

  /**
   * Create a new rule
   */
  async createRule(
    familyId: string,
    name: string,
    type: RuleType,
    targetUserIds: string[],
    schedule: any,
    restrictions: any[],
    createdBy: string
  ): Promise<ApiResponse<Rule>> {
    const ruleData = {
      familyId,
      name,
      type,
      targetUserIds,
      schedule,
      restrictions,
      isActive: true,
      createdBy,
    };

    return this.create(ruleData);
  }

  /**
   * Get rules by family ID
   */
  async getRulesByFamily(familyId: string): Promise<ApiResponse<Rule[]>> {
    return this.query({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get active rules by family ID
   */
  async getActiveRulesByFamily(familyId: string): Promise<ApiResponse<Rule[]>> {
    return this.query({
      where: [
        { field: 'familyId', operator: '==', value: familyId },
        { field: 'isActive', operator: '==', value: true },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get rules by type
   */
  async getRulesByType(type: RuleType, familyId?: string): Promise<ApiResponse<Rule[]>> {
    const whereConditions = [{ field: 'type', operator: '==', value: type }];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get rules affecting a specific user
   */
  async getRulesForUser(userId: string, familyId?: string): Promise<ApiResponse<Rule[]>> {
    const whereConditions = [
      { field: 'targetUserIds', operator: 'array-contains', value: userId },
      { field: 'isActive', operator: '==', value: true },
    ];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Activate/deactivate a rule
   */
  async setActive(ruleId: string, isActive: boolean): Promise<ApiResponse<Rule>> {
    return this.update(ruleId, { isActive });
  }

  /**
   * Update rule schedule
   */
  async updateSchedule(ruleId: string, schedule: any): Promise<ApiResponse<Rule>> {
    return this.update(ruleId, { schedule });
  }

  /**
   * Update rule restrictions
   */
  async updateRestrictions(ruleId: string, restrictions: any[]): Promise<ApiResponse<Rule>> {
    return this.update(ruleId, { restrictions });
  }

  /**
   * Add target user to rule
   */
  async addTargetUser(ruleId: string, userId: string): Promise<ApiResponse<Rule>> {
    const rule = await this.getById(ruleId);
    if (!rule.success || !rule.data) {
      return rule;
    }

    const updatedTargetUserIds = [...rule.data.targetUserIds, userId];
    return this.update(ruleId, { targetUserIds: updatedTargetUserIds });
  }

  /**
   * Remove target user from rule
   */
  async removeTargetUser(ruleId: string, userId: string): Promise<ApiResponse<Rule>> {
    const rule = await this.getById(ruleId);
    if (!rule.success || !rule.data) {
      return rule;
    }

    const updatedTargetUserIds = rule.data.targetUserIds.filter(id => id !== userId);
    
    // If no target users left, deactivate the rule
    if (updatedTargetUserIds.length === 0) {
      return this.setActive(ruleId, false);
    }

    return this.update(ruleId, { targetUserIds: updatedTargetUserIds });
  }

  /**
   * Duplicate a rule
   */
  async duplicateRule(ruleId: string, newName: string): Promise<ApiResponse<Rule>> {
    const originalRule = await this.getById(ruleId);
    if (!originalRule.success || !originalRule.data) {
      return originalRule;
    }

    const { id, createdAt, updatedAt, ...ruleData } = originalRule.data;
    
    const duplicatedRuleData = {
      ...ruleData,
      name: newName,
      isActive: false, // Start as inactive for review
    };

    return this.create(duplicatedRuleData);
  }

  /**
   * Get rules by creator
   */
  async getRulesByCreator(createdBy: string): Promise<ApiResponse<Rule[]>> {
    return this.query({
      where: [{ field: 'createdBy', operator: '==', value: createdBy }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Bulk update rules for a family
   */
  async bulkUpdateFamilyRules(familyId: string, updates: Partial<Rule>): Promise<ApiResponse<Rule[]>> {
    const rules = await this.getRulesByFamily(familyId);
    if (!rules.success || !rules.data) {
      return rules;
    }

    const updatePromises = rules.data.map(rule => 
      this.update(rule.id, updates)
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
        error: `${successful.length} out of ${results.length} rules updated successfully`,
      };
    }
  }

  /**
   * Check if rule name exists in family
   */
  async ruleNameExists(familyId: string, name: string, excludeRuleId?: string): Promise<boolean> {
    const whereConditions = [
      { field: 'familyId', operator: '==', value: familyId },
      { field: 'name', operator: '==', value: name },
    ];

    const result = await this.query({
      where: whereConditions,
      limit: 1,
    });

    if (!result.success || !result.data) {
      return false;
    }

    // If excluding a specific rule, check if the found rule is different
    if (excludeRuleId) {
      return result.data.some(rule => rule.id !== excludeRuleId);
    }

    return result.data.length > 0;
  }

  /**
   * Subscribe to family rules
   */
  subscribeToFamilyRules(familyId: string, callback: (rules: Rule[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Subscribe to user rules
   */
  subscribeToUserRules(userId: string, callback: (rules: Rule[]) => void) {
    return this.subscribeToCollection({
      where: [
        { field: 'targetUserIds', operator: 'array-contains', value: userId },
        { field: 'isActive', operator: '==', value: true },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Get rule statistics for a family
   */
  async getFamilyRuleStats(familyId: string): Promise<{
    total: number;
    active: number;
    byType: Record<RuleType, number>;
  }> {
    const rules = await this.getRulesByFamily(familyId);
    
    if (!rules.success || !rules.data) {
      return {
        total: 0,
        active: 0,
        byType: {} as Record<RuleType, number>,
      };
    }

    const ruleList = rules.data;
    const active = ruleList.filter(r => r.isActive).length;
    
    const byType = ruleList.reduce((acc, rule) => {
      acc[rule.type] = (acc[rule.type] || 0) + 1;
      return acc;
    }, {} as Record<RuleType, number>);

    return {
      total: ruleList.length,
      active,
      byType,
    };
  }
}

export const ruleService = new RuleService();
export default ruleService;
