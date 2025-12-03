// src/pages/Home.jsx
import React from "react";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import HowItWorks from "../components/HowItWorks";
import TestimonialsSection from "../components/TestimonialsSection";
import Navbar from "../components/Navbar";
const Home = () => {
  return (
    <div
      id="home"
      className="min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden"
    >
      <Navbar></Navbar>
      <HeroSection />
      <AboutSection></AboutSection>
      <HowItWorks></HowItWorks>
      <TestimonialsSection></TestimonialsSection>
    </div>
  );
};

export default Home;
