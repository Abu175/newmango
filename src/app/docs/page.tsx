"use client";

import { useState, useEffect } from "react";

const docsStructure = [
  {
    label: "Getting Started",
    items: [
      "getting-started/installing",
      "getting-started/concepts",
      "getting-started/setting-up",
      "getting-started/your-first-task",
    ],
  },
  {
    label: "Using Kilo Code",
    items: [
      "basic-usage/the-chat-interface",
      "basic-usage/model-selection-guide",
      "basic-usage/using-modes",
      "basic-usage/autocomplete",
      "basic-usage/context-mentions",
      {
        label: "Basic Features",
        items: [
          "basic-usage/orchestrator-mode",
          "basic-usage/task-todo-list",
          "basic-usage/git-commit-generation",
          "features/browser-use",
          "features/code-actions",
          "features/system-notifications",
          "features/more-features",
        ],
      },
      {
        label: "AI Model Providers",
        items: [
          "basic-usage/connecting-providers",
          "getting-started/connecting-api-provider",
          "features/api-configuration-profiles",
          "providers/kilocode",
          {
            label: "Other Providers",
            items: [
              "providers/anthropic",
              "providers/bedrock",
              "providers/chutes-ai",
              "providers/claude-code",
              "providers/deepseek",
              "providers/fireworks",
              "providers/vertex",
              "providers/glama",
              "providers/gemini",
              "providers/groq",
              "providers/human-relay",
              "providers/lmstudio",
              "providers/mistral",
              "providers/ollama",
              "providers/openai",
              "providers/openai-compatible",
              "providers/openrouter",
              "providers/requesty",
              "providers/unbound",
              "providers/v0",
              "providers/vercel-ai-gateway",
              "providers/virtual-quota-fallback",
              "providers/vscode-lm",
              "providers/xai",
            ],
          },
        ],
      },
      "basic-usage/adding-tokens",
    ],
  },
  {
    label: "Core Concepts",
    items: [
      "features/auto-approving-actions",
      "features/suggested-responses",
      "basic-usage/how-tools-work",
      "features/enhance-prompt",
      "features/checkpoints",
      "tips-and-tricks",
    ],
  },
  {
    label: "Kilo for Teams",
    items: [
      "teams/getting-started",
      "teams/roles-permissions",
      "teams/dashboard",
      "teams/team-management",
      "teams/billing",
      "teams/analytics",
      "teams/migration",
    ],
  },
  {
    label: "Advanced Usage",
    items: [
      "advanced-usage/prompt-engineering",
      {
        label: "Customizing Kilo Code",
        items: [
          "advanced-usage/custom-rules",
          "advanced-usage/custom-instructions",
          "features/slash-commands/workflows",
        ],
      },
      {
        label: "Advanced Context Features",
        items: [
          "advanced-usage/memory-bank",
          "features/codebase-indexing",
          "advanced-usage/large-projects",
        ],
      },
      {
        label: "Advanced AI Features",
        items: [
          "features/fast-edits",
          "features/model-temperature",
          "advanced-usage/rate-limits-costs",
          "advanced-usage/free-and-budget-models",
          "features/footgun-prompting",
        ],
      },
      "features/experimental/experimental-features",
    ],
  },
  {
    label: "Customization",
    items: ["features/settings-management", "features/custom-modes"],
  },
  {
    label: "Extending Kilo Code",
    items: [
      "advanced-usage/local-models",
      {
        label: "Model Context Protocol (MCP)",
        items: [
          "features/mcp/overview",
          "features/mcp/using-mcp-in-kilo-code",
          "features/mcp/what-is-mcp",
          "features/mcp/server-transports",
          "features/mcp/mcp-vs-api",
        ],
      },
      "features/shell-integration",
      "extending/contributing-to-kilo",
      "extending/development-environment",
    ],
  },
  {
    label: "Tools Reference",
    items: [
      "features/tools/tool-use-overview",
      "features/tools/access-mcp-resource",
      "features/tools/apply-diff",
      "features/tools/ask-followup-question",
      "features/tools/attempt-completion",
      "features/tools/browser-action",
      "features/tools/execute-command",
      "features/tools/list-code-definition-names",
      "features/tools/list-files",
      "features/tools/new-task",
      "features/tools/read-file",
      "features/tools/search-files",
      "features/tools/switch-mode",
      "features/tools/update-todo-list",
      "features/tools/use-mcp-tool",
      "features/tools/write-to-file",
    ],
  },
];

