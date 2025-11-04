import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css";
import MentorApplication from "./pages/MentorApplication";
import MentorDashboard from "./pages/MentorDashboard";
import MentorProfile from "./pages/MentorProfile";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Menu */}
        <nav className="bg-indigo-800 text-white flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 p-4 shadow">
          <Link to="/" className="hover:underline transition">
            Home
          </Link>
          <Link to="/mentor/apply" className="hover:underline transition">
            Apply as Mentor
          </Link>
          <Link to="/mentor/dashboard" className="hover:underline transition">
            Mentor Dashboard
          </Link>
          <Link to="/mentor/profile" className="hover:underline transition">
            Mentor Profile
          </Link>
        </nav>

        {/* Page Content */}
        <div className="p-8">
          <Routes>
            <Route
              path="/"
              element={
                <div className="text-center py-20">
                  <h1 className="text-4xl font-bold text-indigo-700 mb-4">
                    Welcome to Tana Teachings
                  </h1>
                  <p className="text-gray-700 mb-2">
                    Your teammate is working on the homepage.
                  </p>
                  <p className="text-gray-700">
                    You can navigate to your mentor pages using the menu above!
                  </p>
                </div>
              }
            />
            <Route path="/mentor/apply" element={<MentorApplication />} />
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/profile" element={<MentorProfile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
