"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [heroPrompt, setHeroPrompt] = useState("");
  const [geminiPrompt, setGeminiPrompt] = useState("");
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = parseFloat(htmlEl.dataset.speed || '0');
        const yPos = -(scrollY * speed);
        htmlEl.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const callGeminiApi = async (prompt: string) => {
    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }
    setModalOpen(true);
    setModalLoading(true);
    setModalText("");

    const apiKey = ""; // API key will be automatically provided in the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();
      const candidate = result.candidates?.[0];

      if (candidate && candidate.content?.parts?.[0]?.text) {
        setModalText(candidate.content.parts[0].text);
      } else {
        throw new Error("Invalid response structure from API.");
      }
    } catch (error) {
      console.error("Gemini API call failed:", error);
      setModalText(`Error: ${(error as Error).message}. Please check the console for details.`);
    } finally {
      setModalLoading(false);
    }
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

  const neumorphicButtonPrimaryStyle = {
    background: 'var(--primary-color)',
    color: 'white',
    borderRadius: '10px',
    boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)',
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
    <div className="overflow-x-hidden">
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

        .neumorphic-button:active, .neumorphic-button-primary:active {
          box-shadow: inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color);
        }

        .parallax-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        section {
          position: relative;
          overflow: hidden;
        }

        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(5px);
          z-index: 99;
        }
        .modal-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 100;
          width: 90%;
          max-width: 600px;
        }
        .loading-spinner {
          border: 4px solid var(--highlight-color);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .hero-animate {
          animation: slideInUp 1s ease-out;
        }
        .hero-title-animate {
          animation: fadeInScale 1.2s ease-out 0.3s both;
        }
        .hero-subtitle-animate {
          animation: slideInUp 1s ease-out 0.6s both;
        }
        .hero-buttons-animate {
          animation: fadeInScale 1s ease-out 0.9s both;
        }
        .hero-chat-animate {
          animation: slideInUp 1s ease-out 1.2s both;
        }
        .floating-element {
          animation: float 6s ease-in-out infinite;
        }
        .pulse-glow {
          animation: pulse 3s ease-in-out infinite;
        }
        .gradient-animated {
          background: linear-gradient(-45deg, var(--primary-color), #667eea, #764ba2, var(--primary-color));
          background-size: 400% 400%;
          animation: gradient-shift 8s ease infinite;
        }
        .typing-animation {
          border-right: 2px solid var(--primary-color);
          animation: blink-caret 1s step-end infinite;
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: var(--primary-color); }
        }
        .code-float {
          animation: code-float 8s ease-in-out infinite;
        }
        @keyframes code-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(5deg); }
          50% { transform: translateY(-10px) rotate(-3deg); }
          75% { transform: translateY(-30px) rotate(2deg); }
        }
        .hero-stats {
          animation: fadeInScale 1s ease-out 1.5s both;
        }
        .code-editor {
          background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
          border-radius: 12px;
          border: 1px solid #404040;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          position: relative;
          overflow: hidden;
        }
        .code-editor::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(90deg, #ff5f56 0%, #ffbd2e 50%, #27ca3f 100%);
          border-radius: 12px 12px 0 0;
          z-index: 1;
        }
        .code-editor-header {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          font-size: 12px;
          font-weight: bold;
          z-index: 2;
        }
        .code-content {
          padding: 60px 20px 20px;
          color: #d4d4d4;
          font-size: 14px;
          line-height: 1.5;
        }
        .code-line {
          margin-bottom: 8px;
          position: relative;
        }
        .code-line::before {
          content: attr(data-line);
          position: absolute;
          left: -40px;
          color: #858585;
          font-size: 12px;
          width: 30px;
          text-align: right;
        }
        .cursor-blink {
          animation: cursor-blink 1s infinite;
        }
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .particle {
          position: absolute;
          background: var(--primary-color);
          border-radius: 50%;
          animation: particle-float 6s ease-in-out infinite;
        }
        .particle:nth-child(odd) {
          animation-delay: -2s;
        }
        .particle:nth-child(even) {
          animation-delay: -4s;
        }
        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0.3;
          }
        }
        .network-node {
          position: absolute;
          width: 8px;
          height: 8px;
          background: var(--primary-color);
          border-radius: 50%;
          animation: node-pulse 2s ease-in-out infinite;
        }
        .network-node:nth-child(1) { top: 20%; left: 10%; animation-delay: 0s; }
        .network-node:nth-child(2) { top: 30%; right: 15%; animation-delay: 0.5s; }
        .network-node:nth-child(3) { top: 60%; left: 20%; animation-delay: 1s; }
        .network-node:nth-child(4) { top: 70%; right: 10%; animation-delay: 1.5s; }
        @keyframes node-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.5); opacity: 0.4; }
        }
        .terminal {
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border-radius: 12px;
          border: 1px solid #404040;
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
          position: relative;
          overflow: hidden;
        }
        .terminal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 30px;
          background: #333;
          border-radius: 12px 12px 0 0;
        }
        .terminal-dots {
          position: absolute;
          top: 8px;
          left: 12px;
          display: flex;
          gap: 6px;
          z-index: 1;
        }
        .terminal-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .terminal-dot:nth-child(1) { background: #ff5f56; }
        .terminal-dot:nth-child(2) { background: #ffbd2e; }
        .terminal-dot:nth-child(3) { background: #27ca3f; }
        .terminal-content {
          padding: 50px 20px 20px;
          color: #00ff41;
          font-size: 14px;
          line-height: 1.4;
        }
        .terminal-line {
          margin-bottom: 4px;
        }
        .terminal-prompt {
          color: #00ff41;
        }
        .terminal-command {
          color: #ffffff;
        }
        .typing-text {
          animation: typing 3s steps(30, end) 1s both;
          white-space: nowrap;
          overflow: hidden;
          border-right: 2px solid #00ff41;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        .matrix-rain {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }
        .matrix-column {
          position: absolute;
          top: -100px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: var(--primary-color);
          opacity: 0.1;
          animation: matrix-fall linear infinite;
        }
        .matrix-column:nth-child(odd) {
          animation-delay: -2s;
        }
        .matrix-column:nth-child(even) {
          animation-delay: -4s;
        }
        @keyframes matrix-fall {
          0% { transform: translateY(-100px); opacity: 0; }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .neural-network {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        .neural-node {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary-color);
          border-radius: 50%;
          animation: neural-pulse 3s ease-in-out infinite;
        }
        .neural-node:nth-child(1) { top: 15%; left: 20%; animation-delay: 0s; }
        .neural-node:nth-child(2) { top: 25%; left: 70%; animation-delay: 0.5s; }
        .neural-node:nth-child(3) { top: 45%; left: 15%; animation-delay: 1s; }
        .neural-node:nth-child(4) { top: 35%; left: 85%; animation-delay: 1.5s; }
        .neural-node:nth-child(5) { top: 65%; left: 25%; animation-delay: 2s; }
        .neural-node:nth-child(6) { top: 55%; left: 75%; animation-delay: 2.5s; }
        .neural-node:nth-child(7) { top: 75%; left: 40%; animation-delay: 3s; }
        .neural-node:nth-child(8) { top: 85%; left: 60%; animation-delay: 3.5s; }
        @keyframes neural-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.5); opacity: 1; }
        }
        .neural-connection {
          position: absolute;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
          animation: connection-flow 4s ease-in-out infinite;
        }
        .neural-connection:nth-child(1) {
          top: 15%; left: 20%; width: 50%; transform: rotate(15deg);
          animation-delay: 0s;
        }
        .neural-connection:nth-child(2) {
          top: 25%; left: 70%; width: 35%; transform: rotate(-20deg);
          animation-delay: 1s;
        }
        .neural-connection:nth-child(3) {
          top: 45%; left: 15%; width: 60%; transform: rotate(25deg);
          animation-delay: 2s;
        }
        .neural-connection:nth-child(4) {
          top: 65%; left: 25%; width: 45%; transform: rotate(-15deg);
          animation-delay: 3s;
        }
        @keyframes connection-flow {
          0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
          50% { opacity: 0.8; transform: scaleX(1.2); }
        }
        .hologram {
          position: relative;
          background: linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(74, 144, 226, 0.05));
          border: 1px solid rgba(74, 144, 226, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow:
            0 0 20px rgba(74, 144, 226, 0.2),
            inset 0 0 20px rgba(74, 144, 226, 0.1);
        }
        .hologram::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, var(--primary-color), transparent, var(--primary-color));
          border-radius: 22px;
          z-index: -1;
          animation: hologram-glow 3s ease-in-out infinite;
        }
        @keyframes hologram-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .data-stream {
          position: absolute;
          width: 2px;
          height: 100px;
          background: linear-gradient(to bottom, transparent, var(--primary-color), transparent);
          animation: data-stream-flow 2s linear infinite;
        }
        .data-stream:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
        .data-stream:nth-child(2) { top: 20%; right: 15%; animation-delay: 0.5s; }
        .data-stream:nth-child(3) { top: 60%; left: 80%; animation-delay: 1s; }
        .data-stream:nth-child(4) { top: 70%; right: 20%; animation-delay: 1.5s; }
        @keyframes data-stream-flow {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
        .cyber-grid {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(74, 144, 226, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 144, 226, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-shift 20s linear infinite;
          opacity: 0.3;
        }
        @keyframes grid-shift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .floating-gears {
          position: absolute;
          animation: gear-rotate 10s linear infinite;
        }
        .floating-gears:nth-child(1) {
          top: 20%; right: 10%; font-size: 2rem; opacity: 0.1;
          animation-delay: 0s;
        }
        .floating-gears:nth-child(2) {
          top: 60%; left: 5%; font-size: 1.5rem; opacity: 0.15;
          animation-delay: 2s;
        }
        .floating-gears:nth-child(3) {
          bottom: 20%; right: 5%; font-size: 1.8rem; opacity: 0.1;
          animation-delay: 4s;
        }
        @keyframes gear-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>


      <main>
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center py-20 px-4 relative overflow-hidden" style={{background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(74, 144, 226, 0.03) 100%)'}}>
          {/* Cyber Grid Background */}
          <div className="cyber-grid"></div>

          {/* Matrix Rain Effect */}
          <div className="matrix-rain">
            {Array.from({length: 20}, (_, i) => (
              <div
                key={i}
                className="matrix-column"
                style={{
                  left: `${i * 5}%`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                {Array.from({length: 30}, (_, j) => (
                  <div key={j} style={{marginBottom: '2px'}}>
                    {String.fromCharCode(65 + Math.floor(Math.random() * 26))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Neural Network Visualization */}
          <div className="neural-network">
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-node"></div>
            <div className="neural-connection"></div>
            <div className="neural-connection"></div>
            <div className="neural-connection"></div>
            <div className="neural-connection"></div>
          </div>

          {/* Data Streams */}
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>
          <div className="data-stream"></div>

          {/* Floating Gears */}
          <div className="floating-gears">⚙️</div>
          <div className="floating-gears">🔧</div>
          <div className="floating-gears">⚙️</div>

          <div className="z-10 w-full max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Main Content */}
              <div className="text-center lg:text-left relative">
                <div className="hologram p-8 md:p-12">
                  <h2 className="text-5xl md:text-8xl font-extrabold leading-tight mb-6" style={{color: 'var(--text-color)'}}>
                    Neural<br />
                    <span style={{color: 'var(--primary-color)', textShadow: '0 0 20px var(--primary-color)'}}>
                      Code
                    </span><br />
                    Matrix
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl">
                    Enter the future of programming where AI neural networks write code through quantum connections.
                    Experience development at the speed of thought.
                  </p>

                  {/* Neural Stats */}
                  <div className="hero-stats grid grid-cols-3 gap-6 mb-10 max-w-lg mx-auto lg:mx-0">
                    <div style={neumorphicInsetStyle} className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 animate-pulse"></div>
                      <div className="text-3xl font-bold relative z-10" style={{color: 'var(--primary-color)'}}>∞</div>
                      <div className="text-sm opacity-80 relative z-10">Neural Links</div>
                    </div>
                    <div style={neumorphicInsetStyle} className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      <div className="text-3xl font-bold relative z-10" style={{color: 'var(--primary-color)'}}>99.9%</div>
                      <div className="text-sm opacity-80 relative z-10">Synapse Accuracy</div>
                    </div>
                    <div style={neumorphicInsetStyle} className="p-6 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="text-3xl font-bold relative z-10" style={{color: 'var(--primary-color)'}}>0.001s</div>
                      <div className="text-sm opacity-80 relative z-10">Quantum Response</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <a href="/dashboard" style={neumorphicButtonPrimaryStyle} className="text-white font-bold py-4 px-10 rounded-xl text-xl transform hover:scale-110 transition-all duration-300 w-full sm:w-auto shadow-2xl hover:shadow-blue-500/25">
                      🚀 Enter Matrix
                    </a>
                    <a href="#features" style={neumorphicButtonStyle} className="font-bold py-4 px-10 rounded-xl text-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                      Explore Neural Net
                    </a>
                    <a href="/sign-in-to-editor" style={neumorphicButtonStyle} className="font-bold py-4 px-10 rounded-xl text-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                      Login
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - Interactive Neural Interface */}
              <div className="relative">
                <div className="hologram p-8 transform hover:scale-105 transition-all duration-500">
                  <div className="flex items-center justify-center mb-6">
                    <div style={neumorphicInsetStyle} className="w-16 h-16 rounded-full flex items-center justify-center mr-4 relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-spin opacity-20"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                        <path d="M12 21c0-1-1-3-3-3s-3 2-3 3 1 3 3 3 3-2 3-3"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Neural Code Generator</h3>
                  </div>

                  {/* Neural Command Interface */}
                  <div style={neumorphicInsetStyle} className="p-6 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                    <div className="space-y-4 relative z-10">
                      <div className="flex items-start space-x-3">
                        <div style={neumorphicStyle} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-blue-400">AI</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm opacity-80">Neural network initialized. Ready for quantum code generation.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div style={neumorphicStyle} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-green-400">You</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">Build a neural network for image recognition</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div style={neumorphicStyle} className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                          <span className="text-sm font-bold text-purple-400">NN</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm opacity-80">Generating quantum-accelerated neural network architecture...</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Neural Input Terminal */}
                  <div className="relative">
                    <div className="flex items-center gap-4 p-4 rounded-xl" style={{background: 'rgba(74, 144, 226, 0.1)', border: '1px solid rgba(74, 144, 226, 0.3)'}}>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                      </div>
                      <input
                        type="text"
                        className="flex-1 bg-transparent outline-none text-lg placeholder-gray-400"
                        placeholder="Describe your neural architecture..."
                        value={heroPrompt}
                        onChange={(e) => setHeroPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && callGeminiApi(heroPrompt)}
                      />
                      <button onClick={() => callGeminiApi(heroPrompt)} style={neumorphicButtonPrimaryStyle} className="font-bold py-2 px-6 rounded-lg whitespace-nowrap transform hover:scale-105 transition-all">
                        ⚡ Generate
                      </button>
                    </div>

                    {/* Neural Activity Indicator */}
                    <div className="mt-4 flex justify-center space-x-1">
                      {Array.from({length: 8}, (_, i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full animate-pulse"
                          style={{
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '1.5s'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quantum Field Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl animate-pulse -z-10"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-4">
          <div className="parallax-bg" data-speed="0.3" style={{background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: 0.05, top: '20%', left: '-30%'}}></div>
          <div className="parallax-bg" data-speed="0.2" style={{background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 60%)', opacity: 0.05, top: '60%', right: '-40%', left: 'auto'}}></div>
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need, All in One Place</h3>
            <p className="max-w-2xl mx-auto mb-16">Codilore is packed with features designed to boost productivity and streamline your development process.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div style={neumorphicStyle} className="p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                <div style={neumorphicInsetStyle} className="w-16 h-16 inline-flex items-center justify-center rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3">Live Collaboration</h4>
                <p>Code together in real-time with shared terminals, debugging sessions, and live editing.</p>
              </div>
              <div style={neumorphicStyle} className="p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                <div style={neumorphicInsetStyle} className="w-16 h-16 inline-flex items-center justify-center rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8V4H8"></path>
                    <polyline points="6 2 12 8 18 2"></polyline>
                    <path d="M12 16v4h4"></path>
                    <polyline points="18 22 12 16 6 22"></polyline>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3">AI-Powered Snippets</h4>
                <p>Generate boilerplate code, write documentation, and refactor complex functions with our integrated AI assistant.</p>
              </div>
              <div style={neumorphicStyle} className="p-8 text-left transform hover:-translate-y-2 transition-transform duration-300">
                <div style={neumorphicInsetStyle} className="w-16 h-16 inline-flex items-center justify-center rounded-full mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h4 className="text-2xl font-bold mb-3">Integrated Task Management</h4>
                <p>Connect your Jira, Trello, or GitHub issues and track progress without leaving the IDE.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Powered by Gemini Section */}
        <section id="gemini-ai" className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Supercharged with Gemini AI</h3>
            <p className="max-w-2xl mx-auto mb-16">Leverage the power of Google's Gemini model to generate, explain, and debug code at the speed of thought.</p>
            <div style={neumorphicStyle} className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-left">
                  <h4 className="text-2xl font-bold mb-4">Your AI Co-pilot</h4>
                  <p className="mb-2"><strong>Code Generation:</strong> From single functions to entire classes, generate high-quality code from natural language prompts.</p>
                  <p className="mb-2"><strong>Code Explanation:</strong> Understand complex code instantly. Select any block of code and ask Codilore to explain it in plain English.</p>
                  <p className="mb-2"><strong>Automated Debugging:</strong> Find and fix bugs faster. Codilore analyzes your code, identifies potential issues, and suggests fixes.</p>
                </div>
                <div style={neumorphicInsetStyle} className="p-4 space-y-4">
                  <textarea
                    rows={4}
                    className="w-full bg-transparent p-3 outline-none resize-none"
                    placeholder="Enter a code-related prompt..."
                    value={geminiPrompt}
                    onChange={(e) => setGeminiPrompt(e.target.value)}
                  ></textarea>
                  <button onClick={() => callGeminiApi(geminiPrompt)} style={neumorphicButtonPrimaryStyle} className="w-full font-bold py-3 px-6 rounded-lg">
                    Ask Gemini
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Voice Conversion Section */}
        <section id="voice-conversion" className="py-24 px-4 relative overflow-hidden">
          <div className="parallax-bg" data-speed="0.2" style={{background: 'linear-gradient(135deg, var(--primary-color) 0%, rgba(74, 144, 226, 0.8) 100%)', opacity: 0.1, top: 0, left: 0, width: '100%', height: '100%'}}></div>
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div style={neumorphicStyle} className="rounded-3xl p-12 md:p-16 relative overflow-hidden transform hover:scale-105 transition-transform duration-500">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-10">
                  <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Voice Technology Background" className="w-full h-full object-cover" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div style={neumorphicInsetStyle} className="w-24 h-24 mx-auto mb-8 flex items-center justify-center rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                  </div>

                  <h3 className="text-4xl md:text-6xl font-extrabold mb-6" style={{color: 'var(--text-color)'}}>
                    Start Developing Without <span style={{color: 'var(--primary-color)'}}>Touching</span> Your Keyboard
                  </h3>

                  <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90">
                    Code with your voice. Debug with commands. Build faster than ever with natural language programming.
                    No more typing fatigue, no more repetitive keystrokes - just pure, efficient development.
                  </p>

                  <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div style={neumorphicInsetStyle} className="p-6 rounded-xl text-center">
                      <div style={neumorphicStyle} className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Voice Commands</h4>
                      <p className="text-sm opacity-80">Execute complex operations with simple voice instructions</p>
                    </div>

                    <div style={neumorphicInsetStyle} className="p-6 rounded-xl text-center">
                      <div style={neumorphicStyle} className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Smart Refactoring</h4>
                      <p className="text-sm opacity-80">Tell Codilore what to change and watch it happen instantly</p>
                    </div>

                    <div style={neumorphicInsetStyle} className="p-6 rounded-xl text-center">
                      <div style={neumorphicStyle} className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polygon points="10,8 16,12 10,16 10,8"></polygon>
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold mb-2">Real-time Preview</h4>
                      <p className="text-sm opacity-80">See your voice commands executed instantly as you speak</p>
                    </div>
                  </div>

                  {/* Interactive Voice Demo */}
                  <div style={neumorphicInsetStyle} className="p-8 rounded-2xl max-w-2xl mx-auto">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div style={neumorphicStyle} className="w-12 h-12 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                          <line x1="12" y1="19" x2="12" y2="23"></line>
                          <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                      </div>
                      <input type="text" className="flex-1 bg-transparent p-4 outline-none text-center" placeholder="Try: 'Create a React component for a todo list'" />
                      <button style={neumorphicButtonPrimaryStyle} className="px-6 py-3 rounded-lg font-bold">
                        Speak Command
                      </button>
                    </div>
                    <p className="text-sm opacity-70 text-center">Try voice commands like "generate function", "refactor code", or "add comments"</p>
                  </div>

                  <div className="flex justify-center mt-12">
                    <a href="#" style={neumorphicButtonPrimaryStyle} className="text-white font-bold py-4 px-12 rounded-xl text-xl transform hover:scale-105 transition-transform inline-block">
                      Try Voice Development
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Extension Workflow Section */}
        <section id="workflow" className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-16">A Seamless Developer Workflow</h3>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-1 border-t-2 border-dashed opacity-30" style={{borderColor: 'var(--text-color)'}}></div>
              <div className="relative z-10 text-center">
                <div style={neumorphicStyle} className="w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                  </svg>
                </div>
                <h4 className="text-lg font-bold">1. Select Code</h4>
                <p className="text-sm">Highlight any code snippet in your editor.</p>
              </div>
              <div className="relative z-10 text-center">
                <div style={neumorphicStyle} className="w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20z"></path>
                    <path d="M12 12l4 4"></path>
                    <path d="M12 8v4h4"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-bold">2. Choose Action</h4>
                <p className="text-sm">Right-click to access Codilore's AI actions.</p>
              </div>
              <div className="relative z-10 text-center">
                <div style={neumorphicStyle} className="w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 16v4h4"></path>
                    <polyline points="18 22 12 16 6 22"></polyline>
                    <path d="M12 8V4H8"></path>
                    <polyline points="6 2 12 8 18 2"></polyline>
                  </svg>
                </div>
                <h4 className="text-lg font-bold">3. Get Assistance</h4>
                <p className="text-sm">Receive instant code generations or explanations.</p>
              </div>
              <div className="relative z-10 text-center">
                <div style={neumorphicStyle} className="w-24 h-24 mx-auto flex items-center justify-center rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="text-lg font-bold">4. Integrate & Commit</h4>
                <p className="text-sm">Apply the changes and commit your work seamlessly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section id="integrations" className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Works With Your Favorite Tools</h3>
            <p className="max-w-2xl mx-auto mb-16">Codilore seamlessly integrates with the services you already use and love.</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              <div style={neumorphicStyle} className="p-4 rounded-full w-24 h-24 flex items-center justify-center">
                <img src="https://placehold.co/64x64/e0e5ec/5a6472?text=GitHub" alt="GitHub Logo" className="w-16 h-16 opacity-70" />
              </div>
              <div style={neumorphicStyle} className="p-4 rounded-full w-24 h-24 flex items-center justify-center">
                <img src="https://placehold.co/64x64/e0e5ec/5a6472?text=Jira" alt="Jira Logo" className="w-16 h-16 opacity-70" />
              </div>
              <div style={neumorphicStyle} className="p-4 rounded-full w-24 h-24 flex items-center justify-center">
                <img src="https://placehold.co/64x64/e0e5ec/5a6472?text=Slack" alt="Slack Logo" className="w-16 h-16 opacity-70" />
              </div>
              <div style={neumorphicStyle} className="p-4 rounded-full w-24 h-24 flex items-center justify-center">
                <img src="https://placehold.co/64x64/e0e5ec/5a6472?text=Trello" alt="Trello Logo" className="w-16 h-16 opacity-70" />
              </div>
              <div style={neumorphicStyle} className="p-4 rounded-full w-24 h-24 flex items-center justify-center">
                <img src="https://placehold.co/64x64/e0e5ec/5a6472?text=GitLab" alt="GitLab Logo" className="w-16 h-16 opacity-70" />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-4">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Loved by Developers Worldwide</h3>
            <p className="max-w-2xl mx-auto mb-16">Don't just take our word for it. Here's what our users have to say.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <div style={neumorphicStyle} className="p-8">
                <div style={neumorphicInsetStyle} className="p-4">
                  <p className="italic mb-6">"Codilore's Gemini integration is like having a senior dev pair programming with me 24/7. It's incredibly powerful."</p>
                  <div className="flex items-center justify-center">
                    <img src="https://placehold.co/50x50/e0e5ec/5a6472?text=S" style={neumorphicStyle} className="w-12 h-12 rounded-full mr-4 p-1" alt="User Avatar" />
                    <div>
                      <p className="font-bold">Sarah D.</p>
                      <p className="text-sm">Lead Engineer, TechCorp</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={neumorphicStyle} className="p-8">
                <div style={neumorphicInsetStyle} className="p-4">
                  <p className="italic mb-6">"The AI assistant is surprisingly smart. It saves me at least an hour a day on repetitive tasks. I can't imagine coding without it now."</p>
                  <div className="flex items-center justify-center">
                    <img src="https://placehold.co/50x50/e0e5ec/5a6472?text=M" style={neumorphicStyle} className="w-12 h-12 rounded-full mr-4 p-1" alt="User Avatar" />
                    <div>
                      <p className="font-bold">Mike L.</p>
                      <p className="text-sm">Freelance Developer</p>
                    </div>
                  </div>
                </div>
              </div>
              <div style={neumorphicStyle} className="p-8">
                <div style={neumorphicInsetStyle} className="p-4">
                  <p className="italic mb-6">"Finally, an extension that gets it right. Beautiful UI, powerful features, and it doesn't slow down my editor. Highly recommended!"</p>
                  <div className="flex items-center justify-center">
                    <img src="https://placehold.co/50x50/e0e5ec/5a6472?text=J" style={neumorphicStyle} className="w-12 h-12 rounded-full mr-4 p-1" alt="User Avatar" />
                    <div>
                      <p className="font-bold">Jessica Y.</p>
                      <p className="text-sm">Senior Frontend Dev, Innovate LLC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by Section */}
        <section id="trusted-by" className="py-24 px-4">
          <div className="parallax-bg" data-speed="0.1" style={{background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 70%)', opacity: 0.05, top: '30%', left: '-20%'}}></div>
          <div className="parallax-bg" data-speed="0.15" style={{background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 60%)', opacity: 0.05, top: '70%', right: '-25%', left: 'auto'}}></div>
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Companies</h3>
            <p className="max-w-2xl mx-auto mb-16">Join thousands of developers and teams who trust Codilore to enhance their development workflow</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-5xl mx-auto">
              {[
                'Google', 'Microsoft', 'Amazon', 'Meta', 'Netflix', 'Apple',
                'Stripe', 'Airbnb', 'Uber', 'Spotify', 'Slack', 'Zoom',
                'MIT', 'Stanford', 'Harvard', 'Berkeley', 'CMU', 'Caltech'
              ].map((company, index) => (
                <div key={index} style={neumorphicStyle} className="p-6 rounded-xl flex items-center justify-center transform hover:-translate-y-1 transition-transform duration-300">
                  <img src={`https://placehold.co/120x40/e0e5ec/5a6472?text=${company}`} alt={company} className="w-full h-8 object-contain opacity-70" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-4">
          <div className="parallax-bg" data-speed="-0.2" style={{background: 'radial-gradient(circle, var(--primary-color) 0%, transparent 80%)', opacity: 0.05, top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}></div>
          <div className="container mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h3>
            <p className="max-w-2xl mx-auto mb-16">Start for free and scale up as your team grows. Simple, transparent pricing.</p>
            <div className="flex flex-wrap justify-center gap-10">
              <div style={neumorphicStyle} className="p-8 w-full max-w-sm transform hover:scale-105 transition-transform duration-300">
                <h4 className="text-2xl font-bold mb-2">Hobby</h4>
                <p className="text-5xl font-extrabold mb-4">$0<span className="text-lg font-medium">/mo</span></p>
                <ul className="text-left space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Basic AI Assistance
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    2 collaborators per session
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Community Support
                  </li>
                </ul>
                <a href="#" style={neumorphicButtonStyle} className="font-bold py-3 px-8 w-full block text-center">Get Started</a>
              </div>
              <div style={neumorphicStyle} className="p-1 relative w-full max-w-sm transform scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-sm font-bold px-4 py-1 rounded-full" style={neumorphicButtonPrimaryStyle}>MOST POPULAR</div>
                <div style={neumorphicStyle} className="h-full p-8">
                  <h4 className="text-2xl font-bold mb-2" style={{color: 'var(--primary-color)'}}>Pro</h4>
                  <p className="text-5xl font-extrabold mb-4">$12<span className="text-lg font-medium">/user/mo</span></p>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Advanced Gemini AI
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Unlimited collaborators
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Task Management Integrations
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Priority Support
                    </li>
                  </ul>
                  <a href="#" style={neumorphicButtonPrimaryStyle} className="font-bold py-3 px-8 w-full block text-center">Start Pro Trial</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-4">
          <div className="container mx-auto max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <details style={neumorphicStyle} className="p-6 rounded-lg group">
                <summary className="flex justify-between items-center font-bold cursor-pointer">
                  Is Codilore free to use?
                  <span className="transform transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p style={neumorphicInsetStyle} className="mt-4 p-4">
                  Yes! Codilore has a generous free Hobby plan with all the core features you need to get started. For advanced features and team collaboration, you can upgrade to our Pro plan.
                </p>
              </details>
              <details style={neumorphicStyle} className="p-6 rounded-lg group">
                <summary className="flex justify-between items-center font-bold cursor-pointer">
                  What languages does the AI support?
                  <span className="transform transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p style={neumorphicInsetStyle} className="mt-4 p-4">
                  Our AI assistant supports over 20 programming languages, including JavaScript, Python, Java, C++, Go, Rust, and more. We are constantly adding support for new languages.
                </p>
              </details>
              <details style={neumorphicStyle} className="p-6 rounded-lg group">
                <summary className="flex justify-between items-center font-bold cursor-pointer">
                  Is my code secure when using AI features?
                  <span className="transform transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p style={neumorphicInsetStyle} className="mt-4 p-4">
                  We take your privacy and security seriously. Your code is sent to the Gemini API for processing but is not stored or used for training. All communication is encrypted via HTTPS.
                </p>
              </details>
              <details style={neumorphicStyle} className="p-6 rounded-lg group">
                <summary className="flex justify-between items-center font-bold cursor-pointer">
                  Does it work with VS Code on the web?
                  <span className="transform transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p style={neumorphicInsetStyle} className="mt-4 p-4">
                  Absolutely. Codilore is fully compatible with the desktop version of VS Code as well as web-based environments like GitHub Codespaces and vscode.dev.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Community Section */}
        <section id="community" className="py-24 px-4">
          <div className="container mx-auto">
            <div style={neumorphicStyle} className="p-12 text-center max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Join Our Thriving Developer Community</h3>
              <p className="max-w-2xl mx-auto mb-8">Connect with other Codilore users, share tips, and get help from our team. We're active on Discord, GitHub, and more.</p>
              <a href="#" style={neumorphicButtonPrimaryStyle} className="text-white font-bold py-4 px-10 rounded-lg text-xl transform hover:scale-105 transition-transform inline-block">
                Join on Discord
              </a>
        </div>
      </div>
        </section>
    </main>

      {/* Footer */}
      <footer className="pt-12 pb-8 px-4">
        <div style={neumorphicInsetStyle} className="container mx-auto p-8 text-center">
          <div className="flex justify-center items-center space-x-3 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--primary-color)'}}>
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <h4 className="text-xl font-bold">Codilore</h4>
          </div>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="#" style={neumorphicButtonStyle} className="p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a href="#" style={neumorphicButtonStyle} className="p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="#" style={neumorphicButtonStyle} className="p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
          <p className="text-sm">&copy; 2024 Codilore. All rights reserved. Built for developers, by developers.</p>
        </div>
      </footer>

      {/* Gemini AI Response Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-container">
            <div style={neumorphicStyle} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold">Gemini AI Response</h4>
                <button onClick={() => setModalOpen(false)} style={neumorphicButtonStyle} className="p-2 rounded-full w-10 h-10 flex items-center justify-center">&times;</button>
              </div>
              <div style={neumorphicInsetStyle} className="p-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
                {modalLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap">{modalText}</pre>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
