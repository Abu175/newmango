import React, { useState, useMemo } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
    X, Facebook, Instagram, Youtube, Linkedin, Twitter,
    MessageCircle, MessageSquare, Share2, Globe,
    Send, Ghost, Camera, Phone, Rocket, Search,
    Plus, Info, ExternalLink, Copy
} from 'lucide-react'

// Custom icons for platforms not in lucide-react
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
)

const ThreadsIcon = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
    </svg>
)

const RedditIcon = ({ size = 20 }: { size?: number }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
        <path d="M22 11.5c0-1.38-1.12-2.5-2.5-2.5-.58 0-1.11.2-1.53.53C16.14 8.21 13.78 7.33 11.16 7.18l.88-4.13L15.11 4c.05.65.59 1.17 1.25 1.17 1.48 0 2.5-1.02 2.5-2.5s-1.02-2.5-2.5-2.5c-.94 0-1.76.54-2.18 1.34L11.58 1.1C11.39 1.05 11.2 1.16 11.16 1.34l-1.02 4.81C7.52 6.33 5.16 7.21 3.32 8.53c-.42-.33-.95-.53-1.53-.53-1.38 0-2.5 1.12-2.5 2.5 0 1.04.64 1.93 1.55 2.31-.05.23-.05.46-.05.69 0 3.86 4.39 7 9.81 7s9.81-3.14 9.81-7c0-.23 0-.46-.05-.69 1.02-.38 1.55-1.27 1.55-2.31zM6.5 11c.83 0 1.5.67 1.5 1.5S7.33 14 6.5 14 5 13.33 5 12.5 5.67 11 6.5 11zm8.31 4.83c-.88.88-2.48 1.32-4.19 1.32s-3.31-.44-4.19-1.32c-.15-.15-.15-.39 0-.54.15-.15.39-.15.54 0 .76.76 2.18 1.14 3.65 1.14s2.89-.38 3.65-1.14c.15-.15.39-.15.54 0 .15.15.15.39 0 .54zm.69-1.83c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
)

interface Platform {
    id: string;
    name: string;
    icon: React.ReactNode;
    color: string;
    description: string;
    category: 'social' | 'messaging' | 'other';
    author?: string;
    uuid?: string;
    website?: string;
}

const platforms: Platform[] = [
    { id: 'facebook', name: 'Facebook', icon: <Facebook className="w-5 h-5" />, color: '#1877F2', description: 'Connect with your audience on Facebook.', category: 'social', author: 'Meta', uuid: 'fb-001', website: 'facebook.com' },
    { id: 'instagram', name: 'Instagram', icon: <Instagram className="w-5 h-5" />, color: '#E4405F', description: 'Share visual stories on Instagram.', category: 'social', author: 'Meta', uuid: 'ig-001', website: 'instagram.com' },
    { id: 'youtube', name: 'YouTube', icon: <Youtube className="w-5 h-5" />, color: '#FF0000', description: 'Publish videos to your YouTube channel.', category: 'social', author: 'Google', uuid: 'yt-001', website: 'youtube.com' },
    { id: 'twitter', name: 'X (Twitter)', icon: <Twitter className="w-5 h-5" />, color: '#000000', description: 'Post updates on X.', category: 'social', author: 'X Corp', uuid: 'x-001', website: 'x.com' },
    { id: 'linkedin', name: 'LinkedIn', icon: <Linkedin className="w-5 h-5" />, color: '#0A66C2', description: 'Professional networking on LinkedIn.', category: 'social', author: 'Microsoft', uuid: 'li-001', website: 'linkedin.com' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="w-5 h-5" />, color: '#25D366', description: 'Direct messaging on WhatsApp.', category: 'messaging', author: 'Meta', uuid: 'wa-001', website: 'whatsapp.com' },
    { id: 'tiktok', name: 'TikTok', icon: <TikTokIcon />, color: '#000000', description: 'Short-form video on TikTok.', category: 'social', author: 'ByteDance', uuid: 'tt-001', website: 'tiktok.com' },
    { id: 'threads', name: 'Threads', icon: <ThreadsIcon />, color: '#000000', description: 'Share text and join conversations.', category: 'social', author: 'Meta', uuid: 'th-001', website: 'threads.net' },
    { id: 'reddit', name: 'Reddit', icon: <RedditIcon />, color: '#FF4500', description: 'Participate in communities on Reddit.', category: 'social', author: 'Reddit Inc', uuid: 'rd-001', website: 'reddit.com' },
    { id: 'pinterest', name: 'Pinterest', icon: <Send className="w-5 h-5 -rotate-45" />, color: '#BD081C', description: 'Visual discovery on Pinterest.', category: 'social', author: 'Pinterest Inc', uuid: 'pt-001', website: 'pinterest.com' },
    { id: 'snapchat', name: 'Snapchat', icon: <Ghost className="w-5 h-5" />, color: '#FFFC00', description: 'Snap and chat on Snapchat.', category: 'messaging', author: 'Snap Inc', uuid: 'sc-001', website: 'snapchat.com' },
    { id: 'telegram', name: 'Telegram', icon: <Send className="w-5 h-5" />, color: '#0088CC', description: 'Secure messaging with Telegram.', category: 'messaging', author: 'Telegram FZ-LLC', uuid: 'tg-001', website: 'telegram.org' },
    { id: 'messenger', name: 'Messenger', icon: <MessageSquare className="w-5 h-5" />, color: '#00B2FF', description: 'Chat with Facebook friends.', category: 'messaging', author: 'Meta', uuid: 'ms-001', website: 'messenger.com' },
    { id: 'douyin', name: 'Douyin', icon: <Camera className="w-5 h-5" />, color: '#000000', description: 'The original TikTok in China.', category: 'social', author: 'ByteDance', uuid: 'dy-001', website: 'douyin.com' },
    { id: 'wechat', name: 'WeChat', icon: <Phone className="w-5 h-5" />, color: '#07C160', description: 'All-in-one app for China.', category: 'messaging', author: 'Tencent', uuid: 'wc-001', website: 'wechat.com' }
];

