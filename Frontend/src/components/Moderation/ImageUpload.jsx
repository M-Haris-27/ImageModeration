// components/Moderation/ImageUpload.jsx
import React, { useState, useRef } from 'react';
import { moderationAPI } from '../../services/api';

const ImageUpload = ({ onModerationComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `Unsupported file type. Allowed: ${ALLOWED_TYPES.join(', ')}`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
        }
        return null;
    };

    const handleFileSelect = (file) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setSelectedFile(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError('');

        try {
            const result = await moderationAPI.analyzeImage(selectedFile);
            onModerationComplete(result);
        } catch (err) {
            setError('Analysis failed: ' + (err.response?.data?.detail || err.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        // Clean up preview URL
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Image Moderation</h2>
                    <p className="text-slate-600 mt-1">Upload and analyze images for content safety</p>
                </div>
            </div>

            {/* File Upload Area */}
            <div className="mb-6">
                <div
                    className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 transform ${dragOver
                        ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 scale-102 shadow-lg'
                        : selectedFile
                            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-md'
                            : 'border-slate-300 bg-gradient-to-br from-slate-50 to-white hover:border-slate-400 hover:shadow-md hover:scale-101'
                        }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {selectedFile ? (
                        <div className="space-y-6">
                            {/* Preview */}
                            <div className="max-w-md mx-auto">
                                <div className="relative group">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-auto rounded-xl shadow-lg border border-slate-200/60 group-hover:shadow-xl transition-all duration-300"
                                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </div>

                            {/* File Info */}
                            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 shadow-sm">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    File Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Filename</p>
                                        <p className="font-mono text-sm text-slate-800 truncate" title={selectedFile.name}>
                                            {selectedFile.name}
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Size</p>
                                        <p className="font-mono text-sm text-slate-800">
                                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 border border-slate-200/50 shadow-sm">
                                        <p className="text-sm font-medium text-slate-500 mb-1">Type</p>
                                        <p className="font-mono text-sm text-slate-800">{selectedFile.type}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing}
                                    className="flex-1 max-w-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>Analyze Image</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={clearSelection}
                                    disabled={isAnalyzing}
                                    className="flex-1 max-w-xs bg-white text-slate-700 px-8 py-4 rounded-xl hover:bg-slate-50 disabled:opacity-50 border border-slate-200/60 hover:border-slate-300 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Clear</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-slate-800">Upload Image for Analysis</h3>
                                <p className="text-slate-600 mb-4">Drop an image here, or</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-purple-700 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Browse Files
                                </button>
                            </div>
                            <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                                <p className="text-sm text-slate-600 font-medium mb-2">Supported formats:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['JPEG', 'PNG', 'GIF', 'WebP'].map((format) => (
                                        <span key={format} className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200/60">
                                            {format}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Maximum file size: 10MB</p>
                            </div>
                        </div>
                    )}

                    {/* Drag overlay */}
                    {dragOver && (
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center border-2 border-indigo-500 backdrop-blur-sm">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                    </svg>
                                </div>
                                <p className="text-lg font-bold text-indigo-700">Drop image here</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />

            {/* Error Message */}
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

            {/* Loading State */}
            {isAnalyzing && (
                <div className="text-center p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200/50 shadow-sm">
                    <div className="inline-flex items-center space-x-3 text-indigo-700">
                        <div className="relative">
                            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animation-delay-150"></div>
                        </div>
                        <div className="text-left">
                            <p className="font-semibold">Analyzing image content...</p>
                            <p className="text-sm text-indigo-600">This may take a few moments</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;