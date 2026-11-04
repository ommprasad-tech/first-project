import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let isFirebaseConfigured = false;

try {
  // Dynamically import config if present
  const config = (window as any).__FIREBASE_CONFIG__ || null;
  if (config && config.apiKey) {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
    isFirebaseConfigured = true;
  }
} catch (e) {
  console.log('Firebase initialized in fallback offline/local mode.');
}

export { app, authInstance as auth, dbInstance as db, isFirebaseConfigured };
