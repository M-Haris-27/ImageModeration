// components/Auth/TokenGenerator.jsx
import React, { useState, useEffect } from 'react';
import { authAPI } from '../../services/api';

const TokenGenerator = () => {
    const [tokens, setTokens] = useState([]);
    const [usageStats, setUsageStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadTokens();
        loadUsageStats();
    }, []);

    const loadTokens = async () => {
        try {
            const tokenList = await authAPI.getTokens();
            setTokens(tokenList);
        } catch (err) {
            setError('Failed to load tokens: ' + (err.response?.data?.detail || err.message));
        }
    };

    const loadUsageStats = async () => {
        try {
            const stats = await authAPI.getUsageStats();
            setUsageStats(stats);
        } catch (err) {
            console.error('Failed to load usage stats:', err);
        }
    };

    const createToken = async (isAdmin) => {
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const newToken = await authAPI.createToken(isAdmin);
            setSuccess(`Token created successfully: ${newToken.token}`);
            await loadTokens();
            await loadUsageStats();
        } catch (err) {
            setError('Failed to create token: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const deleteToken = async (token) => {
        if (!confirm('Are you sure you want to delete this token?')) return;

        try {
            await authAPI.deleteToken(token);
            setSuccess('Token deleted successfully');
            await loadTokens();
            await loadUsageStats();
        } catch (err) {
            setError('Failed to delete token: ' + (err.response?.data?.detail || err.message));
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setSuccess('Token copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="space-y-8">
            {/* Main Admin Panel */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Admin Control Panel</h2>
                        <p className="text-slate-600 mt-1">Manage API tokens and monitor system usage</p>
                    </div>
                </div>

                {/* Token Creation Section */}
                <div className="mb-8 p-6 bg-white/70 rounded-xl border border-slate-200/50 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create New Token
                    </h3>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                        <button
                            onClick={() => createToken(false)}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Create User Token</span>
                        </button>
                        <button
                            onClick={() => createToken(true)}
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <span>Create Admin Token</span>
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div className="mb-6 text-red-700 text-sm bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {success && (
                    <div className="mb-6 text-green-700 text-sm bg-gradient-to-r from-green-50 to-emerald-100 p-4 rounded-xl border border-green-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    </div>
                )}

                {/* Usage Statistics */}
                {usageStats && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/60 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Usage Analytics
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200/50">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-blue-600 mb-1">{usageStats.total_calls}</p>
                                <p className="text-sm text-slate-600 font-medium">Total API Calls</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200/50">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-green-600 mb-1">{usageStats.unique_tokens}</p>
                                <p className="text-sm text-slate-600 font-medium">Active Tokens</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200/50">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-purple-600 mb-1">
                                    {usageStats.calls_by_endpoint['/moderate/analyze'] || 0}
                                </p>
                                <p className="text-sm text-slate-600 font-medium">Images Analyzed</p>
                            </div>
                            <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-slate-200/50">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <p className="text-3xl font-bold text-orange-600 mb-1">
                                    {Object.keys(usageStats.calls_by_endpoint).length}
                                </p>
                                <p className="text-sm text-slate-600 font-medium">Endpoints Used</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Token List */}
                <div className="p-6 bg-white/70 rounded-xl border border-slate-200/50 backdrop-blur-sm">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Active Tokens
                        </div>
                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                            {tokens.length} total
                        </span>
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                        {tokens.map((token, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200 group">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <code className="text-sm font-mono bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 group-hover:bg-slate-50 transition-colors">
                                            {token.token.substring(0, 20)}...
                                        </code>
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${token.isAdmin
                                            ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-200'
                                            : 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-200'
                                            }`}>
                                            {token.isAdmin ? '👑 Admin' : '👤 User'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Created: {new Date(token.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => copyToClipboard(token.token)}
                                        className="px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 border border-blue-200 hover:border-blue-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Copy</span>
                                    </button>
                                    <button
                                        onClick={() => deleteToken(token.token)}
                                        className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 border border-red-200 hover:border-red-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
};

export default TokenGenerator;