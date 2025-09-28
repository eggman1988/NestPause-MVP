import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { 
  getFirestore, 
  Firestore, 
  connectFirestoreEmulator,
  enableNetwork,
  disableNetwork,
  initializeFirestore
} from 'firebase/firestore';
import { getFunctions, Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import Constants from 'expo-constants';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDNMy4b4-kUhNabTvtIk_Z0kHUF_NFMUyw",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "nestpause-app.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "nestpause-app",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "nestpause-app.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "97808238127",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:97808238127:web:1122ecc87de931fb1868da",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || Constants.expoConfig?.extra?.firebaseMeasurementId,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let functions: Functions;
let storage: FirebaseStorage;

// Initialize Firebase app (only if not already initialized)
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
auth = getAuth(app);

// Initialize Firestore with settings for offline support
if (typeof window !== 'undefined') {
  // Web environment
  firestore = getFirestore(app);
} else {
  // React Native environment
  firestore = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Better for React Native
  });
}

functions = getFunctions(app);
storage = getStorage(app);

// Development/Testing configuration
const isDevelopment = process.env.NODE_ENV === 'development' || process.env.EXPO_PUBLIC_ENV === 'development';

if (isDevelopment) {
  // Configure emulators for development
  const useEmulators = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATORS === 'true';
  
  if (useEmulators) {
    try {
      // Auth emulator
      connectAuthEmulator(auth, 'http://localhost:9099');
      
      // Firestore emulator
      connectFirestoreEmulator(firestore, 'localhost', 8080);
      
      // Functions emulator
      connectFunctionsEmulator(functions, 'localhost', 5001);
      
      // Storage emulator
      connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      console.warn('Emulator connection failed:', error);
    }
  }
}

// Offline support utilities
export const enableOfflineMode = async () => {
  try {
    await disableNetwork(firestore);
    console.log('Firestore offline mode enabled');
  } catch (error) {
    console.error('Error enabling offline mode:', error);
  }
};

export const disableOfflineMode = async () => {
  try {
    await enableNetwork(firestore);
    console.log('Firestore offline mode disabled');
  } catch (error) {
    console.error('Error disabling offline mode:', error);
  }
};

// Export Firebase services
export { app, auth, firestore, functions, storage };
export default app;
