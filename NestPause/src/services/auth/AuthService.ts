import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  OAuthCredential,
  Unsubscribe
} from 'firebase/auth';
import { auth, firestore } from '@/config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { User, UserRole, ApiResponse, AppError } from '@/types';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  familyId?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UserProfileUpdate {
  displayName?: string;
  photoURL?: string;
}

class AuthService {
  private authStateListeners: ((state: AuthState) => void)[] = [];
  private authStateUnsubscribe: Unsubscribe | null = null;

  constructor() {
    this.initializeAuthStateListener();
  }

  /**
   * Initialize auth state listener
   */
  private initializeAuthStateListener(): void {
    this.authStateUnsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      let user: User | null = null;

      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          user = {
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: userData.displayName || firebaseUser.displayName || '',
            role: userData.role || 'child',
            familyId: userData.familyId || '',
            createdAt: userData.createdAt?.toDate() || new Date(),
            updatedAt: userData.updatedAt?.toDate() || new Date(),
          };
        }
      }

      const authState: AuthState = {
        user,
        isLoading: false,
        isAuthenticated: !!user,
      };

      this.authStateListeners.forEach(listener => listener(authState));
    });
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (state: AuthState) => void): Unsubscribe {
    this.authStateListeners.push(callback);
    
    return () => {
      const index = this.authStateListeners.indexOf(callback);
      if (index > -1) {
        this.authStateListeners.splice(index, 1);
      }
    };
  }

  /**
   * Sign up with email and password
   */
  async signUp(data: SignUpData): Promise<ApiResponse<User>> {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, {
        displayName: data.displayName,
      });

      // Create user document in Firestore
      const userData: Omit<User, 'id'> = {
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        familyId: data.familyId || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      const user: User = {
        id: firebaseUser.uid,
        ...userData,
      };

      return {
        success: true,
        data: user,
        message: 'Account created successfully. Please check your email for verification.',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData): Promise<ApiResponse<User>> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        await this.signOut();
        return {
          success: false,
          error: 'User profile not found. Please contact support.',
        };
      }

      const userData = userDoc.data();
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: userData.displayName || firebaseUser.displayName || '',
        role: userData.role || 'child',
        familyId: userData.familyId || '',
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sign in with Google (Web only)
   */
  async signInWithGoogle(): Promise<ApiResponse<User>> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // Check if user document exists
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      
      let user: User;

      if (!userDoc.exists()) {
        // Create new user document
        const userData: Omit<User, 'id'> = {
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          role: 'child', // Default role, can be updated later
          familyId: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await setDoc(doc(firestore, 'users', firebaseUser.uid), {
          ...userData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        user = {
          id: firebaseUser.uid,
          ...userData,
        };
      } else {
        // Use existing user data
        const userData = userDoc.data();
        user = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: userData.displayName || firebaseUser.displayName || '',
          role: userData.role || 'child',
          familyId: userData.familyId || '',
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<ApiResponse<void>> {
    try {
      await signOut(auth);
      return {
        success: true,
        data: undefined,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: UserProfileUpdate): Promise<ApiResponse<User>> {
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        return {
          success: false,
          error: 'No authenticated user',
        };
      }

      // Update Firebase Auth profile
      await updateProfile(firebaseUser, updates);

      // Update Firestore document
      await setDoc(doc(firestore, 'users', firebaseUser.uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      // Fetch updated user data
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      const userData = userDoc.data()!;

      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        displayName: userData.displayName || firebaseUser.displayName || '',
        role: userData.role || 'child',
        familyId: userData.familyId || '',
        createdAt: userData.createdAt?.toDate() || new Date(),
        updatedAt: userData.updatedAt?.toDate() || new Date(),
      };

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<ApiResponse<void>> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        data: undefined,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth.currentUser;
  }

  /**
   * Get current user's ID token
   */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      return await user.getIdToken(forceRefresh);
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: any): ApiResponse<never> {
    console.error('Auth service error:', error);
    
    let message = 'An unexpected error occurred';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No account found with this email address';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/email-already-in-use':
        message = 'An account with this email already exists';
        break;
      case 'auth/weak-password':
        message = 'Password should be at least 6 characters';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        message = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your connection';
        break;
    }

    return {
      success: false,
      error: message,
    };
  }

  /**
   * Cleanup auth state listener
   */
  destroy(): void {
    if (this.authStateUnsubscribe) {
      this.authStateUnsubscribe();
      this.authStateUnsubscribe = null;
    }
    this.authStateListeners = [];
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
