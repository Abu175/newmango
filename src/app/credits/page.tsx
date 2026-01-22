"use client";

import { Sidebar } from "../../components/Sidebar";

export default function Credits() {
  return (
    <main className="min-h-screen flex" style={{background: 'var(--bg-color)'}}>
      <Sidebar activeItem="credits" />
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-[var(--text-color)]">
            Credits
          </h1>

            <div className="space-y-8">
              {/* Current Balance */}
              <div
                className="rounded-lg p-6 text-center"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)'
                }}
              >
                <h2 className="text-2xl font-semibold mb-4" style={{color: 'var(--text-color)'}}>
                  Current Balance
                </h2>
                <div className="text-5xl font-bold mb-2" style={{color: 'var(--primary-color)'}}>
                  150 Credits
                </div>
                <p className="text-sm" style={{color: 'var(--text-color)', opacity: 0.8}}>
                  1 Credit = 1 API Call
                </p>
              </div>

              {/* Pricing Table */}
              <div
                className="rounded-lg p-6"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)'
                }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-center" style={{color: 'var(--text-color)'}}>
                  Purchase Credits
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div
                    className="rounded-lg p-6 text-center border-2"
                    style={{
                      background: 'var(--bg-color)',
                      borderColor: 'var(--primary-color)',
                      boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-color)'}}>
                      Starter
                    </h3>
                    <div className="text-3xl font-bold mb-2" style={{color: 'var(--primary-color)'}}>
                      $4.99
                    </div>
                    <p className="text-sm mb-4" style={{color: 'var(--text-color)', opacity: 0.8}}>
                      100 Credits
                    </p>
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium"
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>

                  <div
                    className="rounded-lg p-6 text-center border-2"
                    style={{
                      background: 'var(--bg-color)',
                      borderColor: 'var(--primary-color)',
                      boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-color)'}}>
                      Popular
                    </h3>
                    <div className="text-3xl font-bold mb-2" style={{color: 'var(--primary-color)'}}>
                      $19.99
                    </div>
                    <p className="text-sm mb-4" style={{color: 'var(--text-color)', opacity: 0.8}}>
                      500 Credits
                    </p>
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium"
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>

                  <div
                    className="rounded-lg p-6 text-center border-2"
                    style={{
                      background: 'var(--bg-color)',
                      borderColor: 'var(--primary-color)',
                      boxShadow: 'inset 4px 4px 8px var(--inset-shadow-color), inset -4px -4px 8px var(--inset-highlight-color)'
                    }}
                  >
                    <h3 className="text-xl font-semibold mb-2" style={{color: 'var(--text-color)'}}>
                      Pro
                    </h3>
                    <div className="text-3xl font-bold mb-2" style={{color: 'var(--primary-color)'}}>
                      $34.99
                    </div>
                    <p className="text-sm mb-4" style={{color: 'var(--text-color)', opacity: 0.8}}>
                      1000 Credits
                    </p>
                    <button
                      className="w-full py-2 px-4 rounded-lg font-medium"
                      style={{
                        background: 'var(--primary-color)',
                        color: 'white',
                        boxShadow: '6px 6px 12px var(--shadow-color), -6px -6px 12px var(--highlight-color)'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div
                className="rounded-lg p-6"
                style={{
                  background: 'var(--bg-color)',
                  boxShadow: '8px 8px 16px var(--shadow-color), -8px -8px 16px var(--highlight-color)'
                }}
              >
                <h2 className="text-2xl font-semibold mb-6" style={{color: 'var(--text-color)'}}>
                  Transaction History
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b" style={{borderColor: 'var(--shadow-color)'}}>
                    <div>
                      <p className="font-medium" style={{color: 'var(--text-color)'}}>
                        Purchased 100 Credits
                      </p>
                      <p className="text-sm" style={{color: 'var(--text-color)', opacity: 0.7}}>
                        Dec 15, 2024
                      </p>
                    </div>
                    <span className="font-semibold" style={{color: 'var(--primary-color)'}}>
                      +100
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b" style={{borderColor: 'var(--shadow-color)'}}>
                    <div>
                      <p className="font-medium" style={{color: 'var(--text-color)'}}>
                        API Usage
                      </p>
                      <p className="text-sm" style={{color: 'var(--text-color)', opacity: 0.7}}>
                        Dec 14, 2024
                      </p>
                    </div>
                    <span className="font-semibold" style={{color: 'red'}}>
                      -50
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}