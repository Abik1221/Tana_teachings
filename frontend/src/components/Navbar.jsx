import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [isFixed, setIsFixed] = useState(false); // fixed top on scroll
  const [role, setRole] = useState(null);
  const [userName, setUserName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false); // desktop avatar dropdown
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false); // mobile avatar sidebar

  const menuButtonRef = useRef(null);
  const menuContentRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const topBarHeight = 40;

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY >= topBarHeight);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateUser = () => {
      const savedRole = localStorage.getItem("role");
      const savedName =
        localStorage.getItem("fullName") ||
        localStorage.getItem("parentName") ||
        localStorage.getItem("name");

      setRole(savedRole);
      setUserName(savedName || "");
    };

    updateUser(); // initial load

    window.addEventListener("storage", updateUser); // reacts to changes in other tabs
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  // Close dropdowns when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        isOpen &&
        menuContentRef.current &&
        menuButtonRef.current &&
        !menuContentRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }

      if (
        mobileProfileOpen &&
        menuContentRef.current &&
        !menuContentRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setMobileProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen, isOpen, mobileProfileOpen]);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  // Public and private pages
  const publicPages = [
    "/",
    "/about",
    "/howitworks",
    "/explore-mentors",
    "/parent-signin",
    "/parent-signup",
  ];
  const privatePages = [
    "/ParentDashboard",
    "/ParentProfile",
    "/post-job",
    "/AdminDashboard",
    "/manage-users",
    "/manage-jobs",
  ];

  const isPublicPage = publicPages.includes(location.pathname);
  const isPrivatePage = privatePages.includes(location.pathname);

  // Visitor links
  const visitorLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/howitworks" },
    { name: "About", path: "/about" },
    { name: "For Mentors", path: "/explore-mentors" },
  ];

  // Private links based on role
  const privateLinks =
    role === "parent"
      ? [
          { name: "Home", path: "/" },
          { name: "For Mentors", path: "/explore-mentors" },
          { name: "Dashboard", path: "/ParentDashboard" },
        ]
      : role === "admin"
      ? [
          { name: "Home", path: "/" },
          { name: "Admin Panel", path: "/AdminDashboard" },
          { name: "Manage Users", path: "/manage-users" },
          { name: "Manage Jobs", path: "/manage-jobs" },
        ]
      : [];

  // Determine nav links
  const navLinks = isPrivatePage && role ? privateLinks : visitorLinks;

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav
      className={`bg-white shadow-lg z-50 transition-all duration-300 ${
        isFixed ? "fixed top-0 left-0 right-0" : "relative"
      }`}
    >
      <div className="flex justify-between items-center h-16 max-w-8xl mx-auto pr-6 pl-2">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/images/logo1.jpg"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-bold text-indigo-700">Tanatut</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
            >
              {link.name}
            </Link>
          ))}

          {/* Login / Signup for public pages */}
          {(!role || isPublicPage) && (
            <>
              <Link
                to="/parent-signin"
                className="text-gray-600 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
              >
                Log In
              </Link>
              <Link
                to="/parent-signup"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* Avatar dropdown on private pages */}
          {role && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150"
              >
                {getInitials(userName)}
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg py-4 z-50">
                  <div className="px-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                        {getInitials(userName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {userName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <Link
                      to="/ParentProfile"
                      className="px-4 py-2 text-gray-700 hover:bg-indigo-50"
                    >
                      My Profile
                    </Link>
                    {role === "parent" && (
                      <Link
                        to="/ParentPostJob"
                        className="px-4 py-2 text-gray-700 hover:bg-green-50"
                      >
                        Post Job
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      className="px-4 py-2 text-gray-700 hover:bg-yellow-50"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-gray-700 hover:bg-red-50 text-left"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          {role && isPrivatePage && (
            <button
              onClick={() => setMobileProfileOpen(!mobileProfileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150"
            >
              {getInitials(userName)}
            </button>
          )}

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
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.name}
            </Link>
          ))}

          {/* Login/signup for public pages */}
          {(!role || isPublicPage) && (
            <>
              <Link
                to="/parent-signin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              >
                Log In
              </Link>
              <Link
                to="/parent-signup"
                onClick={() => setIsOpen(false)}
                className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-150 shadow-md"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Avatar Sidebar */}
      {mobileProfileOpen && role && isPrivatePage && (
        <div className="fixed top-0 right-0 h-full w-64 bg-white border-l shadow-lg z-50 p-4 animate-slide-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              {getInitials(userName)}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{userName}</p>
              <p className="text-sm text-gray-500 capitalize">{role}</p>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <Link
              to="/ParentProfile"
              onClick={() => setMobileProfileOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-indigo-50 rounded"
            >
              My Profile
            </Link>
            {role === "parent" && (
              <Link
                to="/post-job"
                onClick={() => setMobileProfileOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-green-50 rounded"
              >
                Post Job
              </Link>
            )}
            <Link
              to="/settings"
              onClick={() => setMobileProfileOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-yellow-50 rounded"
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-700 hover:bg-red-50 text-left rounded"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
