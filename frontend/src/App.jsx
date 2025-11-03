import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import Components
import Navbar from "./components/Navbar";
import Home from "./pages/home"; // Assuming Home.jsx is in src/pages/
// Placeholder imports for future pages
import TopBar from "./pages/TopBar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <Navbar />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>

        <Footer></Footer>
      </div>
    </Router>
  );
};

export default App;