interface PlatformOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PlatformOverlay({ isOpen, onClose }: PlatformOverlayProps) {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [facebookPages, setFacebookPages] = useState<any[]>([]);
    const [isLoadingPages, setIsLoadingPages] = useState(false);
    const { data: session } = useSession();

    // Check if connected to the selected platform
    const isConnected = (session as any)?.provider === selectedPlatform?.id;

    const handleConnect = async () => {
        if (selectedPlatform?.id === 'facebook') {
            await signIn('facebook');
        } else {
            console.log("Connect to " + selectedPlatform?.name);
        }
    };

    // Fetch pages when Facebook is connected and overlay is open
    React.useEffect(() => {
        if (isOpen && (session as any)?.provider === 'facebook' && selectedPlatform?.id === 'facebook') {
            fetchPages();
        }
    }, [isOpen, session, selectedPlatform]);

    const fetchPages = async () => {
        setIsLoadingPages(true);
        try {
            const res = await fetch('/api/facebook/pages');
            const data = await res.json();
            if (data.pages) {
                setFacebookPages(data.pages);
            }
        } catch (error) {
            console.error('Failed to fetch pages:', error);
        } finally {
            setIsLoadingPages(false);
        }
    };

    const handlePlatformClick = (platform: Platform) => {
        setSelectedPlatform(platform);
        setView('detail');
    };

    const handleBack = () => {
        setView('list');
        setSelectedPlatform(null);
    };

