'use client'
import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Trash2, AlertTriangle, ShieldCheck, Mail, HelpCircle } from 'lucide-react'

export default function DataDeletionPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem="settings" />

            <main className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto py-12 px-6">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Data Deletion Instructions</h1>
                        <p className="mt-4 text-lg text-gray-600">How to remove your data from Oneshort</p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-10">

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Our Commitment</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    We value your privacy and provide a simple way to delete any data we have collected through your connection with social media platforms like Facebook.
                                </p>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                                        <HelpCircle size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">How to Delete Your Data</h2>
                                </div>
                                <div className="space-y-4 text-gray-600">
                                    <p className="font-semibold">Option 1: Through App Settings (Recommended)</p>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Log in to your Oneshort account.</li>
                                        <li>Go to <strong>Settings</strong> → <strong>Connected Platforms</strong>.</li>
                                        <li>Find Facebook and click <strong>Disconnect</strong>.</li>
                                        <li>Follow the prompt to "Delete all cached data".</li>
                                    </ol>

                                    <p className="font-semibold mt-6">Option 2: Through Facebook Settings</p>
                                    <ol className="list-decimal list-inside space-y-2 ml-4">
                                        <li>Go to your Facebook Account's <strong>Settings & Privacy</strong> → <strong>Settings</strong>.</li>
                                        <li>Look for <strong>Apps and Websites</strong>.</li>
                                        <li>Search for <strong>Oneshort</strong> and click <strong>Remove</strong>.</li>
                                    </ol>
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                        <AlertTriangle size={20} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Requesting Manual Deletion</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-4">
                                    If you are unable to use the methods above, you can request manual data deletion by contacting our privacy team.
                                </p>
                                <div className="flex items-center gap-3 text-red-600 bg-red-50 p-4 rounded-xl">
                                    <Mail size={20} />
                                    <span className="font-bold">privacy@oneshort.com</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-4 italic">
                                    Note: We will process your request and delete your user data within 7 business days.
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
