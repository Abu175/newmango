"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../../components/Sidebar";

interface User {
  email: string;
  name: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [kiloCodeApiKey, setKiloCodeApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get current user from Firebase
    import("../../lib/firebaseClient").then(({ auth }) => {
      if (auth) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUser({
            email: currentUser.email || "demo@example.com",
            name: currentUser.displayName || "Demo User"
          });
        } else {
          // Try localStorage as fallback
          const userData = localStorage.getItem("userData");
          if (userData) {
            setUser(JSON.parse(userData));
          } else {
            // For demo purposes, set a default user if not authenticated
            setUser({ email: "demo@example.com", name: "Demo User" });
          }
        }
      } else {
        // Fallback to localStorage
        const userData = localStorage.getItem("userData");
        if (userData) {
          setUser(JSON.parse(userData));
        } else {
          setUser({ email: "demo@example.com", name: "Demo User" });
        }
      }
    });

    // Load saved API key
    const savedApiKey = localStorage.getItem("kiloCodeApiKey");
    if (savedApiKey) {
      setKiloCodeApiKey(savedApiKey);
    }

    setLoading(false);
    setMounted(true);
  }, [router]);

  const handleSaveApiKey = async () => {
    setSaving(true);
    try {
      // In a real implementation, you'd send this to the server
      // For now, we'll store it locally and also update the extension if possible
      localStorage.setItem("kiloCodeApiKey", kiloCodeApiKey);

      // Try to notify the extension about the API key update
      if (window.parent !== window) {
        try {
          window.parent.postMessage({
            type: "kilocode-api-key-updated",
            apiKey: kiloCodeApiKey
          }, "*");
        } catch (e) {
          // Extension might not be listening, that's okay
        }
      }

      alert("API key saved successfully!");
    } catch (error) {
      alert("Failed to save API key");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("kiloCodeApiKey");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen flex" style={{background: 'var(--bg-color)'}}>
      <Sidebar activeItem="profile" />
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-lg p-8"
            style={{
              background: 'var(--bg-color)',
              boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)'
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold" style={{color: 'var(--text-color)'}}>
                  Profile Settings
                </h1>
                <p className="mt-2 opacity-80" style={{color: 'var(--text-color)'}}>
                  Manage your Codilore account and API keys
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md font-medium"
                style={{
                  color: 'var(--text-color)',
                  background: 'var(--bg-color)',
                  boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                }}
              >
                Logout
              </button>
            </div>

            {/* User Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4" style={{color: 'var(--text-color)'}}>
                Account Information
              </h2>
              <div
                className="rounded-lg p-4"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-80" style={{color: 'var(--text-color)'}}>
                      Name
                    </label>
                    <p style={{color: 'var(--text-color)'}}>{mounted ? user.name : 'Loading...'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-80" style={{color: 'var(--text-color)'}}>
                      Email
                    </label>
                    <p style={{color: 'var(--text-color)'}}>{mounted ? user.email : 'Loading...'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Management */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4" style={{color: 'var(--text-color)'}}>
                API Keys
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 opacity-80" style={{color: 'var(--text-color)'}}>
                    Codilore API Key
                  </label>
                  <input
                    type="password"
                    value={kiloCodeApiKey}
                    onChange={(e) => setKiloCodeApiKey(e.target.value)}
                    placeholder="Enter your Codilore API key"
                    className="w-full px-3 py-2 rounded-md outline-none"
                    style={{
                      background: 'var(--bg-color)',
                      color: 'var(--text-color)',
                      boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                    }}
                  />
                  <p className="text-sm mt-1 opacity-70" style={{color: 'var(--text-color)'}}>
                    Your API key is used to authenticate requests to Codilore services.
                    Keep it secure and don't share it with others.
                  </p>
                </div>
                <button
                  onClick={handleSaveApiKey}
                  disabled={saving}
                  className="px-4 py-2 rounded-md font-medium disabled:opacity-50"
                  style={{
                    background: 'var(--primary-color)',
                    color: 'white',
                    boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)'
                  }}
                >
                  {saving ? "Saving..." : "Save API Key"}
                </button>
              </div>
            </div>

            {/* Extension Integration Info */}
            <div
              className="rounded-lg p-4"
              style={{
                background: 'var(--bg-color)',
                boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
              }}
            >
              <h3 className="text-lg font-medium mb-2" style={{color: 'var(--primary-color)'}}>
                Extension Integration
              </h3>
              <p className="text-sm opacity-80" style={{color: 'var(--text-color)'}}>
                Your API key will be automatically used by the Codilore extension when you sign in.
                Make sure to keep your key updated here for the best experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}