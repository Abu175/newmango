'use client'
import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import {
    Calendar, Clock, Tag, FileText, Plus, X, Save, Trash2,
    TrendingUp, Target, CheckCircle, AlertCircle, Search, Bell
} from 'lucide-react'

interface ContentNeed {
    id: string
    title: string
    description: string
    platform: string[]
    deadline: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: 'pending' | 'in-progress' | 'completed'
    tags: string[]
}

export default function NeedsPage() {
    const [needs, setNeeds] = useState<ContentNeed[]>([
        {
            id: '1',
            title: 'Product Launch Campaign',
            description: 'Create content for new product launch across all platforms',
            platform: ['Instagram', 'Twitter', 'LinkedIn'],
            deadline: '2026-02-01',
            priority: 'urgent',
            status: 'in-progress',
            tags: ['product', 'launch', 'campaign']
        },
        {
            id: '2',
            title: 'Weekly Newsletter Content',
            description: 'Prepare weekly newsletter with industry updates',
            platform: ['Email', 'LinkedIn'],
            deadline: '2026-01-25',
            priority: 'high',
            status: 'pending',
            tags: ['newsletter', 'weekly']
        }
    ])

    const [showForm, setShowForm] = useState(false)
    const [editingNeed, setEditingNeed] = useState<ContentNeed | null>(null)
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [filterPriority, setFilterPriority] = useState<string>('all')

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        platform: [] as string[],
        deadline: '',
        priority: 'medium' as ContentNeed['priority'],
        tags: ''
    })

    const platforms = ['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'Reddit']

    const handleAddNeed = () => {
        if (!formData.title || !formData.deadline) return

        const newNeed: ContentNeed = {
            id: Date.now().toString(),
            title: formData.title,
            description: formData.description,
            platform: formData.platform,
            deadline: formData.deadline,
            priority: formData.priority,
            status: 'pending',
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }

        if (editingNeed) {
            setNeeds(needs.map(n => n.id === editingNeed.id ? { ...newNeed, id: editingNeed.id, status: editingNeed.status } : n))
        } else {
            setNeeds([...needs, newNeed])
        }

        setFormData({ title: '', description: '', platform: [], deadline: '', priority: 'medium', tags: '' })
        setShowForm(false)
        setEditingNeed(null)
    }

    const handleEdit = (need: ContentNeed) => {
        setEditingNeed(need)
        setFormData({
            title: need.title,
            description: need.description,
            platform: need.platform,
            deadline: need.deadline,
            priority: need.priority,
            tags: need.tags.join(', ')
        })
        setShowForm(true)
    }

    const handleDelete = (id: string) => {
        setNeeds(needs.filter(n => n.id !== id))
    }

    const handleStatusChange = (id: string, status: ContentNeed['status']) => {
        setNeeds(needs.map(n => n.id === id ? { ...n, status } : n))
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
            case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
            case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'low': return 'bg-gray-100 text-gray-800 border-gray-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200'
            case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            default: return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const filteredNeeds = needs.filter(need => {
        const statusMatch = filterStatus === 'all' || need.status === filterStatus
        const priorityMatch = filterPriority === 'all' || need.priority === filterPriority
        return statusMatch && priorityMatch
    })

    const stats = {
        total: needs.length,
        pending: needs.filter(n => n.status === 'pending').length,
        inProgress: needs.filter(n => n.status === 'in-progress').length,
        completed: needs.filter(n => n.status === 'completed').length
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activeItem="needs" />

            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white shadow-sm p-6 flex justify-between items-center sticky top-0 z-10 border-b border-gray-100">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Content Needs</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage your social media content requirements</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search needs..."
                                className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-gray-200"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        </div>
                        <Bell className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20} />
                        <button
                            onClick={() => {
                                setShowForm(true)
                                setEditingNeed(null)
                                setFormData({ title: '', description: '', platform: [], deadline: '', priority: 'medium', tags: '' })
                            }}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                        >
                            <Plus size={16} />
                            <span>Add Need</span>
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Needs</p>
                                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
                                </div>
                                <FileText className="text-blue-500" size={32} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
                                </div>
                                <AlertCircle className="text-yellow-500" size={32} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">In Progress</p>
                                    <p className="text-3xl font-bold text-blue-600 mt-2">{stats.inProgress}</p>
                                </div>
                                <TrendingUp className="text-blue-500" size={32} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completed</p>
                                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
                                </div>
                                <CheckCircle className="text-green-500" size={32} />
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex space-x-4 mb-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                            <select
                                value={filterPriority}
                                onChange={(e) => setFilterPriority(e.target.value)}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                            >
                                <option value="all">All Priorities</option>
                                <option value="urgent">Urgent</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Add/Edit Form */}
                    {showForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {editingNeed ? 'Edit Content Need' : 'Add New Content Need'}
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowForm(false)
                                            setEditingNeed(null)
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g., Product Launch Campaign"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                            rows={4}
                                            placeholder="Describe the content requirements..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Platforms</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {platforms.map(platform => (
                                                <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.platform.includes(platform)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setFormData({ ...formData, platform: [...formData.platform, platform] })
                                                            } else {
                                                                setFormData({ ...formData, platform: formData.platform.filter(p => p !== platform) })
                                                            }
                                                        }}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{platform}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Deadline *</label>
                                            <input
                                                type="date"
                                                value={formData.deadline}
                                                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                                            <select
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as ContentNeed['priority'] })}
                                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g., campaign, product, launch"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            onClick={() => {
                                                setShowForm(false)
                                                setEditingNeed(null)
                                            }}
                                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddNeed}
                                            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                                        >
                                            <Save size={16} />
                                            <span>{editingNeed ? 'Update' : 'Create'} Need</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Needs List */}
                    <div className="space-y-4">
                        {filteredNeeds.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                <Target className="mx-auto text-gray-300 mb-4" size={64} />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No content needs found</h3>
                                <p className="text-gray-500">Start by adding a new content need to manage your requirements</p>
                            </div>
                        ) : (
                            filteredNeeds.map(need => (
                                <div key={need.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{need.title}</h3>
                                            <p className="text-gray-600 text-sm mb-3">{need.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEdit(need)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <FileText size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(need.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(need.priority)}`}>
                                            {need.priority.toUpperCase()}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(need.status)}`}>
                                            {need.status.replace('-', ' ').toUpperCase()}
                                        </span>
                                        <div className="flex items-center space-x-1 text-gray-500 text-sm">
                                            <Calendar size={14} />
                                            <span>{new Date(need.deadline).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {need.platform.map(platform => (
                                                <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                    {platform}
                                                </span>
                                            ))}
                                        </div>

                                        <select
                                            value={need.status}
                                            onChange={(e) => handleStatusChange(need.id, e.target.value as ContentNeed['status'])}
                                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {need.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                                            {need.tags.map((tag, idx) => (
                                                <span key={idx} className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                    <Tag size={12} />
                                                    <span>{tag}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
