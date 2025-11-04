import React, { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const menuButtonRef = useRef(null);
  const menuContentRef = useRef(null);

  const topBarHeight = 40; // adjust according to your TopBar height in px (py-2 + text + padding)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= topBarHeight) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle outside click for mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuContentRef.current &&
        menuButtonRef.current &&
        !menuContentRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "About", href: "#about" },
    { name: "For Mentors", href: "#for-mentors" },
  ];

  return (
    <nav
      className={`bg-white shadow-lg z-50 transition-all duration-300 ${
        isFixed ? "fixed top-0 left-0 right-0" : "relative"
      }`}
    >
      <div className="flex justify-between items-center h-16 max-w-8xl mx-auto pr-6 pl-2">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <img
              src="/images/logo1.jpg"
              alt="Logo"
              className="w-12 h-12 object-contain"
            />
            <span className="text-2xl font-bold text-indigo-700">Tanatut</span>
          </a>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/login"
            className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
          >
            Log In
          </a>
          <a
            href="/signup"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            Parents Sign Up
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            ref={menuButtonRef}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-600 focus:outline-none"
          >
            {!isOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={menuContentRef}
        className={`${isOpen ? "block" : "hidden"} md:hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <a
            href="/login"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            onClick={() => setIsOpen(false)}
          >
            Log In
          </a>
          <a
            href="/signup"
            className="block px-3 py-2 mt-2 text-center rounded-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsOpen(false)}
          >
            Parents Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
