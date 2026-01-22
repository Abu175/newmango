"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

export function Sidebar({ activeItem = "dashboard", onItemClick }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "⌂" },
    { id: "playground", label: "Playground", icon: "⚡" },
    { id: "needs", label: "Needs", icon: "📋" },
    { id: "profile", label: "Profile", icon: "⌘" },
    { id: "credits", label: "Credits", icon: "✩" },
  ];

  const neumorphicStyle = {
    background: 'var(--bg-color)',
    boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)'
  };

  const neumorphicInsetStyle = {
    background: 'var(--bg-color)',
    boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
  };

  return (
    <div
      className={`transition-all duration-300 relative sticky top-0 h-screen ${isCollapsed ? 'w-16' : 'w-64'}`}
      style={neumorphicStyle}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!isCollapsed && (
            <h2 className="text-lg font-bold" style={{ color: 'var(--text-color)' }}>Codilore</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md"
            style={neumorphicInsetStyle}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "dashboard") {
                  router.push("/dashboard");
                } else if (item.id === "playground") {
                  router.push("/playground");
                } else if (item.id === "needs") {
                  router.push("/needs");
                } else if (item.id === "credits") {
                  router.push("/credits");
                } else if (item.id === "profile") {
                  router.push("/profile");
                } else {
                  onItemClick?.(item.id);
                }
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-all`}
              style={{
                ...(activeItem === item.id ? neumorphicInsetStyle : neumorphicStyle),
                color: activeItem === item.id ? 'var(--primary-color)' : 'var(--text-color)'
              }}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Theme Toggle */}
        <div className="flex justify-start pl-2">
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
      </div>
    </div>
  );
}