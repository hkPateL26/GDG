// ============================================
// Firebase ADMIN SDK (Server-side only with Fallback)
// ============================================
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App | undefined;
let adminDb: Firestore | undefined;

function getAdminApp(): App | undefined {
  if (getApps().length > 0) return getApps()[0];

  try {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      adminApp = initializeApp({
        credential: cert({
          projectId:   process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey:  process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      adminApp = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nagrik-seva-ai",
      });
    }
  } catch (err) {
    console.warn("Firebase Admin SDK init warning:", err);
  }

  return adminApp;
}

try {
  const currentApp = getAdminApp();
  if (currentApp) {
    adminDb = getFirestore(currentApp);
  }
} catch (e) {
  console.warn("Firebase Admin Firestore init fallback:", e);
}

export { adminDb, getAdminApp };
