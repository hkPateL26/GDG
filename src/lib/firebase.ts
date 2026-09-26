// ============================================
// Firebase CLIENT-SIDE Config (Browser & Fallback)
// ============================================
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDRpbivZYRBV4TgLLwEYq9eu4vL9yrIPik",
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "lumina-kitchen.firebaseapp.com",
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "lumina-kitchen",
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "lumina-kitchen.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "55663881246",
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:55663881246:web:0a8e0c5df730e875bf520f",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;

try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
} catch (e) {
  console.warn("Firebase client initialization fallback:", e);
}

export { app, db, auth };
export default app;
