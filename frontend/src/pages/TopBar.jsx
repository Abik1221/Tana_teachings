import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VscGitStashApply } from "react-icons/vsc";
const TopBar = () => {
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const navigate = useNavigate();

  const selectorRef = useRef(null);
  const handleRoleSelection = (role) => {
    setShowRoleSelector(false); // Close the selector

    if (role === "parent") {
      navigate("/signup/parent");
    } else if (role === "mentor") {
      navigate("/signup/mentor");
    }
  };

  // useEffect for handling clicks outside the component
  useEffect(() => {
    function handleClickOutside(event) {
      // Check if the click is outside the selectorRef element
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setShowRoleSelector(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Unbind the event listener on cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectorRef]);

  return (
    <div className="bg-indigo-900 text-white text-xs py-2 relative">
      <div className="max-w-7xl mx-auto ">
        <div className="flex justify-between items-center space-x-4">
          {/* Left Side: Info */}
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="mr-1">📍</span>
              <span>Welcome to Tanatut</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">✉️</span>
              <span>contact@tanatut.com</span>
            </div>
          </div>
          <div className="relative" ref={selectorRef}>
            <button
              onClick={() => setShowRoleSelector(!showRoleSelector)}
              className="flex items-center font-semibold px-2 py-1 rounded-md hover:bg-blue-600 transition duration-150"
            >
              <span className="mr-1">
                <VscGitStashApply />
              </span>
              <span>Apply Now</span>
            </button>

            {/* Role Selection Pop-up (Conditional Rendering) */}
            {showRoleSelector && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-70">
                <p className="text-sm px-4 pt-3 pb-1 font-bold">
                  I want to apply as a...
                </p>

                {/* Parent CTA */}
                <button
                  onClick={() => handleRoleSelection("parent")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t border-gray-200"
                >
                  Parent (Find a Mentor)
                </button>

                {/* Mentor CTA */}
                <button
                  onClick={() => handleRoleSelection("mentor")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Mentor (Find Clients)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
