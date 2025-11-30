import React, { useState, useEffect } from 'react';
import MentorDashboard from './pages/MentorDashboard';
import MentorApplication from './pages/MentorApplication';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('application');
  const [mentorProfile, setMentorProfile] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Check if mentor has already applied and load their profile
  useEffect(() => {
    const savedProfile = localStorage.getItem('mentorProfile');
    const applied = localStorage.getItem('mentorApplied');
    
    if (savedProfile && applied === 'true') {
      const profileData = JSON.parse(savedProfile);
      setMentorProfile(profileData);
      setHasApplied(true);
      setCurrentView('dashboard');
    }
  }, []);

  const handleApplicationSuccess = (profile) => {
    // Store the new mentor profile
    localStorage.setItem('mentorProfile', JSON.stringify(profile));
    localStorage.setItem('mentorApplied', 'true');
    
    // Update state with the new profile
    setMentorProfile(profile);
    setHasApplied(true);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    // Clear mentor data but keep the application status
    localStorage.removeItem('mentorProfile');
    localStorage.removeItem('mentorApplied');
    setMentorProfile(null);
    setHasApplied(false);
    setCurrentView('application');
  };

  return (
    <div className="app">
      {/* Navigation Header - Only show if mentor has applied */}
      {hasApplied && (
        <div className="bg-gray-800 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">TANA TEACHINGS</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm">Welcome, {mentorProfile?.name}</span>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentView === 'dashboard' 
                      ? 'bg-gray-200 text-gray-800' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Application View - Show when mentor hasn't applied yet */}
      {!hasApplied && currentView === 'application' && (
        <MentorApplication onApplicationSuccess={handleApplicationSuccess} />
      )}

      {/* Dashboard View - Show when mentor has applied (pass the real profile) */}
      {hasApplied && currentView === 'dashboard' && mentorProfile && (
        <MentorDashboard mentorProfile={mentorProfile} />
      )}

      {/* Welcome screen for new mentors */}
      {!hasApplied && currentView !== 'application' && (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-6">
              👨‍🏫
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Tana Teachings
            </h1>
            <p className="text-gray-600 mb-8 max-w-md">
              Join our platform as a mentor and help students achieve their learning goals. 
              Start by submitting your application.
            </p>
            <button
              onClick={() => setCurrentView('application')}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Start Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;