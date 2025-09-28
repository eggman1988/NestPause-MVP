import { BaseService } from '../base/BaseService';
import { Request, RequestType, RequestStatus, Approval, ApiResponse } from '@/types';

export class RequestService extends BaseService<Request> {
  constructor() {
    super('requests');
  }

  /**
   * Create a new request
   */
  async createRequest(
    familyId: string,
    requesterId: string,
    type: RequestType,
    target: string,
    duration?: number,
    reason?: string,
    expiresInHours = 24
  ): Promise<ApiResponse<Request>> {
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    
    const requestData = {
      familyId,
      requesterId,
      type,
      target,
      duration,
      reason,
      status: 'pending' as RequestStatus,
      approvals: [],
      expiresAt,
    };

    return this.create(requestData);
  }

  /**
   * Get requests by family ID
   */
  async getRequestsByFamily(familyId: string): Promise<ApiResponse<Request[]>> {
    return this.query({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get requests by requester ID
   */
  async getRequestsByRequester(requesterId: string): Promise<ApiResponse<Request[]>> {
    return this.query({
      where: [{ field: 'requesterId', operator: '==', value: requesterId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get pending requests for family
   */
  async getPendingRequests(familyId: string): Promise<ApiResponse<Request[]>> {
    return this.query({
      where: [
        { field: 'familyId', operator: '==', value: familyId },
        { field: 'status', operator: '==', value: 'pending' },
      ],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });
  }

  /**
   * Get requests by type
   */
  async getRequestsByType(type: RequestType, familyId?: string): Promise<ApiResponse<Request[]>> {
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
   * Get expired requests
   */
  async getExpiredRequests(familyId?: string): Promise<ApiResponse<Request[]>> {
    const now = new Date();
    const whereConditions = [{ field: 'expiresAt', operator: '<', value: now }];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    return this.query({
      where: whereConditions,
      orderBy: [{ field: 'expiresAt', direction: 'desc' }],
    });
  }

  /**
   * Approve a request
   */
  async approveRequest(
    requestId: string, 
    parentId: string, 
    reason?: string
  ): Promise<ApiResponse<Request>> {
    const request = await this.getById(requestId);
    if (!request.success || !request.data) {
      return request;
    }

    const approval: Approval = {
      parentId,
      decision: 'approve',
      reason,
      timestamp: new Date(),
    };

    const updatedApprovals = [...request.data.approvals, approval];
    const status = this.calculateRequestStatus(updatedApprovals);

    return this.update(requestId, {
      approvals: updatedApprovals,
      status,
    });
  }

  /**
   * Deny a request
   */
  async denyRequest(
    requestId: string, 
    parentId: string, 
    reason?: string
  ): Promise<ApiResponse<Request>> {
    const request = await this.getById(requestId);
    if (!request.success || !request.data) {
      return request;
    }

    const approval: Approval = {
      parentId,
      decision: 'deny',
      reason,
      timestamp: new Date(),
    };

    const updatedApprovals = [...request.data.approvals, approval];
    const status = this.calculateRequestStatus(updatedApprovals);

    return this.update(requestId, {
      approvals: updatedApprovals,
      status,
    });
  }

  /**
   * Calculate request status based on approvals
   */
  private calculateRequestStatus(approvals: Approval[]): RequestStatus {
    if (approvals.length === 0) {
      return 'pending';
    }

    const hasDenial = approvals.some(approval => approval.decision === 'deny');
    if (hasDenial) {
      return 'denied';
    }

    // For now, any approval means approved
    // This can be customized based on business logic
    const hasApproval = approvals.some(approval => approval.decision === 'approve');
    if (hasApproval) {
      return 'approved';
    }

    return 'pending';
  }

  /**
   * Check if request has expired
   */
  async checkRequestExpiry(requestId: string): Promise<ApiResponse<Request>> {
    const request = await this.getById(requestId);
    if (!request.success || !request.data) {
      return request;
    }

    const now = new Date();
    if (request.data.expiresAt < now && request.data.status === 'pending') {
      return this.update(requestId, { status: 'expired' });
    }

    return request;
  }

  /**
   * Extend request expiry
   */
  async extendRequestExpiry(requestId: string, additionalHours: number): Promise<ApiResponse<Request>> {
    const request = await this.getById(requestId);
    if (!request.success || !request.data) {
      return request;
    }

    const newExpiryDate = new Date(request.data.expiresAt.getTime() + additionalHours * 60 * 60 * 1000);
    
    return this.update(requestId, { expiresAt: newExpiryDate });
  }

  /**
   * Get requests requiring approval from a parent
   */
  async getRequestsForParentApproval(parentId: string, familyId?: string): Promise<ApiResponse<Request[]>> {
    const whereConditions = [
      { field: 'status', operator: '==', value: 'pending' },
      // This is a simplified approach - in practice, you might need to join with family data
      // to get requests that haven't been approved by this parent yet
    ];
    
    if (familyId) {
      whereConditions.push({ field: 'familyId', operator: '==', value: familyId });
    }

    const requests = await this.query({
      where: whereConditions,
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    });

    if (!requests.success || !requests.data) {
      return requests;
    }

    // Filter out requests already approved/denied by this parent
    const filteredRequests = requests.data.filter(request => 
      !request.approvals.some(approval => approval.parentId === parentId)
    );

    return {
      success: true,
      data: filteredRequests,
    };
  }

  /**
   * Get request statistics for a family
   */
  async getFamilyRequestStats(familyId: string): Promise<{
    total: number;
    pending: number;
    approved: number;
    denied: number;
    expired: number;
    byType: Record<RequestType, number>;
  }> {
    const requests = await this.getRequestsByFamily(familyId);
    
    if (!requests.success || !requests.data) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        denied: 0,
        expired: 0,
        byType: {} as Record<RequestType, number>,
      };
    }

    const requestList = requests.data;
    
    const stats = requestList.reduce((acc, request) => {
      acc.total++;
      acc[request.status]++;
      acc.byType[request.type] = (acc.byType[request.type] || 0) + 1;
      return acc;
    }, {
      total: 0,
      pending: 0,
      approved: 0,
      denied: 0,
      expired: 0,
      byType: {} as Record<RequestType, number>,
    });

    return stats;
  }

  /**
   * Subscribe to family requests
   */
  subscribeToFamilyRequests(familyId: string, callback: (requests: Request[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'familyId', operator: '==', value: familyId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Subscribe to user requests
   */
  subscribeToUserRequests(requesterId: string, callback: (requests: Request[]) => void) {
    return this.subscribeToCollection({
      where: [{ field: 'requesterId', operator: '==', value: requesterId }],
      orderBy: [{ field: 'createdAt', direction: 'desc' }],
    }, callback);
  }

  /**
   * Clean up expired requests (batch operation)
   */
  async cleanupExpiredRequests(): Promise<ApiResponse<number>> {
    const expiredRequests = await this.getExpiredRequests();
    
    if (!expiredRequests.success || !expiredRequests.data) {
      return {
        success: false,
        error: 'Failed to fetch expired requests',
      };
    }

    const updatePromises = expiredRequests.data
      .filter(request => request.status === 'pending')
      .map(request => this.update(request.id, { status: 'expired' }));

    const results = await Promise.all(updatePromises);
    const successful = results.filter(result => result.success);

    return {
      success: true,
      data: successful.length,
      message: `Marked ${successful.length} requests as expired`,
    };
  }
}

export const requestService = new RequestService();
export default requestService;
