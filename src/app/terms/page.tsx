'use client'
import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { FileCheck, ShieldAlert, Scale, CheckSquare, Info } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem="settings" />

            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-12 px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl mb-4">
                            <Scale size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Terms of Service</h1>
                        <p className="mt-4 text-lg text-gray-600">Last updated: January 21, 2026</p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-10">

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Info size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">1. Acceptance of Terms</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    By accessing or using Oneshort, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <CheckSquare size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">2. Use of Services</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    You are responsible for all content posted through your account. You agree not to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                    <li>Post content that violates social media platform policies</li>
                                    <li>Engage in any illegal activities or spam</li>
                                    <li>Attempt to circumvent our security measures</li>
                                </ul>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <FileCheck size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">3. Third-Party Integrations</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Our platform integrates with Facebook, Instagram, and other third-party services. Your use of these integrations is also subject to their respective terms and conditions. We are not responsible for the actions or policies of these third-party platforms.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">4. Limitation of Liability</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Oneshort provides its services "as is" and "as available". We do not guarantee that the service will be uninterrupted or error-free. In no event shall we be liable for any direct, indirect, incidental, or consequential damages.
                                </p>
                            </section>

                        </div>
                    </div>

                    <div className="mt-12 text-center text-gray-400 text-sm">
                        &copy; 2026 Oneshort. All rights reserved.
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    )
}
