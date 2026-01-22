'use client'
import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Shield, Lock, Eye, FileText, Globe, MessageSquare } from 'lucide-react'

export default function PrivacyPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem="settings" />

            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-12 px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl mb-4">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Privacy Policy</h1>
                        <p className="mt-4 text-lg text-gray-600">Last updated: January 21, 2026</p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-10">

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <Eye size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Introduction</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    Your privacy is important to us. This Privacy Policy explains how Oneshort collects, uses, and protects your information when you use our platform, including our integration with Facebook and other social media services.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Information We Collect</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    When you connect your Facebook account, we may collect the following information as permitted by your permissions:
                                </p>
                                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                                    <li>Basic Profile Information (Name, Profile Picture)</li>
                                    <li>Email Address</li>
                                    <li>List of Pages you manage (to enable posting)</li>
                                    <li>Content engagement metrics for your posts</li>
                                </ul>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                                        <Lock size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">How We Use Your Information</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    We use the information collected from Facebook solely to provide the services you request, such as scheduling and publishing content to your Facebook Pages. We do not sell your personal data to third parties.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                        <Globe size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Data Security</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    We implement industry-standard security measures to protect your access tokens and personal information. Your Facebook access tokens are encrypted and stored securely.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <MessageSquare size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                                    <br />
                                    <span className="font-semibold mt-2 block text-blue-600">privacy@oneshort.com</span>
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
