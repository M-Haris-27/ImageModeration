// components/Moderation/SafetyReport.jsx
import React from 'react';

const SafetyReport = ({ result, onBackToUpload }) => {
    if (!result) return null;

    const { file_info, moderation_results, processing_info } = result;
    const { categories, is_safe, overall_score } = moderation_results;

    const getSafetyColor = (isSafe) => {
        return isSafe ? 'text-emerald-600' : 'text-red-600';
    };

    const getSafetyBadge = (isSafe) => {
        return isSafe
            ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200/60 shadow-emerald-100/50'
            : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200/60 shadow-red-100/50';
    };

    const getSafetyGradient = (isSafe) => {
        return isSafe
            ? 'from-emerald-500 to-green-600'
            : 'from-red-500 to-rose-600';
    };

    const getCategoryColor = (detected, confidence) => {
        if (detected) return 'text-red-600';
        if (confidence > 0.3) return 'text-amber-600';
        return 'text-emerald-600';
    };

    const getCategoryBgColor = (detected, confidence) => {
        if (detected) return 'bg-red-500';
        if (confidence > 0.3) return 'bg-amber-500';
        return 'bg-emerald-500';
    };

    const formatConfidence = (confidence) => {
        return `${(confidence * 100).toFixed(1)}%`;
    };

    const formatFileSize = (bytes) => {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Analysis Complete</h2>
                            <p className="text-slate-600 mt-1">Content moderation results</p>
                        </div>
                    </div>
                    <button
                        onClick={onBackToUpload}
                        className="bg-white text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-50 border border-slate-200/60 hover:border-slate-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Upload Another</span>
                    </button>
                </div>

                {/* Overall Safety Status */}
                <div className={`p-8 rounded-2xl border-2 shadow-xl ${getSafetyBadge(is_safe)}`}>
                    <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                Overall Safety Assessment
                            </h3>
                            <div className="flex items-center justify-center lg:justify-start space-x-4">
                                <div className={`w-16 h-16 bg-gradient-to-br ${getSafetyGradient(is_safe)} rounded-2xl flex items-center justify-center shadow-lg`}>
                                    {is_safe ? (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <p className={`text-4xl font-bold ${getSafetyColor(is_safe)}`}>
                                        {is_safe ? 'SAFE' : 'UNSAFE'}
                                    </p>
                                    <p className="text-slate-600 text-sm font-medium">Content Status</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-lg">
                                <p className="text-sm font-semibold text-slate-600 mb-2">Risk Score</p>
                                <p className={`text-3xl font-bold ${getSafetyColor(is_safe)}`}>
                                    {formatConfidence(overall_score)}
                                </p>
                                <div className="w-24 h-2 bg-slate-200 rounded-full mt-3 mx-auto">
                                    <div
                                        className={`h-2 bg-gradient-to-r ${getSafetyGradient(is_safe)} rounded-full transition-all duration-1000`}
                                        style={{ width: `${overall_score * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* File Information */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">File Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Filename</p>
                        <p className="font-mono text-sm text-slate-800 truncate" title={file_info.filename}>{file_info.filename}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">File Size</p>
                        <p className="font-mono text-sm text-slate-800">{formatFileSize(file_info.size_bytes)}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Dimensions</p>
                        <p className="font-mono text-sm text-slate-800">
                            {file_info.dimensions.width} × {file_info.dimensions.height}
                        </p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Format</p>
                        <p className="font-mono text-sm text-slate-800">{file_info.format}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Color Mode</p>
                        <p className="font-mono text-sm text-slate-800">{file_info.mode}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <p className="text-sm font-semibold text-slate-600 mb-2">Content Type</p>
                        <p className="font-mono text-sm text-slate-800">{file_info.content_type}</p>
                    </div>
                </div>
            </div>

            {/* Category Analysis */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Category Analysis</h3>
                </div>
                <div className="space-y-4">
                    {Object.entries(categories).map(([category, data]) => (
                        <div key={category} className="group bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className={`w-4 h-4 rounded-full ${getCategoryBgColor(data.detected, data.confidence)} shadow-lg`}></div>
                                        <div className={`absolute inset-0 w-4 h-4 rounded-full ${getCategoryBgColor(data.detected, data.confidence)} animate-ping opacity-20`}></div>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 capitalize">
                                            {category.replace(/_/g, ' ')}
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {data.detected ? 'Content detected' : 'No issues found'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-slate-200/50 shadow-sm">
                                        <p className={`font-bold text-lg ${getCategoryColor(data.detected, data.confidence)}`}>
                                            {formatConfidence(data.confidence)}
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium">confidence</p>
                                    </div>
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className={`h-2 ${getCategoryBgColor(data.detected, data.confidence)} transition-all duration-1000`}
                                        style={{ width: `${data.confidence * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Processing Information */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Processing Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">API Version</p>
                        </div>
                        <p className="font-mono text-lg font-bold text-slate-800">{processing_info.api_version}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">Model Version</p>
                        </div>
                        <p className="font-mono text-lg font-bold text-slate-800">{processing_info.model_version}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-semibold text-slate-600">Processing Time</p>
                        </div>
                        <p className="font-mono text-lg font-bold text-slate-800">{processing_info.processing_time_ms}ms</p>
                    </div>
                </div>
            </div>

            {/* Warning for Unsafe Content */}
            {!is_safe && (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200/60 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-800 mb-2">Content Warning</h3>
                            <p className="text-red-700 leading-relaxed">
                                This image has been flagged as potentially unsafe content.
                                Please review the category analysis above for specific concerns.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SafetyReport;