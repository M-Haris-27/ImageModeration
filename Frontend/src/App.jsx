// App.jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import TokenInput from './components/Auth/TokenInput';
import TokenGenerator from './components/Auth/TokenGenerator';
import ImageUpload from './components/Moderation/ImageUpload';
import SafetyReport from './components/Moderation/SafetyReport';
import './index.css'; // Ensure global styles are imported

const AppContent = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('upload');
  const [moderationResult, setModerationResult] = useState(null);

  const handleModerationComplete = (result) => {
    setModerationResult(result);
    setCurrentView('results');
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setModerationResult(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">
              Image Moderation API
            </h1>
            <TokenInput />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Navigation tabs */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setCurrentView('upload')}
              className={`px-4 py-2 font-medium ${currentView === 'upload'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Image Moderation
            </button>
            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 font-medium ${currentView === 'admin'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Token Generator
              </button>
            )}
            {currentView === 'results' && (
              <button
                onClick={handleBackToUpload}
                className="px-4 py-2 font-medium text-gray-500 hover:text-gray-700"
              >
                ← Back to Upload
              </button>
            )}
          </div>
        </div>

        {/* Content based on current view */}
        <div className="max-w-4xl mx-auto">
          {currentView === 'upload' && (
            <ImageUpload onModerationComplete={handleModerationComplete} />
          )}

          {currentView === 'results' && moderationResult && (
            <SafetyReport
              result={moderationResult}
              onBackToUpload={handleBackToUpload}
            />
          )}

          {currentView === 'admin' && isAdmin && (
            <TokenGenerator />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;