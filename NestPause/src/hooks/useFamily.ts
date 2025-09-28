import { useState, useCallback } from 'react';
import { familyService } from '@/services';
import { useAppStore } from '@/store';
import { Family, Device, Rule } from '@/types';

export const useFamily = () => {
  const { 
    family, 
    devices, 
    rules, 
    setFamily, 
    setLoading, 
    setError, 
    clearError 
  } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const createFamily = useCallback(async (name: string, parentId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.createFamily(name, parentId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'CREATE_FAMILY_ERROR',
          message: result.error || 'Failed to create family',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create family';
      setError({
        code: 'CREATE_FAMILY_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const addParent = useCallback(async (familyId: string, parentId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.addParent(familyId, parentId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'ADD_PARENT_ERROR',
          message: result.error || 'Failed to add parent',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add parent';
      setError({
        code: 'ADD_PARENT_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const addChild = useCallback(async (familyId: string, childId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.addChild(familyId, childId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'ADD_CHILD_ERROR',
          message: result.error || 'Failed to add child',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add child';
      setError({
        code: 'ADD_CHILD_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const removeParent = useCallback(async (familyId: string, parentId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.removeParent(familyId, parentId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'REMOVE_PARENT_ERROR',
          message: result.error || 'Failed to remove parent',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove parent';
      setError({
        code: 'REMOVE_PARENT_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const removeChild = useCallback(async (familyId: string, childId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.removeChild(familyId, childId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'REMOVE_CHILD_ERROR',
          message: result.error || 'Failed to remove child',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove child';
      setError({
        code: 'REMOVE_CHILD_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const addDevice = useCallback(async (familyId: string, device: Device) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.addDevice(familyId, device);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'ADD_DEVICE_ERROR',
          message: result.error || 'Failed to add device',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add device';
      setError({
        code: 'ADD_DEVICE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const updateDevice = useCallback(async (familyId: string, deviceId: string, updates: Partial<Device>) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.updateDevice(familyId, deviceId, updates);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'UPDATE_DEVICE_ERROR',
          message: result.error || 'Failed to update device',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update device';
      setError({
        code: 'UPDATE_DEVICE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const removeDevice = useCallback(async (familyId: string, deviceId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.removeDevice(familyId, deviceId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'REMOVE_DEVICE_ERROR',
          message: result.error || 'Failed to remove device',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove device';
      setError({
        code: 'REMOVE_DEVICE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const addRule = useCallback(async (familyId: string, rule: Rule) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.addRule(familyId, rule);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'ADD_RULE_ERROR',
          message: result.error || 'Failed to add rule',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add rule';
      setError({
        code: 'ADD_RULE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const updateRule = useCallback(async (familyId: string, ruleId: string, updates: Partial<Rule>) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.updateRule(familyId, ruleId, updates);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'UPDATE_RULE_ERROR',
          message: result.error || 'Failed to update rule',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update rule';
      setError({
        code: 'UPDATE_RULE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  const removeRule = useCallback(async (familyId: string, ruleId: string) => {
    setIsLoading(true);
    clearError();

    try {
      const result = await familyService.removeRule(familyId, ruleId);
      
      if (result.success && result.data) {
        setFamily(result.data);
        return { success: true, family: result.data };
      } else {
        setError({
          code: 'REMOVE_RULE_ERROR',
          message: result.error || 'Failed to remove rule',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove rule';
      setError({
        code: 'REMOVE_RULE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [setFamily, setError, clearError]);

  return {
    family,
    devices,
    rules,
    isLoading,
    createFamily,
    addParent,
    addChild,
    removeParent,
    removeChild,
    addDevice,
    updateDevice,
    removeDevice,
    addRule,
    updateRule,
    removeRule,
  };
};