export default function Docs() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    setIsDark(theme === 'dark');
    document.body.classList.toggle('dark-theme', theme === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.body.classList.toggle('dark-theme', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const toggleSection = (sectionLabel: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionLabel)) {
      newExpanded.delete(sectionLabel);
    } else {
      newExpanded.add(sectionLabel);
    }
    setExpandedSections(newExpanded);
  };

  const renderItems = (items: any[], level = 0) => {
    return items.map((item, index) => {
      if (typeof item === 'string') {
        const path = `/docs/${item}`;
        const title = item.split('/').pop()?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return (
          <li key={index} style={{ marginLeft: `${level * 20}px` }}>
            <a
              href={path}
              className="block py-2 px-4 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-colors"
              style={{ color: 'var(--text-color)' }}
            >
              {title}
            </a>
          </li>
        );
      } else {
        const isExpanded = expandedSections.has(item.label);
        return (
          <li key={index} style={{ marginLeft: `${level * 20}px` }}>
            <button
              onClick={() => toggleSection(item.label)}
              className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-colors text-left"
              style={{ color: 'var(--text-color)' }}
            >
              <svg
                className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="font-semibold">{item.label}</span>
            </button>
            {isExpanded && (
              <ul className="mt-2 space-y-1">
                {renderItems(item.items, level + 1)}
              </ul>
            )}
          </li>
        );
      }
    });
  };

  const neumorphicStyle = {
    background: 'var(--bg-color)',
    borderRadius: '20px',
    boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)',
    transition: 'box-shadow 0.3s ease',
  };

  const neumorphicInsetStyle = {
    background: 'var(--bg-color)',
    borderRadius: '12px',
    boxShadow: 'inset 5px 5px 10px var(--inset-shadow-color), inset -5px -5px 10px var(--inset-highlight-color)',
  };

  const neumorphicButtonStyle = {
    background: 'var(--bg-color)',
    border: '1px solid transparent',
    color: 'var(--text-color)',
    borderRadius: '10px',
    boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)',
    transition: 'all 0.2s ease-in-out',
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen pt-0 pb-20 px-0">
      <style jsx>{`
        :root {
          --bg-color: #e0e5ec;
          --text-color: #5a6472;
          --primary-color: #4a90e2;
          --highlight-color: #ffffff;
          --shadow-color: #a3b1c6;
          --inset-highlight-color: rgba(255, 255, 255, 0.7);
          --inset-shadow-color: rgba(163, 177, 198, 0.6);
          --font-family: 'Inter', sans-serif;
        }

        .dark-theme {
          --bg-color: #25282c;
          --text-color: #b0b8c4;
          --primary-color: #58a6ff;
          --highlight-color: #30343a;
          --shadow-color: #1c1f23;
          --inset-highlight-color: rgba(74, 85, 104, 0.4);
          --inset-shadow-color: rgba(28, 31, 35, 0.8);
        }

        body {
          background-color: var(--bg-color);
          color: var(--text-color);
          font-family: var(--font-family);
          transition: background-color 0.3s ease, color 0.3s ease;
        }

        .neumorphic:hover {
          box-shadow: 4px 4px 8px var(--shadow-color), -4px -4px 8px var(--highlight-color);
        }

        .neumorphic-button:hover {
          box-shadow: 4px 4px 8px var(--shadow-color), -4px -4px 8px var(--highlight-color);
          color: var(--primary-color);
        }
      `}</style>

      <div className="max-w-7xl pl-72">
        <div className="gap-8">
          {/* Sidebar Navigation */}
          <div className="fixed left-0 top-0 h-screen w-72">
            <div style={neumorphicStyle} className="p-6 h-full flex flex-col">
              <h2 className="text-xl font-bold mb-4">Documentation</h2>
              <nav className="flex-1 overflow-y-auto pr-2">
                <ul className="space-y-2">
                  <li>
                    <a
                      href="/docs/index"
                      className="block py-2 px-4 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-colors font-semibold"
                      style={{ color: 'var(--text-color)' }}
                    >
                      Introduction
                    </a>
                  </li>
                  {docsStructure.map((section, index) => (
                    <li key={index}>
                      <button
                        onClick={() => toggleSection(section.label)}
                        className="flex items-center w-full py-2 px-4 rounded-lg hover:bg-opacity-10 hover:bg-blue-500 transition-colors text-left"
                        style={{ color: 'var(--text-color)' }}
                      >
                        <svg
                          className={`w-4 h-4 mr-2 transition-transform ${expandedSections.has(section.label) ? 'rotate-90' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-semibold">{section.label}</span>
                      </button>
                      {expandedSections.has(section.label) && (
                        <ul className="mt-2 space-y-1 ml-6">
                          {renderItems(section.items, 0)}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="">
            {/* Header moved into main content to allow sidebar to start at page top */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6" style={{color: 'var(--text-color)'}}>
                Kilo Code Documentation
              </h1>
              <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                Complete documentation for Kilo Code - your AI-powered coding assistant.
              </p>
            </div>
            <div style={neumorphicStyle} className="p-8 ml-4 max-w-6xl">
              <h2 className="text-2xl font-bold mb-6">Welcome to Kilo Code Documentation</h2>
              <p className="mb-4">
                Kilo Code is a powerful AI-assisted coding tool that enhances your development workflow with intelligent code generation, debugging, and collaboration features.
              </p>
              <p className="mb-4">
                Our comprehensive documentation covers everything from basic setup to advanced customization options. Whether you're a beginner or an experienced developer, you'll find the resources you need to make the most of Kilo Code.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div>
                  <h3 className="text-xl font-bold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    <li>• AI-powered code generation and explanation</li>
                    <li>• Multi-mode interface for different tasks</li>
                    <li>• Real-time collaboration</li>
                    <li>• Customizable instructions and rules</li>
                    <li>• Integration with popular tools and platforms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Supported Languages</h3>
                  <ul className="space-y-2">
                    <li>• JavaScript/TypeScript</li>
                    <li>• Python</li>
                    <li>• Java</li>
                    <li>• C/C++</li>
                    <li>• Go, Rust, and many more</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Quick Start</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <a href="/docs/getting-started/installing" style={neumorphicInsetStyle} className="p-4 block text-center hover:scale-105 transition-transform">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="font-semibold">Install</div>
                    </a>
                    <a href="/docs/getting-started/setting-up" style={neumorphicInsetStyle} className="p-4 block text-center hover:scale-105 transition-transform">
                      <div className="text-2xl mb-2">⚙️</div>
                      <div className="font-semibold">Setup</div>
                    </a>
                    <a href="/docs/getting-started/your-first-task" style={neumorphicInsetStyle} className="p-4 block text-center hover:scale-105 transition-transform">
                      <div className="text-2xl mb-2">🚀</div>
                      <div className="font-semibold">Get Started</div>
                    </a>
                  </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center mt-8">
              <a href="/kilocode-docs" style={neumorphicButtonStyle} className="inline-block font-bold py-4 px-10 rounded-xl text-xl transform hover:scale-105 transition-all duration-300 neumorphic-button">
                Open Full Documentation Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}