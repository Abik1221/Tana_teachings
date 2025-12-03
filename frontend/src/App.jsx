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
import ParentProfile from "./parents_info/ParentProfile";
//import MentorDetail from "./parents_info/MentorDetail";
import ParentPostJob from "./parents_info/ParentPostJob";
import SuccessMessage from "./pages/SuccessMessage";
import PasswordFields from "./pages/PasswordFields";
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
        {/* <TopBar /> */}

        {/* <Navbar /> */}
        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/parent-signup" element={<ParentSignup />} />
            <Route path="/parent-signin" element={<ParentSignin />} />
            <Route path="/HowItWorks" element={<HowItWorks />} />
            <Route path="/About" element={<About />} />
            <Route path="/ParentPostJob" element={<ParentPostJob />} />
            <Route path="/explore-mentors" element={<ExploreMentors />} />
            <Route path="/success-message" element={<SuccessMessage />} />
            <Route path="/password-fields" element={<PasswordFields />} />
            <Route path="/ParentDashboard" element={<ParentDashboard />} />
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentProfile" element={<ParentProfile />} />
            </Route>{" "}
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashboard />}
                  allowedRoles={["admin"]}
                />
              }
            />
            {/* <Route path="/mentors/:id" element={<MentorDetail />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;