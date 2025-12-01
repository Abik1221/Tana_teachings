import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentSignup from "./components/ParentSignup";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import TopBar from "./pages/TopBar";
import Footer from "./components/Footer";
import MentorApplication from "./pages/MentorApplication";
import MentorDashboard from './pages/MentorDashboard';
import ParentSignin from "./components/ParentSignin";
import ExploreMentors from "./components/ExploreMentors";
import ParentDashboard from "./parents_info/ParentDashboard";
import HowItWorks from "./components/HowItWorks";
import About from "./components/AboutSection";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminDashboard from "./admin/AdminDashboard";
import ParentPostJob from "./parents_info/ParentPostJob";
import ParentProfile from "./parents_info/ParentProfile";
import ParentJobsResponses from "./parents_info/ParentJobsResponses";
import './App.css';

const App = () => {
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
    }
  }, []);

  const handleApplicationSuccess = (profile) => {
    // Store the new mentor profile
    localStorage.setItem('mentorProfile', JSON.stringify(profile));
    localStorage.setItem('mentorApplied', 'true');
    
    // Update state with the new profile
    setMentorProfile(profile);
    setHasApplied(true);
  };

  const handleLogout = () => {
    // Clear mentor data but keep the application status
    localStorage.removeItem('mentorProfile');
    localStorage.removeItem('mentorApplied');
    setMentorProfile(null);
    setHasApplied(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/parent-signup" element={<ParentSignup />} />
            <Route path="/parent-signin" element={<ParentSignin />} />
            <Route path="/HowItWorks" element={<HowItWorks />} />
            <Route path="/About" element={<About />} />
            <Route path="/explore-mentors" element={<ExploreMentors />} />
            
            {/* Mentor Application Route - Show your enhanced version */}
            <Route 
              path="/mentor-application" 
              element={
                <MentorApplication onApplicationSuccess={handleApplicationSuccess} />
              } 
            />
            
            {/* Protected Mentor Dashboard Route */}
            <Route 
              path="/mentor-dashboard" 
              element={
                hasApplied && mentorProfile ? (
                  <MentorDashboard 
                    mentorProfile={mentorProfile} 
                    onLogout={handleLogout}
                  />
                ) : (
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
                      <a
                        href="/mentor-application"
                        className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg inline-block"
                      >
                        Start Application
                      </a>
                    </div>
                  </div>
                )
              } 
            />

            {/* Protected Parent Routes */}
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentDashboard" element={<ParentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentPostJob" element={<ParentPostJob />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentProfile" element={<ParentProfile />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route
                path="/ParentJobsResponses"
                element={<ParentJobsResponses />}
              />
            </Route>
            
            {/* Admin Route */}
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashboard />}
                  allowedRoles={["admin"]}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;