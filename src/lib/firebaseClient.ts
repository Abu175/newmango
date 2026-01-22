import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnkNIBHSfT2F_HNKPuWeqxLQMlUmR7lqs",
  authDomain: "codiloredev.firebaseapp.com",
  projectId: "codiloredev",
  storageBucket: "codiloredev.firebasestorage.app",
  messagingSenderId: "445741863948",
  appId: "1:445741863948:web:df1ac0125f23d6cfbc4a29",
  measurementId: "G-FETZ675JFL"
};

const isConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);

let authInstance: ReturnType<typeof getAuth> | null = null;
let providerInstance: GoogleAuthProvider | null = null;

let githubProviderInstance: GithubAuthProvider | null = null;

if (isConfigured) {
  if (!getApps().length) {
    initializeApp(firebaseConfig as any);
  }
  authInstance = getAuth();
  providerInstance = new GoogleAuthProvider();
  githubProviderInstance = new GithubAuthProvider();
}

export const auth = authInstance;

export async function signInWithGooglePopup() {
  if (!isConfigured || !authInstance || !providerInstance) {
    throw new Error("Firebase client not configured.");
  }
  try {
    return await signInWithPopup(authInstance, providerInstance);
  } catch (err: any) {
    console.error("signInWithPopup error:", err);
    throw new Error(err?.message || String(err));
  }
}

export async function signInWithGitHubPopup() {
  if (!isConfigured || !authInstance || !githubProviderInstance) {
    throw new Error("Firebase client not configured.");
  }
  try {
    return await signInWithPopup(authInstance, githubProviderInstance);
  } catch (err: any) {
    console.error("signInWithGitHubPopup error:", err);
    throw new Error(err?.message || String(err));
  }
}
