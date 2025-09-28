import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, Alert } from 'react-native';
import { useAuth, useFamily, useRequests, useNotifications } from '@/hooks';
import { offlineManager } from '@/utils';

/**
 * Example component demonstrating how to use the NestPause data layer
 * This shows the complete integration of authentication, family management,
 * requests, notifications, and offline support.
 */
export const DataLayerExample: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Auth hooks
  const { 
    user, 
    isAuthenticated, 
    signIn, 
    signUp, 
    signOut, 
    isInitialized: authInitialized 
  } = useAuth();
  
  // Family hooks
  const { 
    family, 
    devices, 
    rules, 
    createFamily, 
    addDevice, 
    addRule,
    isLoading: familyLoading 
  } = useFamily();
  
  // Request hooks
  const { 
    requests, 
    pendingRequests, 
    createRequest, 
    approveRequest, 
    denyRequest,
    isLoading: requestLoading 
  } = useRequests();
  
  // Notification hooks
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    createRequestNotification,
    isLoading: notificationLoading 
  } = useNotifications();

  // Initialize offline manager
  useEffect(() => {
    const initializeOfflineManager = async () => {
      try {
        await offlineManager.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize offline manager:', error);
      }
    };

    initializeOfflineManager();
    
    return () => {
      offlineManager.destroy();
    };
  }, []);

  // Example: Create a family
  const handleCreateFamily = async () => {
    if (!user) return;
    
    const result = await createFamily('Smith Family', user.id);
    if (result.success) {
      Alert.alert('Success', 'Family created successfully!');
    } else {
      Alert.alert('Error', result.error || 'Failed to create family');
    }
  };

  // Example: Add a device
  const handleAddDevice = async () => {
    if (!family) return;
    
    const device = {
      id: `device_${Date.now()}`,
      name: 'iPhone 15',
      type: 'phone' as const,
      userId: user?.id || '',
      familyId: family.id,
      isActive: true,
      lastSeen: new Date(),
      platform: 'ios' as const,
      version: '17.0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await addDevice(family.id, device);
    if (result.success) {
      Alert.alert('Success', 'Device added successfully!');
    } else {
      Alert.alert('Error', result.error || 'Failed to add device');
    }
  };

  // Example: Create a rule
  const handleAddRule = async () => {
    if (!family) return;
    
    const rule = {
      id: `rule_${Date.now()}`,
      familyId: family.id,
      name: 'No Gaming After 8 PM',
      type: 'time_limit' as const,
      targetUserIds: family.childIds,
      schedule: {
        timezone: 'America/New_York',
        weekdays: [
          {
            day: 'monday' as const,
            timeSlots: [
              { start: '20:00', end: '06:00', type: 'blocked' as const }
            ]
          }
        ],
        exceptions: []
      },
      restrictions: [
        {
          type: 'app' as const,
          target: 'com.supercell.clashofclans',
          action: 'block' as const
        }
      ],
      isActive: true,
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const result = await addRule(family.id, rule);
    if (result.success) {
      Alert.alert('Success', 'Rule created successfully!');
    } else {
      Alert.alert('Error', result.error || 'Failed to create rule');
    }
  };

  // Example: Create a request
  const handleCreateRequest = async () => {
    if (!family || !user) return;
    
    const result = await createRequest(
      family.id,
      user.id,
      'extra_time',
      'YouTube',
      30, // 30 minutes
      'I need extra time to finish my homework video'
    );
    
    if (result.success) {
      Alert.alert('Success', 'Request created successfully!');
    } else {
      Alert.alert('Error', result.error || 'Failed to create request');
    }
  };

  // Example: Approve a request
  const handleApproveRequest = async (requestId: string) => {
    if (!user) return;
    
    const result = await approveRequest(requestId, user.id, 'Good reason');
    if (result.success) {
      Alert.alert('Success', 'Request approved!');
    } else {
      Alert.alert('Error', result.error || 'Failed to approve request');
    }
  };

  // Example: Deny a request
  const handleDenyRequest = async (requestId: string) => {
    if (!user) return;
    
    const result = await denyRequest(requestId, user.id, 'Not appropriate');
    if (result.success) {
      Alert.alert('Success', 'Request denied');
    } else {
      Alert.alert('Error', result.error || 'Failed to deny request');
    }
  };

  // Example: Create a notification
  const handleCreateNotification = async () => {
    if (!user) return;
    
    const result = await createRequestNotification(
      user.id,
      'request_123',
      'request_received',
      'New Request',
      'Your child has requested extra time for YouTube'
    );
    
    if (result.success) {
      Alert.alert('Success', 'Notification created!');
    } else {
      Alert.alert('Error', result.error || 'Failed to create notification');
    }
  };

  // Example: Sign in
  const handleSignIn = async () => {
    const result = await signIn('test@example.com', 'password123');
    if (!result.success) {
      Alert.alert('Sign In Failed', result.error);
    }
  };

  // Example: Sign up
  const handleSignUp = async () => {
    const result = await signUp(
      'test@example.com',
      'password123',
      'Test User',
      'parent'
    );
    if (!result.success) {
      Alert.alert('Sign Up Failed', result.error);
    }
  };

  // Example: Sign out
  const handleSignOut = async () => {
    const result = await signOut();
    if (!result.success) {
      Alert.alert('Sign Out Failed', result.error);
    }
  };

  if (!authInitialized || !isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Initializing...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        NestPause Data Layer Example
      </Text>

      {/* Authentication Section */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Authentication
        </Text>
        <Text>Status: {isAuthenticated ? 'Signed In' : 'Signed Out'}</Text>
        {user && (
          <Text>User: {user.displayName} ({user.role})</Text>
        )}
        
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          {!isAuthenticated ? (
            <>
              <Button title="Sign In" onPress={handleSignIn} />
              <Button title="Sign Up" onPress={handleSignUp} />
            </>
          ) : (
            <Button title="Sign Out" onPress={handleSignOut} />
          )}
        </View>
      </View>

      {/* Family Section */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Family Management
        </Text>
        {family ? (
          <View>
            <Text>Family: {family.name}</Text>
            <Text>Devices: {devices.length}</Text>
            <Text>Rules: {rules.length}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Button title="Add Device" onPress={handleAddDevice} />
              <Button title="Add Rule" onPress={handleAddRule} />
            </View>
          </View>
        ) : (
          <Button title="Create Family" onPress={handleCreateFamily} />
        )}
      </View>

      {/* Requests Section */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Requests
        </Text>
        <Text>Total: {requests.length}</Text>
        <Text>Pending: {pendingRequests.length}</Text>
        
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <Button title="Create Request" onPress={handleCreateRequest} />
        </View>

        {pendingRequests.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text>Pending Requests:</Text>
            {pendingRequests.slice(0, 3).map((request) => (
              <View key={request.id} style={{ flexDirection: 'row', marginTop: 5 }}>
                <Text style={{ flex: 1 }}>
                  {request.type}: {request.target}
                </Text>
                <Button 
                  title="Approve" 
                  onPress={() => handleApproveRequest(request.id)}
                />
                <Button 
                  title="Deny" 
                  onPress={() => handleDenyRequest(request.id)}
                />
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Notifications Section */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Notifications
        </Text>
        <Text>Total: {notifications.length}</Text>
        <Text>Unread: {unreadCount}</Text>
        
        <Button title="Create Notification" onPress={handleCreateNotification} />
      </View>

      {/* Offline Status */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Offline Status
        </Text>
        <Text>Queued Operations: {offlineManager.getQueuedOperationsCount()}</Text>
      </View>

      {/* Loading States */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
          Loading States
        </Text>
        <Text>Family: {familyLoading ? 'Loading...' : 'Ready'}</Text>
        <Text>Requests: {requestLoading ? 'Loading...' : 'Ready'}</Text>
        <Text>Notifications: {notificationLoading ? 'Loading...' : 'Ready'}</Text>
      </View>
    </ScrollView>
  );
};
