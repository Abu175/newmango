'use client'
import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import PlatformOverlay from './components/platform-overlay'
import {
    Bell, Search, Plus, Image as ImageIcon, Heart, MessageCircle, Share2,
    MoreHorizontal, ThumbsUp, MessageSquare, Repeat, Send, Bookmark,
    Globe, Upload, Link as LinkIcon, X, Music, Share, ArrowUp, ArrowDown,
    Pin, Camera, ChevronRight, ExternalLink
} from 'lucide-react'

export default function PlaygroundPage() {
    const [content, setContent] = useState({
        text: "Just launched our new feature! 🚀 #tech #innovation #coding",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        authorName: "John Doe",
        authorHandle: "johndoe",
        date: "2 hours ago"
    })

    const [scheduledDates, setScheduledDates] = useState<string[]>([])
    const [tempDate, setTempDate] = useState('')
    const [showOverlay, setShowOverlay] = useState(false)
    const [isPosting, setIsPosting] = useState(false);
    const [postResult, setPostResult] = useState<{ success: boolean; message: string } | null>(null);
    const [selectedFbPage, setSelectedFbPage] = useState<any>(null);

    // Load selected page from localStorage on mount and when overlay closes
    React.useEffect(() => {
        const checkSelectedPage = () => {
            const savedPage = localStorage.getItem('selected_fb_page');
            if (savedPage) {
                setSelectedFbPage(JSON.parse(savedPage));
            }
        };

        checkSelectedPage();
        // Listen for storage changes if multiple tabs are open
        window.addEventListener('storage', checkSelectedPage);
        return () => window.removeEventListener('storage', checkSelectedPage);
    }, [showOverlay]);

    const handlePost = async () => {
        setIsPosting(true);
        setPostResult(null);

        try {
            const res = await fetch('/api/facebook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: content.text,
                    imageUrl: content.image,
                    pageId: selectedFbPage?.id,
                    pageAccessToken: selectedFbPage?.access_token
                })
            });

            const data = await res.json();
            if (res.ok) {
                setPostResult({ success: true, message: 'Successfully posted to Facebook!' });
            } else {
                setPostResult({ success: false, message: data.error || 'Failed to post' });
            }
        } catch (error) {
            setPostResult({ success: false, message: 'An unexpected error occurred' });
        } finally {
            setIsPosting(false);
        }
    };

    const addToQueue = () => {
        if (tempDate && !scheduledDates.includes(tempDate)) {
            setScheduledDates([...scheduledDates, tempDate])
            setTempDate('')
        }
    }

    const removeFromQueue = (dateToRemove: string) => {
        setScheduledDates(scheduledDates.filter((d: string) => d !== dateToRemove))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setContent(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem="playground" />

            <PlatformOverlay isOpen={showOverlay} onClose={() => setShowOverlay(false)} />

            <main className="flex-1 overflow-y-auto flex flex-col custom-scrollbar">
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-10 flex-shrink-0 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-gray-800">Playground</h1>
                    <div className="flex items-center space-x-4">
                        {selectedFbPage && (
                            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
                                <img src={selectedFbPage.picture} className="w-5 h-5 rounded-full" alt="" />
                                <span className="text-xs font-bold text-blue-700">{selectedFbPage.name}</span>
                                <button onClick={() => {
                                    localStorage.removeItem('selected_fb_page');
                                    setSelectedFbPage(null);
                                }} className="text-blue-400 hover:text-blue-600">
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <button
                            onClick={() => setShowOverlay(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                        >
                            <LinkIcon size={16} />
                            <span>Connect Platform</span>
                        </button>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="pl-8 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                            <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                        </div>
                        <Bell className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white shadow-sm"></div>
                    </div>
                </header>

                <div className="flex-1 p-8 flex flex-col gap-8">

                    {postResult && (
                        <div className={`p-4 rounded-xl border flex items-center justify-between animate-in slide-in-from-top-4 duration-300 ${postResult.success ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                            }`}>
                            <span className="text-sm font-medium">{postResult.message}</span>
                            <button onClick={() => setPostResult(null)}><X size={16} /></button>
                        </div>
                    )}

                    {/* Top Section: Editor & Scheduling */}
                    <div className="flex flex-col lg:flex-row gap-8 flex-shrink-0">

                        {/* Editor Section */}
                        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Post Content</h2>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Author Name</label>
                                        <input
                                            type="text"
                                            value={content.authorName}
                                            onChange={(e) => setContent({ ...content, authorName: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Handle</label>
                                        <input
                                            type="text"
                                            value={content.authorHandle}
                                            onChange={(e) => setContent({ ...content, authorHandle: e.target.value })}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Post Text</label>
                                    <textarea
                                        value={content.text}
                                        onChange={(e) => setContent({ ...content, text: e.target.value })}
                                        rows={4}
                                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Upload Media</label>
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-1">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                                    <p className="text-xs text-gray-500">Click to upload image</p>
                                                </div>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                            </label>
                                        </div>
                                        {content.image && (
                                            <div className="h-32 w-32 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100 shadow-inner">
                                                <img src={content.image} alt="Preview thumbnail" className="h-full w-full object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scheduling & Status Widget */}
                        <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col h-fit">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">Publishing</h2>

                            <div className="space-y-6">
                                <div className="pt-2">
                                    <button
                                        onClick={handlePost}
                                        disabled={isPosting}
                                        className="w-full py-4 px-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black shadow-xl hover:shadow-2xl transition-all flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {isPosting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Posting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Post Now</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="h-px bg-gray-100 w-full"></div>

                                <h3 className="text-sm font-semibold text-gray-800">Advanced Scheduling</h3>

                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Queue Status</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${scheduledDates.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {scheduledDates.length} Posts Pending
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Add New Date</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="date"
                                            value={tempDate}
                                            onChange={(e) => setTempDate(e.target.value)}
                                            className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <button
                                            onClick={addToQueue}
                                            disabled={!tempDate}
                                            className="px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                </div>

                                {scheduledDates.length > 0 && (
                                    <div className="space-y-3">
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">Scheduled Queue</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                            {scheduledDates.map((date: string, index: number) => (
                                                <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-100 group">
                                                    <span className="text-xs font-medium text-gray-700">
                                                        {new Date(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <button
                                                        onClick={() => removeFromQueue(date)}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-100">
                                    <button
                                        disabled={scheduledDates.length === 0}
                                        className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center space-x-2"
                                    >
                                        <span>Schedule All Posts</span>
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Previews Section - Scrollable Horizontal Row */}
                    <div className="flex-1 overflow-x-auto min-h-0 bg-white/50 p-6 rounded-2xl border border-dashed border-gray-300 custom-scrollbar">
                        <div className="flex space-x-8 min-w-max pb-4">

                            <PreviewColumn title="Instagram" Component={InstagramPreview} content={content} />
                            <PreviewColumn title="Facebook" Component={FacebookPreview} content={content} />
                            <PreviewColumn title="TikTok" Component={TikTokPreview} content={content} />
                            <PreviewColumn title="Twitter (X)" Component={TwitterPreview} content={content} />
                            <PreviewColumn title="Threads" Component={ThreadsPreview} content={content} />
                            <PreviewColumn title="YouTube" Component={YouTubePreview} content={content} />
                            <PreviewColumn title="LinkedIn" Component={LinkedInPreview} content={content} />
                            <PreviewColumn title="Reddit" Component={RedditPreview} content={content} />
                            <PreviewColumn title="WhatsApp" Component={WhatsAppPreview} content={content} />
                            <PreviewColumn title="Pinterest" Component={PinterestPreview} content={content} />

                        </div>
                    </div>

                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.2);
                }
            `}</style>
        </div>
    )
}

const PreviewColumn = ({ title, Component, content }: { title: string, Component: any, content: any }) => (
    <div className="flex flex-col items-center">
        <h3 className="mb-4 font-bold text-gray-400 uppercase tracking-widest text-[10px]">{title}</h3>
        <Component content={content} />
    </div>
)

// --- PREVIEW COMPONENTS ---

const InstagramPreview = ({ content }: { content: any }) => (
    <div className="bg-white border border-gray-200 w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl">
        <div className="h-6 bg-white w-full flex justify-between items-center px-6 pt-2">
            <span className="text-[10px] font-bold">9:41</span>
            <div className="flex space-x-1">
                <div className="w-4 h-1.5 bg-black rounded-sm"></div>
                <div className="w-3 h-1.5 bg-black rounded-sm"></div>
            </div>
        </div>
        <div className="flex items-center p-3 border-b border-gray-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px] flex-shrink-0">
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                    <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=random`} className="rounded-full" alt="avatar" />
                </div>
            </div>
            <span className="ml-3 font-semibold text-gray-900 text-sm">{content.authorHandle}</span>
            <MoreHorizontal size={20} className="ml-auto text-gray-600" />
        </div>
        <div className="aspect-square w-full bg-gray-100 flex items-center justify-center overflow-hidden">
            <img src={content.image} alt="post" className="w-full h-full object-cover" />
        </div>
        <div className="p-3">
            <div className="flex items-center space-x-4 mb-3">
                <Heart size={24} className="text-gray-900" />
                <MessageCircle size={24} className="text-gray-900 -rotate-90" />
                <Send size={24} className="text-gray-900" />
                <Bookmark size={24} className="ml-auto text-gray-900" />
            </div>
            <div className="font-semibold text-sm mb-2">1,234 likes</div>
            <div className="text-sm line-clamp-3">
                <span className="font-semibold mr-2">{content.authorHandle}</span>
                {content.text}
            </div>
            <div className="text-gray-400 text-[10px] mt-2 uppercase">{content.date}</div>
        </div>
        <div className="mt-auto border-t border-gray-100 py-3 flex justify-around items-center bg-white pb-6">
            <div className="w-6 h-6 bg-gray-900 rounded-full opacity-10"></div>
            <div className="w-6 h-6 bg-gray-900 rounded-full opacity-10"></div>
            <div className="w-6 h-6 bg-gray-900 rounded-full opacity-10"></div>
            <div className="w-6 h-6 bg-gray-900 rounded-full opacity-10"></div>
        </div>
    </div>
)

const FacebookPreview = ({ content }: { content: any }) => (
    <div className="bg-[#f0f2f5] w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="bg-white p-3 border-b border-gray-200 flex items-center space-x-2 pt-8">
            <div className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold leading-none">f</div>
            <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-500">Search</div>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><MessageCircle size={18} /></div>
        </div>
        <div className="bg-white mt-2 p-3 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center mb-3">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=1877f2&color=fff`} className="w-10 h-10 rounded-full" />
                <div className="ml-2">
                    <div className="font-bold text-sm text-gray-900">{content.authorName}</div>
                    <div className="text-[10px] text-gray-500 flex items-center">{content.date} · <Globe size={10} className="ml-1" /></div>
                </div>
                <MoreHorizontal size={18} className="ml-auto text-gray-400" />
            </div>
            <div className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">{content.text}</div>
            {content.image && <img src={content.image} className="w-full h-auto object-cover max-h-[300px] rounded-lg mb-3" />}
            <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-b border-gray-100">
                <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px]"><ThumbsUp size={8} fill="white" /></div>
                    <span className="ml-1">2.4K</span>
                </div>
                <div>128 comments · 45 shares</div>
            </div>
            <div className="flex justify-between pt-2">
                <div className="flex items-center space-x-1 text-gray-500"><ThumbsUp size={16} /><span className="text-xs">Like</span></div>
                <div className="flex items-center space-x-1 text-gray-500"><MessageSquare size={16} /><span className="text-xs">Comment</span></div>
                <div className="flex items-center space-x-1 text-gray-500"><Share size={16} /><span className="text-xs">Share</span></div>
            </div>
        </div>
    </div>
)

const TikTokPreview = ({ content }: { content: any }) => (
    <div className="bg-black w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-800">
        <div className="absolute top-8 left-0 right-0 flex justify-center space-x-4 text-white font-bold text-sm z-20">
            <span className="opacity-60">Following</span>
            <span className="border-b-2 border-white pb-1">For You</span>
        </div>
        <div className="flex-1 relative bg-gray-900 overflow-hidden">
            <img src={content.image || ''} className="w-full h-full object-cover opacity-60" />
            <div className="absolute bottom-16 left-4 right-16 text-white z-10">
                <div className="font-bold text-lg mb-1">@{content.authorHandle}</div>
                <div className="text-sm line-clamp-3 mb-2">{content.text}</div>
                <div className="flex items-center space-x-2 text-xs">
                    <Music size={12} className="animate-spin" />
                    <span className="truncate">Original Sound - {content.authorName}</span>
                </div>
            </div>
            <div className="absolute bottom-16 right-3 flex flex-col items-center space-y-4 z-10">
                <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=000&color=fff`} className="w-12 h-12 rounded-full border-2 border-white" />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white font-bold">+</div>
                </div>
                <div className="flex flex-col items-center text-white"><Heart size={32} fill="white" /><span className="text-xs">1.2M</span></div>
                <div className="flex flex-col items-center text-white"><MessageCircle size={32} fill="white" className="-scale-x-100" /><span className="text-xs">15K</span></div>
                <div className="flex flex-col items-center text-white"><Bookmark size={30} fill="white" /><span className="text-xs">256K</span></div>
                <div className="flex flex-col items-center text-white"><Send size={30} fill="white" /><span className="text-xs">82K</span></div>
            </div>
        </div>
        <div className="h-14 bg-black flex justify-around items-center border-t border-white/10 pb-2">
            <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
            <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
            <div className="w-10 h-7 bg-gradient-to-r from-cyan-400 via-white to-pink-500 rounded-md"></div>
            <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
            <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
        </div>
    </div>
)

const TwitterPreview = ({ content }: { content: any }) => (
    <div className="bg-black text-white w-[375px] h-[650px] shadow-sm font-sans flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-800">
        <div className="h-6 w-full flex justify-between items-center px-6 pt-2">
            <span className="text-[10px] font-bold text-white">9:41</span>
            <div className="flex space-x-1">
                <div className="w-4 h-1.5 bg-white rounded-sm"></div>
            </div>
        </div>
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=333&color=fff`} className="w-full h-full" />
            </div>
            <div className="text-blue-400 font-bold">X</div>
            <div className="w-8"></div>
        </div>
        <div className="p-4 flex-1 custom-scrollbar overflow-y-auto">
            <div className="flex">
                <div className="flex-shrink-0 mr-3">
                    <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=000&color=fff`} className="w-10 h-10 rounded-full border border-gray-700" alt="avatar" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                        <span className="font-bold text-sm text-white">{content.authorName}</span>
                        <span className="text-gray-500 text-xs">@{content.authorHandle} · 2h</span>
                        <MoreHorizontal size={16} className="ml-auto text-gray-500" />
                    </div>
                    <div className="mt-1 text-white text-sm leading-snug whitespace-pre-wrap">{content.text}</div>
                    {content.image && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-800">
                            <img src={content.image} className="w-full h-auto object-cover max-h-[250px]" alt="post content" />
                        </div>
                    )}
                    <div className="flex justify-between mt-4 text-gray-500 max-w-sm">
                        <MessageSquare size={16} />
                        <Repeat size={16} />
                        <Heart size={16} />
                        <Share2 size={16} />
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-auto border-t border-gray-800 py-3 flex justify-around items-center bg-black pb-6">
            <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
            <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
            <div className="w-6 h-6 bg-white rounded-full opacity-20"></div>
        </div>
    </div>
)

const ThreadsPreview = ({ content }: { content: any }) => (
    <div className="bg-white w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="flex justify-center p-4 pt-10">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-[10px] font-bold">T</div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex space-x-3">
                <div className="flex flex-col items-center">
                    <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=000&color=fff`} className="w-10 h-10 rounded-full" />
                    <div className="flex-1 w-[2px] bg-gray-200 my-2 rounded-full"></div>
                </div>
                <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm">{content.authorHandle}</span>
                        <div className="flex items-center space-x-3 text-gray-400">
                            <span className="text-xs">2h</span>
                            <MoreHorizontal size={16} />
                        </div>
                    </div>
                    <div className="text-sm text-gray-900 mb-3 whitespace-pre-wrap">{content.text}</div>
                    {content.image && <img src={content.image} className="w-full rounded-xl border border-gray-100 mb-3" />}
                    <div className="flex space-x-4 text-gray-900 mb-2">
                        <Heart size={20} />
                        <MessageCircle size={20} className="-scale-x-100" />
                        <Repeat size={20} />
                        <Send size={20} />
                    </div>
                </div>
            </div>
        </div>
    </div>
)

const YouTubePreview = ({ content }: { content: any }) => (
    <div className="bg-white w-[375px] h-[650px] shadow-sm font-sans flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="h-6 w-full flex justify-between items-center px-6 pt-2 bg-white z-10">
            <span className="text-[10px] font-bold">9:41</span>
            <div className="flex space-x-1">
                <div className="w-4 h-1.5 bg-black rounded-sm"></div>
            </div>
        </div>
        <div className="aspect-video w-full bg-black relative group flex-shrink-0 mt-2">
            <img src={content.image || ''} className="w-full h-full object-contain" alt="thumbnail" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-600">
                <div className="w-1/3 h-full bg-red-600"></div>
            </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-base font-semibold text-gray-900 px-1 leading-tight mb-2">{content.text}</h3>
            <div className="flex text-[10px] text-gray-600 mb-4 px-1 space-x-2 uppercase font-medium">
                <span>1.2M views • 2 days ago</span>
            </div>
            <div className="flex justify-between px-2 mb-4">
                <div className="flex flex-col items-center"><ThumbsUp size={18} /><span className="text-[10px] mt-1">12K</span></div>
                <div className="flex flex-col items-center"><MessageSquare size={18} /><span className="text-[10px] mt-1">Dislike</span></div>
                <div className="flex flex-col items-center"><Share2 size={18} /><span className="text-[10px] mt-1">Share</span></div>
            </div>
            <div className="flex items-center space-x-3 py-3 border-t border-b border-gray-100">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=ff0000&color=fff`} className="w-8 h-8 rounded-full" alt="avatar" />
                <div className="flex-1">
                    <div className="font-semibold text-sm">{content.authorName}</div>
                    <div className="text-[10px] text-gray-500">100K subscribers</div>
                </div>
                <span className="text-red-600 font-bold text-xs uppercase">Subscribe</span>
            </div>
        </div>
    </div>
)

const LinkedInPreview = ({ content }: { content: any }) => (
    <div className="bg-[#f3f2ef] w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="h-6 w-full flex justify-between items-center px-6 pt-2 bg-white">
            <span className="text-[10px] font-bold">9:41</span>
            <div className="flex space-x-1">
                <div className="w-4 h-1.5 bg-black rounded-sm"></div>
            </div>
        </div>
        <div className="bg-white p-3 flex items-center space-x-4 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            <div className="flex-1 bg-gray-100 h-8 rounded px-2 flex items-center text-gray-400 text-xs">Search</div>
            <MessageCircle size={20} className="text-gray-600" />
        </div>
        <div className="bg-white mt-2 p-0 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-start p-3">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=0a66c2&color=fff`} className="w-12 h-12 rounded-full" alt="avatar" />
                <div className="ml-3 flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{content.authorName}</div>
                    <div className="text-[10px] text-gray-500">Product Designer @ Tech Corp</div>
                    <div className="text-[10px] text-gray-500 flex items-center mt-0.5">2h • <Globe size={10} className="ml-1" /></div>
                </div>
                <MoreHorizontal size={16} className="text-gray-600" />
            </div>
            <div className="px-3 pb-2 text-[13px] text-gray-900 whitespace-pre-wrap">{content.text}</div>
            {content.image && <img src={content.image} alt="post content" className="w-full object-cover max-h-[250px]" />}
            <div className="flex justify-between px-4 py-2 border-t border-gray-100 mt-2">
                <div className="flex flex-col items-center text-gray-600"><ThumbsUp size={18} /><span className="text-[10px] mt-1">Like</span></div>
                <div className="flex flex-col items-center text-gray-600"><MessageSquare size={18} /><span className="text-[10px] mt-1">Comment</span></div>
                <div className="flex flex-col items-center text-gray-600"><Repeat size={18} /><span className="text-[10px] mt-1">Repost</span></div>
                <div className="flex flex-col items-center text-gray-600"><Send size={18} /><span className="text-[10px] mt-1">Send</span></div>
            </div>
        </div>
    </div>
)

const RedditPreview = ({ content }: { content: any }) => (
    <div className="bg-[#dae0e6] w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="bg-white p-3 pt-10 flex items-center justify-between border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex-1 mx-3 bg-gray-100 rounded-md py-1 px-3 text-xs text-gray-500">Search</div>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
        </div>
        <div className="bg-white mt-3 p-3 flex-1 overflow-y-auto custom-scrollbar">
            <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-[10px] font-bold">r/</div>
                <div className="flex-1">
                    <span className="font-bold text-xs">r/community</span>
                    <span className="text-[10px] text-gray-500 ml-1">· 2h · u/{content.authorHandle}</span>
                </div>
                <button className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold">Join</button>
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-3">{content.text}</h3>
            {content.image && <img src={content.image} className="w-full rounded-lg mb-3" />}
            <div className="flex items-center space-x-6 border-t border-gray-100 pt-3 text-gray-500">
                <div className="flex items-center space-x-1 bg-gray-100 px-3 py-1 rounded-full">
                    <ArrowUp size={16} /><span className="font-bold text-xs">15.4K</span><ArrowDown size={16} />
                </div>
                <div className="flex items-center space-x-1"><MessageSquare size={16} /><span className="text-xs">452</span></div>
                <div className="flex items-center space-x-1"><Share size={16} /><span className="text-xs">Share</span></div>
            </div>
        </div>
    </div>
)

const WhatsAppPreview = ({ content }: { content: any }) => (
    <div className="bg-[#e5ddd5] w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="bg-[#075e54] text-white p-4 pt-10 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden flex items-center justify-center">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=1ebea5&color=fff`} className="w-full h-full" />
            </div>
            <div className="flex-1">
                <div className="font-bold text-base">{content.authorName}</div>
                <div className="text-[10px] opacity-80 uppercase">Online</div>
            </div>
            <MoreHorizontal size={20} />
        </div>
        <div className="flex-1 p-4 bg-gray-200 opacity-80 overflow-y-auto custom-scrollbar">
            <div className="bg-white p-2 rounded-lg shadow-sm max-w-[85%] relative self-start mb-2">
                {content.image && <img src={content.image} className="w-full rounded mb-2" />}
                <div className="text-sm text-gray-800 leading-tight mb-1">{content.text}</div>
                <div className="text-[9px] text-gray-400 text-right uppercase">9:41 AM</div>
            </div>
        </div>
        <div className="bg-white p-3 flex items-center space-x-2 pb-8">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"><Plus size={20} /></div>
            <div className="flex-1 bg-gray-50 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-400">Message</div>
            <Camera size={20} className="text-gray-500" />
            <div className="w-8 h-8 rounded-full bg-[#128c7e] flex items-center justify-center text-white"><Music size={16} /></div>
        </div>
    </div>
)

const PinterestPreview = ({ content }: { content: any }) => (
    <div className="bg-white w-[375px] h-[650px] shadow-sm font-sans text-sm flex-shrink-0 flex flex-col overflow-hidden relative rounded-3xl border border-gray-200">
        <div className="flex items-center justify-between p-4 pt-10">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><ChevronRight size={20} className="rotate-180" /></div>
            <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><Share size={18} /></div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><MoreHorizontal size={18} /></div>
            </div>
        </div>
        <div className="px-4 flex-1 overflow-y-auto pb-4 custom-scrollbar">
            {content.image && <img src={content.image} className="w-full rounded-2xl shadow-md mb-4" />}
            <h2 className="text-lg font-bold text-gray-900 mb-4">{content.text}</h2>
            <div className="flex items-center space-x-2">
                <img src={`https://ui-avatars.com/api/?name=${content.authorName}&background=bd081c&color=fff`} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                    <span className="font-bold text-sm block">{content.authorName}</span>
                    <span className="text-xs text-gray-500">12K followers</span>
                </div>
                <button className="bg-gray-200 px-4 py-2 rounded-full font-bold text-xs">Follow</button>
            </div>
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center pb-8">
            <div className="flex space-x-4">
                <div className="flex flex-col items-center"><Heart size={20} /><span className="text-[10px] mt-1">2.5K</span></div>
                <div className="flex flex-col items-center"><MessageCircle size={20} /><span className="text-[10px] mt-1">45</span></div>
            </div>
            <button className="bg-[#bd081c] text-white px-6 py-3 rounded-full font-bold text-sm uppercase">Save</button>
        </div>
    </div>
)
