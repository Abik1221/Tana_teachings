import React from "react";
import {
  AiOutlineUser,
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineBell,
} from "react-icons/ai";
import { MdPostAdd } from "react-icons/md";
import Avatar from "../components/Avatar";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  userName,
  mobileOpen,
  setMobileOpen,
  notifications = [],
}) => {
  const navigate = useNavigate();

  const handleNavigation = (tabKey) => {
    setActiveTab(tabKey);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all stored user info
    navigate("/"); // Redirect to home
    window.location.reload();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navigationItems = [
    { name: "Profile", icon: <AiOutlineUser />, key: "ParentProfile" },
    { name: "Post Jobs", icon: <MdPostAdd />, key: "ParentPostJob" },
    {
      name: "Jobs & Responses",
      icon: <AiOutlineFileText />,
      key: "ParentJobsResponses",
    },
    {
      name: "Explore Mentors",
      icon: <AiOutlineSearch />,
      key: "ExploreMentors",
    },
    { name: "Notifications", icon: <AiOutlineBell />, key: "Notifications" },
  ];

  return (
    <>
      <div className="md:hidden px-4 py-2 bg-white shadow-sm flex justify-start">
        <button onClick={() => setMobileOpen(true)}>
          <AiOutlineMenu className="text-2xl text-gray-800" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-opacity-40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed bg-white shadow-xl z-50 h-screen flex flex-col
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-3 py-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Avatar name={userName} size={42} />
              <div>
                <h2 className="font-semibold text-gray-900">{userName}</h2>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          )}
          <button className="md:hidden" onClick={() => setMobileOpen(false)}>
            <AiOutlineClose className="text-xl" />
          </button>
          <button
            className="hidden md:block"
            onClick={() => setCollapsed(!collapsed)}
          >
            <AiOutlineMenu
              className={`text-xl transition-transform ${
                collapsed ? "" : "rotate-180"
              }`}
            />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.key}
              onClick={() => handleNavigation(item.key)}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 transition
                ${
                  activeTab === item.key
                    ? "bg-indigo-100 text-indigo-700 font-bold"
                    : "text-gray-700 hover:bg-gray-100"
                }
                ${collapsed ? "justify-start" : ""}`}
            >
              <span className="text-lg relative">
                {item.icon}
                {item.key === "Notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </span>
              {!collapsed && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
          >
            <span className="text-lg">🔓</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
