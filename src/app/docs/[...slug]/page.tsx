"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string[];
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/docs/${slug.join('/')}`);
        if (!response.ok) {
          throw new Error('Failed to load content');
        }
        const data = await response.json();
        setContent(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

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
        const isActive = slug.join('/') === item;
        return (
          <li key={index} style={{ marginLeft: `${level * 20}px` }}>
            <a
              href={path}
              className={`block py-2 px-4 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-500 text-white'
                  : 'hover:bg-opacity-10 hover:bg-blue-500'
              }`}
              style={{ color: isActive ? 'white' : 'var(--text-color)' }}
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

  // Custom components for ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={isDark ? oneDark : oneLight}
          language={match[1]}
          PreTag="div"
          className="rounded-lg my-4"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code
          className={`${className} bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono`}
          {...props}
        >
          {children}
        </code>
      );
    },
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 pb-2 border-b border-gray-200 dark:border-gray-700" style={{ color: 'var(--text-color)' }}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mb-4 mt-8" style={{ color: 'var(--text-color)' }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mb-3 mt-6" style={{ color: 'var(--text-color)' }}>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mb-2 mt-4" style={{ color: 'var(--text-color)' }}>
        {children}
      </h4>
    ),
    p: ({ children }: any) => (
      <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-color)' }}>
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="mb-4 ml-6 list-disc space-y-1" style={{ color: 'var(--text-color)' }}>
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1" style={{ color: 'var(--text-color)' }}>
        {children}
      </ol>
    ),
    li: ({ children }: any) => (
      <li className="leading-relaxed" style={{ color: 'var(--text-color)' }}>
        {children}
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote
        className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg"
        style={{ color: 'var(--text-color)' }}
      >
        {children}
      </blockquote>
    ),
    a: ({ children, href }: any) => (
      <a
        href={href}
        className="text-blue-600 dark:text-blue-400 hover:underline"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    img: ({ src, alt, ...props }: any) => (
      <img
        src={src?.startsWith('/docs/') ? `/kilocode-docs${src}` : src}
        alt={alt}
        className="max-w-full h-auto rounded-lg shadow-sm my-4"
        {...props}
      />
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table style={neumorphicStyle} className="min-w-full border-collapse">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 font-semibold text-left">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2">
        {children}
      </td>
    ),
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4">
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
          }
        `}</style>
        <div className="container mx-auto max-w-4xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-20 px-4">
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
          }
        `}</style>
        <div className="container mx-auto max-w-4xl">
          <div style={neumorphicStyle} className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Error Loading Documentation</h1>
            <p className="mb-4">{error}</p>
            <a href="/docs" className="text-blue-500 hover:underline">Back to Documentation</a>
          </div>
        </div>
      </div>
    );
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
            {/* Header */}
            <div className="mb-8">
              <a href="/docs" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Documentation</a>
              <h1 className="text-3xl font-bold" style={{color: 'var(--text-color)'}}>
                {slug.join(' / ').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h1>
            </div>

            {/* Content */}
            {loading ? (
              <div style={neumorphicStyle} className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Loading documentation...</p>
              </div>
            ) : error ? (
              <div style={neumorphicStyle} className="p-8 text-center">
                <h2 className="text-xl font-bold mb-4">Error Loading Documentation</h2>
                <p className="mb-4">{error}</p>
                <a href="/docs" className="text-blue-500 hover:underline">Back to Documentation</a>
              </div>
            ) : (
              <div style={neumorphicStyle} className="p-8 ml-4 max-w-6xl">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <ReactMarkdown components={components}>
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}