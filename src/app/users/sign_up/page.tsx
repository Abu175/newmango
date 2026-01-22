"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";

export default function SignUpToEditor() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  const source = searchParams.get("source") || "vscode";

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDark(theme === 'dark');
    document.body.classList.toggle('dark-theme', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.body.classList.toggle('dark-theme', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const handleLogin = (userData: { email: string; name: string }, authToken?: string) => {
    console.log("SignUp handleLogin called with:", userData, authToken);
    setUser(userData);
    setToken(authToken || null);
    setIsAuthenticated(true);

    // Redirect back to the extension with the token if available
    if (authToken) {
      const callbackUrl = `codilore://auth/callback?token=${encodeURIComponent(authToken)}&email=${encodeURIComponent(userData.email)}&name=${encodeURIComponent(userData.name)}`;
      console.log("Redirecting to:", callbackUrl);
      window.location.href = callbackUrl;
    } else {
      console.log("No auth token provided, redirecting to main page");
      window.location.href = "/";
    }
  };

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated && token && user) {
      const callbackUrl = `codilore://auth/callback?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}`;
      console.log("Redirecting to:", callbackUrl);
      window.location.href = callbackUrl;
    }
  }, [isAuthenticated, token, user, source]);

  const neumorphicStyle = {
    background: 'var(--bg-color)',
    borderRadius: '20px',
    boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)',
    transition: 'box-shadow 0.3s ease',
  };

  return (
    <main className="min-h-screen flex items-center justify-center" style={{background: 'var(--bg-color)'}}>
      <div className="w-full max-w-md">
        <div style={neumorphicStyle} className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleTheme}
                className="p-3 rounded-full"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)',
                  color: 'var(--text-color)'
                }}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {isDark ? (
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                  ) : (
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  )}
                  {!isDark && <circle cx="12" cy="12" r="5"></circle>}
                </svg>
              </button>
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{color: 'var(--text-color)'}}>
              Sign up for Codilore
            </h1>
            <p style={{color: 'var(--text-color)', opacity: 0.8}}>
              Create your account to use Codilore features in your editor
            </p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </main>
  );
}