import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';
import { enableOfflineMode, disableOfflineMode } from '@/config/firebase';
import { errorHandler, ErrorContext } from './errorHandler';
import { AppError } from '@/types';

export interface OfflineState {
  isConnected: boolean;
  isInternetReachable: boolean;
  type: string | null;
  isOfflineMode: boolean;
}

export interface OfflineOperation {
  id: string;
  operation: () => Promise<any>;
  context: ErrorContext;
  timestamp: Date;
  retryCount: number;
  maxRetries: number;
}

export class OfflineManager {
  private static instance: OfflineManager;
  private offlineState: OfflineState = {
    isConnected: true,
    isInternetReachable: true,
    type: null,
    isOfflineMode: false,
  };
  private operationQueue: OfflineOperation[] = [];
  private listeners: Array<(state: OfflineState) => void> = [];
  private isProcessingQueue = false;
  private netInfoUnsubscribe: (() => void) | null = null;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  /**
   * Initialize offline manager
   */
  async initialize(): Promise<void> {
    // Subscribe to network state changes
    this.netInfoUnsubscribe = NetInfo.addEventListener(state => {
      this.handleNetworkStateChange(state);
    });

    // Get initial network state
    const state = await NetInfo.fetch();
    this.handleNetworkStateChange(state);
  }

  /**
   * Cleanup offline manager
   */
  destroy(): void {
    if (this.netInfoUnsubscribe) {
      this.netInfoUnsubscribe();
      this.netInfoUnsubscribe = null;
    }
    this.listeners = [];
    this.operationQueue = [];
  }

  /**
   * Handle network state changes
   */
  private handleNetworkStateChange(state: NetInfo.NetInfoState): void {
    const newOfflineState: OfflineState = {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? false,
      type: state.type,
      isOfflineMode: !state.isConnected || !state.isInternetReachable,
    };

    const wasOffline = this.offlineState.isOfflineMode;
    this.offlineState = newOfflineState;

    // Notify listeners
    this.listeners.forEach(listener => listener(newOfflineState));

    // Handle transition from offline to online
    if (wasOffline && !newOfflineState.isOfflineMode) {
      this.handleOnlineTransition();
    }
    // Handle transition from online to offline
    else if (!wasOffline && newOfflineState.isOfflineMode) {
      this.handleOfflineTransition();
    }
  }

  /**
   * Handle transition to online
   */
  private async handleOnlineTransition(): Promise<void> {
    try {
      // Disable Firebase offline mode
      await disableOfflineMode();
      
      // Process queued operations
      await this.processOperationQueue();
      
      console.log('Back online - processing queued operations');
    } catch (error) {
      console.error('Error handling online transition:', error);
    }
  }

  /**
   * Handle transition to offline
   */
  private async handleOfflineTransition(): Promise<void> {
    try {
      // Enable Firebase offline mode
      await enableOfflineMode();
      
      console.log('Gone offline - enabling offline mode');
    } catch (error) {
      console.error('Error handling offline transition:', error);
    }
  }

  /**
   * Subscribe to offline state changes
   */
  subscribe(listener: (state: OfflineState) => void): () => void {
    this.listeners.push(listener);
    
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Get current offline state
   */
  getOfflineState(): OfflineState {
    return { ...this.offlineState };
  }

  /**
   * Check if currently offline
   */
  isOffline(): boolean {
    return this.offlineState.isOfflineMode;
  }

  /**
   * Execute operation with offline support
   */
  async executeWithOfflineSupport<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    options: {
      queueOnOffline?: boolean;
      maxRetries?: number;
    } = {}
  ): Promise<T> {
    const {
      queueOnOffline = true,
      maxRetries = 3,
    } = options;

    // If online, execute immediately
    if (!this.offlineState.isOfflineMode) {
      try {
        return await operation();
      } catch (error) {
        // If error is network-related and we should queue, add to queue
        if (queueOnOffline && this.isNetworkError(error)) {
          return this.queueOperation(operation, context, maxRetries);
        }
        throw error;
      }
    }

    // If offline and should queue, add to queue
    if (queueOnOffline) {
      return this.queueOperation(operation, context, maxRetries);
    }

    // If offline and shouldn't queue, throw error
    throw errorHandler.handleError(
      createOfflineError('Operation requires internet connection'),
      context
    );
  }

