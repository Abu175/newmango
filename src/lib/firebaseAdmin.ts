import admin from "firebase-admin";
import fs from "fs";
import path from "path";

let app: admin.app.App | null = null;

function getServiceAccount() {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (serviceAccountPath) {
    const fullPath = path.isAbsolute(serviceAccountPath)
      ? serviceAccountPath
      : path.join(process.cwd(), serviceAccountPath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Firebase service account file not found at ${fullPath}`);
    }
    return JSON.parse(fs.readFileSync(fullPath, "utf8"));
  }

  // Fallback to service account JSON in environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  return null;
}

export function getFirebaseAdmin() {
  if (app) return app;

  const serviceAccount = getServiceAccount();

  if (serviceAccount) {
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });
  } else {
    // Initialize with default credentials (e.g., GCP environment)
    app = admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL || undefined,
    });
  }

  return app;
}

export default getFirebaseAdmin;
