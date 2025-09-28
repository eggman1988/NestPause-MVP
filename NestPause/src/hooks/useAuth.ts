import { useEffect, useState } from 'react';
import { authService, AuthState } from '@/services';
import { useAppStore } from '@/store';

export const useAuth = () => {
  const { user, setUser, setLoading, setError, clearError } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((authState: AuthState) => {
      setUser(authState.user);
      setLoading(authState.isLoading);
      setIsInitialized(true);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    clearError();

    try {
      const result = await authService.signIn({ email, password });
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        setError({
          code: 'SIGN_IN_ERROR',
          message: result.error || 'Sign in failed',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setError({
        code: 'SIGN_IN_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    displayName: string, 
    role: 'parent' | 'child' = 'child'
  ) => {
    setLoading(true);
    clearError();

    try {
      const result = await authService.signUp({
        email,
        password,
        displayName,
        role,
      });
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data, message: result.message };
      } else {
        setError({
          code: 'SIGN_UP_ERROR',
          message: result.error || 'Sign up failed',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setError({
        code: 'SIGN_UP_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    
    try {
      await authService.signOut();
      setUser(null);
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      setError({
        code: 'SIGN_OUT_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    clearError();

    try {
      const result = await authService.signInWithGoogle();
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        setError({
          code: 'GOOGLE_SIGN_IN_ERROR',
          message: result.error || 'Google sign in failed',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Google sign in failed';
      setError({
        code: 'GOOGLE_SIGN_IN_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    clearError();

    try {
      const result = await authService.sendPasswordResetEmail(email);
      
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError({
          code: 'RESET_PASSWORD_ERROR',
          message: result.error || 'Password reset failed',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setError({
        code: 'RESET_PASSWORD_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    setLoading(true);
    clearError();

    try {
      const result = await authService.updateProfile(updates);
      
      if (result.success && result.data) {
        setUser(result.data);
        return { success: true, user: result.data };
      } else {
        setError({
          code: 'UPDATE_PROFILE_ERROR',
          message: result.error || 'Profile update failed',
          timestamp: new Date(),
        });
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      setError({
        code: 'UPDATE_PROFILE_ERROR',
        message: errorMessage,
        details: error,
        timestamp: new Date(),
      });
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isInitialized,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    updateProfile,
  };
};