    const filteredPlatforms = useMemo(() => {
        return platforms.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300 font-sans text-gray-900">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col border border-gray-200 relative">

                {/* Close Button - Universal */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-20 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                {view === 'list' ? (
                    <>
                        {/* Header */}
                        <div className="p-8 pb-4">
                            <h2 className="text-xl font-bold tracking-tight">Connectors</h2>
                        </div>

                        {/* Search & Header */}
                        <div className="px-8 flex items-center justify-between border-b border-gray-100 mb-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Available Platforms</h3>
                            <div className="relative mb-4 group">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-50 border border-gray-100 rounded-xl py-2 pl-9 pr-4 text-xs w-64 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-gray-900"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={14} />
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredPlatforms.map((platform) => (
                                    <div
                                        key={platform.id}
                                        onClick={() => handlePlatformClick(platform)}
                                        className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer group flex items-start space-x-4 h-24"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm bg-white"
                                        >
                                            <div style={{ color: platform.color }}>
                                                {platform.icon}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center space-x-1 justify-between">
                                                <h3 className="font-semibold text-sm truncate text-gray-900">{platform.name}</h3>
                                                {platform.id === 'instagram' && <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>}
                                            </div>
                                            <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">{platform.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    /* DETAIL VIEW */
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-12 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center justify-center min-h-full w-full">
                            <div className="w-full max-w-md flex flex-col items-center">
                                {/* Center Icon */}
                                <div
                                    className="w-24 h-24 rounded-[2rem] flex items-center justify-center shadow-xl mb-8 relative border border-white"
                                    style={{ backgroundColor: `${selectedPlatform?.color}` }}
                                >
                                    <div className="text-white scale-[2]">
                                        {selectedPlatform?.icon}
                                    </div>
                                    <div className="absolute -inset-4 rounded-[2.5rem] opacity-10 blur-2xl shadow-lg" style={{ backgroundColor: selectedPlatform?.color }}></div>
                                </div>

                                <h2 className="text-3xl font-bold mb-3 text-gray-900">{selectedPlatform?.name}</h2>
                                <p className="text-center text-gray-500 max-w-lg mb-8 text-sm leading-relaxed">
                                    {selectedPlatform?.description} Search data across your apps and execute real actions by connecting Aquasoft to the {selectedPlatform?.name} platform.
                                </p>

                                <div className="bg-gray-50 p-4 rounded-2xl flex items-center space-x-3 mb-8 w-full max-w-md border border-gray-100">
                                    <div className="flex-shrink-0">
                                        <Info size={16} className="text-gray-400" />
                                    </div>
                                    <p className="text-xs text-gray-500">This connector requires additional configuration</p>
                                </div>

                                <button
                                    onClick={isConnected ? () => signOut() : handleConnect}
                                    className={`w-full max-w-md py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.02] active:scale-[0.98] ${isConnected ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    {isConnected ? (
                                        <>
                                            <span>Disconnect {selectedPlatform?.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={16} />
                                            <span>Connect {selectedPlatform?.name}</span>
                                        </>
                                    )}
                                </button>

                                {/* Page Selection for Facebook */}
                                {isConnected && selectedPlatform?.id === 'facebook' && (
                                    <div className="w-full max-w-md mt-6 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-800">Select Page</h3>
                                            <button
                                                onClick={fetchPages}
                                                className="text-[10px] text-blue-600 hover:underline uppercase font-bold tracking-wider"
                                            >
                                                Refresh
                                            </button>
                                        </div>

                                        {isLoadingPages ? (
                                            <div className="flex flex-col items-center py-8 space-y-3 bg-gray-50 rounded-2xl border border-gray-100 italic text-gray-400 text-xs">
                                                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Fetching your pages...</span>
                                            </div>
                                        ) : facebookPages.length > 0 ? (
                                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                {facebookPages.map(page => (
                                                    <div
                                                        key={page.id}
                                                        className="flex items-center justify-between p-3 bg-gray-50 hover:bg-white border border-gray-100 hover:border-blue-200 rounded-xl transition-all group cursor-pointer"
                                                        onClick={() => {
                                                            // Store selected page in local storage or pass back to parent
                                                            localStorage.setItem('selected_fb_page', JSON.stringify(page));
                                                            onClose();
                                                        }}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <img src={page.picture} className="w-8 h-8 rounded-lg shadow-sm" alt={page.name} />
                                                            <span className="text-sm font-semibold text-gray-700">{page.name}</span>
                                                        </div>
                                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ExternalLink size={14} className="text-blue-500" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                                <p className="text-xs text-orange-600 font-medium">No pages found. Make sure you have given permission to manage pages.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Metadata Box */}
                                <div className="mt-12 w-full max-w-md bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                                    <div className="p-4 space-y-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-medium">Connector Type</span>
                                            <span className="text-gray-900 font-bold">Social</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-medium">Author</span>
                                            <span className="text-gray-900 font-bold">{selectedPlatform?.author || 'Aquasoft'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-400 font-medium">UUID</span>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-gray-400 font-mono text-[10px]">{selectedPlatform?.uuid || 'uuid-placeholder'}</span>
                                                <Copy size={12} className="text-gray-300 hover:text-gray-900 cursor-pointer" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span className="font-medium">Website</span>
                                            <ExternalLink size={12} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span className="font-medium">Documentation</span>
                                            <ExternalLink size={12} className="text-blue-500 hover:text-blue-600 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBack}
                                    className="mt-8 mb-4 text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors flex items-center space-x-2"
                                >
                                    <span>Back to Connectors</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Style - Light Bottom */}
                <div className="h-4 bg-gray-50 w-full border-t border-gray-100 flex-shrink-0"></div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div >
    )
}
