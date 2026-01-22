"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import SignInWithGoogle from "./SignInWithGoogle";

interface LoginFormProps {
  onLogin: (user: { email: string; name: string }) => void;
}

export function LoginForm({ onLogin }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const body = isLogin
        ? { email, password }
        : { email, password, name };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.success && data.user) {
        // Store token in localStorage for future requests
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        onLogin(data.user);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-center space-x-4 mb-6">
        <button
          type="button"
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            isLogin
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            !isLogin
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Register
        </button>
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required={!isLogin}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Enter your full name"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter your password"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
      </button>

      <div className="text-center mt-4 space-y-3">
        <SignInWithGoogle
          onLogin={(user, idToken) => {
            // Store token and notify parent of login
            try {
              if (idToken) localStorage.setItem("authToken", idToken);
            } catch (e) {}
            if (user && user.email && user.name) onLogin({ email: user.email, name: user.name });
          }}
        />

        <div>
          <button
            type="button"
            onClick={() => {
              if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
                alert("Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local and restart the dev server.");
                return;
              }
              signIn("google");
            }}
            className="w-full inline-flex items-center justify-center border border-gray-300 rounded-md py-2 px-4 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
          >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.4H272v95.4h146.9c-6.3 34.1-25.3 62.9-54 82v68.1h87.3c51-46.9 81.3-116.3 81.3-195.1z"/>
            <path fill="#34a853" d="M272 544.3c73.6 0 135.5-24.4 180.6-66.2l-87.3-68.1c-24.3 16.3-55.6 26-93.3 26-71.7 0-132.6-48.3-154.4-113.4H30.4v71.3C75.5 485.1 167 544.3 272 544.3z"/>
            <path fill="#fbbc04" d="M117.6 324.8c-10.8-32.5-10.8-67.6 0-100.1V153.4H30.4c-39 77.9-39 169.4 0 247.3l87.2-76z"/>
            <path fill="#ea4335" d="M272 107.7c39 0 74 13.4 101.6 39.9l76.1-76.1C407.3 24.8 345.4 0 272 0 167 0 75.5 59.2 30.4 153.4l87.2 71.3C139.4 156 200.3 107.7 272 107.7z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
      </div>
    </form>
  );
}