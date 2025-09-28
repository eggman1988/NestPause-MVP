import { useState, useCallback } from 'react';
import { requestService } from '@/services';
import { useAppStore } from '@/store';
import { Request, RequestType } from '@/types';

export const useRequests = () => {
  const { 
    requests, 
    addRequest, 
    updateRequest, 
    setLoading, 
    setError, 
    clearError 
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const createRequest = useCallback(async (
    familyId: string,
    requesterId: string,
    type: RequestType,
    target: string,
    duration?: number,
    reason?: string,
    expiresInHours = 24
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.createRequest(
        familyId,
        requesterId,
        type,
        target,
        duration,
        reason,
        expiresInHours
      );
      
      if (result.success && result.data) {
        addRequest(result.data);
        return { success: true, request: result.data };
      } else {
        setError({
          code: 'CREATE_REQUEST_ERROR',
          message: result.error || 'Failed to create request',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create request';
      setError({
        code: 'CREATE_REQUEST_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [addRequest, setError, clearError]);

  const approveRequest = useCallback(async (
    requestId: string, 
    parentId: string, 
    reason?: string
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.approveRequest(requestId, parentId, reason);
      
      if (result.success && result.data) {
        updateRequest(requestId, result.data);
        return { success: true, request: result.data };
      } else {
        setError({
          code: 'APPROVE_REQUEST_ERROR',
          message: result.error || 'Failed to approve request',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve request';
      setError({
        code: 'APPROVE_REQUEST_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateRequest, setError, clearError]);

  const denyRequest = useCallback(async (
    requestId: string, 
    parentId: string, 
    reason?: string
  ) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.denyRequest(requestId, parentId, reason);
      
      if (result.success && result.data) {
        updateRequest(requestId, result.data);
        return { success: true, request: result.data };
      } else {
        setError({
          code: 'DENY_REQUEST_ERROR',
          message: result.error || 'Failed to deny request',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to deny request';
      setError({
        code: 'DENY_REQUEST_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateRequest, setError, clearError]);

  const extendRequest = useCallback(async (requestId: string, additionalHours: number) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.extendRequestExpiry(requestId, additionalHours);
      
      if (result.success && result.data) {
        updateRequest(requestId, result.data);
        return { success: true, request: result.data };
      } else {
        setError({
          code: 'EXTEND_REQUEST_ERROR',
          message: result.error || 'Failed to extend request',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to extend request';
      setError({
        code: 'EXTEND_REQUEST_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [updateRequest, setError, clearError]);

  const getPendingRequests = useCallback(async (familyId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.getPendingRequests(familyId);
      
      if (result.success) {
        return { success: true, requests: result.data || [] };
      } else {
        setError({
          code: 'GET_PENDING_REQUESTS_ERROR',
          message: result.error || 'Failed to get pending requests',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get pending requests';
      setError({
        code: 'GET_PENDING_REQUESTS_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  const getRequestsForParent = useCallback(async (parentId: string, familyId?: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.getRequestsForParentApproval(parentId, familyId);
      
      if (result.success) {
        return { success: true, requests: result.data || [] };
      } else {
        setError({
          code: 'GET_PARENT_REQUESTS_ERROR',
          message: result.error || 'Failed to get requests for parent',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get requests for parent';
      setError({
        code: 'GET_PARENT_REQUESTS_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setError, clearError]);

  const cleanupExpiredRequests = useCallback(async () => {
    setIsLoading(true);
    clearError();

    try {
      const result = await requestService.cleanupExpiredRequests();
      
      if (result.success) {
        return { success: true, count: result.data };
      } else {
        setError({
          code: 'CLEANUP_REQUESTS_ERROR',
          message: result.error || 'Failed to cleanup expired requests',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cleanup expired requests';
      setError({
        code: 'CLEANUP_REQUESTS_ERROR',
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
  const pendingRequests = requests.filter(request => request.status === 'pending');
  const approvedRequests = requests.filter(request => request.status === 'approved');
  const deniedRequests = requests.filter(request => request.status === 'denied');
  const expiredRequests = requests.filter(request => request.status === 'expired');

  const getRequestsByType = useCallback((type: RequestType) => {
    return requests.filter(request => request.type === type);
  }, [requests]);

  const getRequestsByRequester = useCallback((requesterId: string) => {
    return requests.filter(request => request.requesterId === requesterId);
  }, [requests]);

  const hasPendingRequest = useCallback((target: string, type: RequestType) => {
    return requests.some(request => 
      request.target === target && 
      request.type === type && 
      request.status === 'pending'
    );
  }, [requests]);

  return {
    requests,
    pendingRequests,
    approvedRequests,
    deniedRequests,
    expiredRequests,
    isLoading,
    createRequest,
    approveRequest,
    denyRequest,
    extendRequest,
    getPendingRequests,
    getRequestsForParent,
    cleanupExpiredRequests,
    getRequestsByType,
    getRequestsByRequester,
    hasPendingRequest,
  };
};
