// components/Layout/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200/60 mt-auto backdrop-blur-sm">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                    {/* Left side - Brand info */}
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <div className="text-slate-700">
                            <p className="font-semibold">&copy; 2024 Image Moderation API</p>
                            <p className="text-sm text-slate-600 flex items-center space-x-2">
                                <span>Built with</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-sm"></div>
                                    <span className="font-medium">FastAPI</span>
                                </div>
                                <span>&</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-sm"></div>
                                    <span className="font-medium">React</span>
                                </div>
                            </p>
                        </div>
                    </div>

                    {/* Center - Links */}
                    <div className="flex items-center space-x-6">
                        <a
                            href="/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-blue-600 bg-white/60 hover:bg-white/80 rounded-xl border border-slate-200/60 hover:border-blue-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 backdrop-blur-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium">API Documentation</span>
                        </a>
                        <a
                            href="/health"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-green-600 bg-white/60 hover:bg-white/80 rounded-xl border border-slate-200/60 hover:border-green-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 backdrop-blur-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">Health Check</span>
                        </a>
                    </div>

                    {/* Right side - Status */}
                    <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/60 shadow-sm">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-sm font-semibold text-green-800">API Online</span>
                    </div>
                </div>

                {/* Bottom section - Additional info */}
                <div className="mt-8 pt-6 border-t border-slate-200/60">
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/60 shadow-sm">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-amber-800 mb-1">Demo Environment</h3>
                                <p className="text-sm text-amber-700 leading-relaxed">
                                    This is a demonstration API for image content moderation.
                                    For production use, integrate with real ML services like Google Vision API,
                                    AWS Rekognition, or Azure Computer Vision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;