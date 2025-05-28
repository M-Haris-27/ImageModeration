// components/Auth/TokenInput.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const TokenInput = () => {
    const [tokenValue, setTokenValue] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isValidating } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tokenValue.trim()) {
            setError('Please enter a token');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await login(tokenValue.trim());
        } catch (err) {
            setError('Invalid token. Please check and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTokenChange = (e) => {
        setTokenValue(e.target.value);
        if (error) setError(''); // Clear error when user starts typing
    };

    return (
        <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-xl border border-slate-200/60 p-8 backdrop-blur-sm">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    Authentication Required
                </h2>
                <p className="text-slate-600">Enter your bearer token to access the platform</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Token Input */}
                <div className="space-y-3">
                    <label htmlFor="token" className="block text-sm font-semibold text-slate-700 flex items-center space-x-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Bearer Token</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            id="token"
                            value={tokenValue}
                            onChange={handleTokenChange}
                            placeholder="Enter your bearer token..."
                            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-mono text-sm transition-all duration-200 hover:border-slate-400 shadow-sm"
                            disabled={isLoading || isValidating}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            {(isLoading || isValidating) && (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="text-red-700 text-sm bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-xl border border-red-200 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || isValidating || !tokenValue.trim()}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                    {isLoading || isValidating ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Validating...</span>
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Authenticate</span>
                        </>
                    )}
                </button>
            </form>

            {/* Help Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border border-slate-200/60 shadow-sm">
                <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-800 mb-2 flex items-center">
                            Need a token?
                        </h3>
                        <p className="text-sm text-slate-600 mb-3">
                            Contact your administrator to get a bearer token. If you're an admin, you can generate tokens
                            using the admin token provided during setup.
                        </p>
                        <div className="p-3 bg-white/70 rounded-lg border border-slate-200/50 backdrop-blur-sm">
                            <p className="text-xs font-mono text-slate-700 mb-1">
                                <span className="font-semibold">Default Admin Token:</span> INITIAL_ADMIN_TOKEN
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <p className="text-xs text-amber-700 font-medium">⚠️ Change this in production!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TokenInput;