  /**
   * Queue operation for later execution
   */
  private queueOperation<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    maxRetries: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const operationId = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const queuedOperation: OfflineOperation = {
        id: operationId,
        operation,
        context,
        timestamp: new Date(),
        retryCount: 0,
        maxRetries,
      };

      this.operationQueue.push(queuedOperation);
      
      // Set up a promise that will resolve when the operation completes
      const checkCompletion = () => {
        const op = this.operationQueue.find(o => o.id === operationId);
        if (!op) {
          // Operation was completed and removed from queue
          resolve(undefined as T);
        }
      };

      // Check every second if operation is still in queue
      const interval = setInterval(checkCompletion, 1000);
      
      // Clean up interval after 5 minutes
      setTimeout(() => {
        clearInterval(interval);
        const stillQueued = this.operationQueue.find(o => o.id === operationId);
        if (stillQueued) {
          reject(new Error('Operation timed out while queued'));
        }
      }, 5 * 60 * 1000);
    });
  }

  /**
   * Process queued operations
   */
  private async processOperationQueue(): Promise<void> {
    if (this.isProcessingQueue || this.operationQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    try {
      const operations = [...this.operationQueue];
      const results = await Promise.allSettled(
        operations.map(op => this.executeQueuedOperation(op))
      );

      // Remove completed operations
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const op = operations[index];
          this.removeOperationFromQueue(op.id);
        }
      });

      // Log results
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0 || failed > 0) {
        console.log(`Processed offline queue: ${successful} successful, ${failed} failed`);
      }
    } catch (error) {
      console.error('Error processing operation queue:', error);
    } finally {
      this.isProcessingQueue = false;
    }
  }

  /**
   * Execute a queued operation
   */
  private async executeQueuedOperation(operation: OfflineOperation): Promise<void> {
    try {
      await operation.operation();
    } catch (error) {
      operation.retryCount++;
      
      if (operation.retryCount <= operation.maxRetries) {
        // Schedule retry with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, operation.retryCount), 30000);
        setTimeout(() => {
          this.executeQueuedOperation(operation);
        }, delay);
      } else {
        // Max retries exceeded, remove from queue
        console.error(`Operation ${operation.id} failed after ${operation.maxRetries} retries`);
        this.removeOperationFromQueue(operation.id);
      }
    }
  }

  /**
   * Remove operation from queue
   */
  private removeOperationFromQueue(operationId: string): void {
    this.operationQueue = this.operationQueue.filter(op => op.id !== operationId);
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: any): boolean {
    const networkErrorCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR',
      'firestore/unavailable',
      'firestore/deadline-exceeded',
      'auth/network-request-failed',
    ];
    
    return networkErrorCodes.includes(error.code) ||
           error.message?.includes('network') ||
           error.message?.includes('timeout') ||
           error.message?.includes('fetch');
  }

  /**
   * Get queued operations count
   */
  getQueuedOperationsCount(): number {
    return this.operationQueue.length;
  }

  /**
   * Clear queued operations
   */
  clearQueuedOperations(): void {
    this.operationQueue = [];
  }

  /**
   * Get queued operations for debugging
   */
  getQueuedOperations(): OfflineOperation[] {
    return [...this.operationQueue];
  }
}

// Export singleton instance
export const offlineManager = OfflineManager.getInstance();

// Utility function to create offline error
export const createOfflineError = (message: string): AppError => ({
  code: 'OFFLINE_ERROR',
  message,
  timestamp: new Date(),
});

// React hook for offline state
export const useOfflineState = (): OfflineState => {
  const [offlineState, setOfflineState] = useState<OfflineState>(
    offlineManager.getOfflineState()
  );

  useEffect(() => {
    const unsubscribe = offlineManager.subscribe(setOfflineState);
    return unsubscribe;
  }, []);

  return offlineState;
};

// Higher-order function to wrap operations with offline support
export const withOfflineSupport = <T extends any[], R>(
  operation: (...args: T) => Promise<R>,
  context: ErrorContext,
  options?: {
    queueOnOffline?: boolean;
    maxRetries?: number;
  }
) => {
  return async (...args: T): Promise<R> => {
    return offlineManager.executeWithOfflineSupport(
      () => operation(...args),
      context,
      options
    );
  };
};
