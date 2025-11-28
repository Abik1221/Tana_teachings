import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ParentSignup from "./components/ParentSignup";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import TopBar from "./pages/TopBar";
import Footer from "./components/Footer";
import MentorApplication from "./pages/MentorApplication";
import ParentSignin from "./components/ParentSignin";
import ExploreMentors from "./components/ExploreMentors";
import ParentDashboard from "./parents_info/ParentDashboard";
import HowItWorks from "./components/HowItWorks";
import About from "./components/AboutSection";
import ProtectedRoute from "./utils/ProtectedRoute"; // <-- Added
import AdminDashboard from "./admin/AdminDashboard";
import ParentPostJob from "./parents_info/ParentPostJob";
import ParentProfile from "./parents_info/ParentProfile";
import ParentJobsResponses from "./parents_info/ParentJobsResponses";
const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <Navbar />
        <main className="grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            //{" "}
            {/* <Route path="/MentorApplication" element={<MentorApplication />} /> */}
            <Route path="/parent-signup" element={<ParentSignup />} />
            <Route path="/parent-signin" element={<ParentSignin />} />
            <Route path="/HowItWorks" element={<HowItWorks />} />
            <Route path="/About" element={<About />} />
            <Route path="/explore-mentors" element={<ExploreMentors />} />
            {/* Protected Parent Routes */}
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentDashboard" element={<ParentDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentPostJob" element={<ParentPostJob />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route path="/ParentProfile" element={<ParentProfile />} />
            </Route>{" "}
            <Route element={<ProtectedRoute allowedRoles={["parent"]} />}>
              <Route
                path="/ParentJobsResponses"
                element={<ParentJobsResponses />}
              />
            </Route>
            <Route
              path="/AdminDashboard"
              element={
                <ProtectedRoute
                  element={<AdminDashboard />}
                  allowedRoles={["admin"]}
                />
              }
            />{" "}
            <Route
              path="/MentorApplication"
              element={
                <ProtectedRoute
                  element={<MentorApplication />}
                  allowedRoles={["mentor"]}
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
