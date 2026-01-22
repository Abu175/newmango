"use client";

import React from "react";
import { signInWithGooglePopup } from "../../lib/firebaseClient";

interface Props {
  onLogin?: (user: { email?: string; name?: string }, idToken?: string) => void;
}

export default function SignInWithGoogle({ onLogin }: Props) {
  const handleSignIn = async () => {
    try {
      const result = await signInWithGooglePopup();
      const user = result.user;
      const token = await user.getIdToken();
      const profile = {
        email: user.email || undefined,
        name: user.displayName || undefined,
      };
      if (onLogin) onLogin(profile, token);
      // Store ID token for API calls if desired
      try {
        localStorage.setItem("firebaseIdToken", token);
      } catch (e) {
        // ignore storage errors in SSR contexts
      }
    } catch (err: any) {
      // Log full error for debugging
      console.error("Google sign-in failed:", err);
      const message = err?.message || (typeof err === "string" ? err : "Unknown error");
      alert(`Google sign-in failed: ${message}`);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className="w-full inline-flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100"
    >
      Sign in with Google (Firebase)
    </button>
  );
}
