import React, { useState } from "react";
import { Menu, X } from "lucide-react";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "ParentDashboard", label: "ParentDashboard" },
    { id: "ParentJobsResponses", label: "View & Manage Posted Jobs" },
    { id: "applications", label: "Tutor Applications" },
  ];

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow">
        <h2 className="text-xl font-bold text-indigo-700">Dashboard</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          bg-white shadow-md p-6 space-y-6
          md:w-64 md:block
          fixed md:static top-0 left-0 h-full z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        <h2 className="text-2xl font-bold text-indigo-700 mb-8 hidden md:block">
          Dashboard
        </h2>
        <ul className="space-y-3 relative">
          {menuItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpen(false); // close on mobile
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition flex items-center ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {item.label}
              </button>
              {/* Active Indicator */}
              {activeTab === item.id && (
                <span className="absolute left-0 top-0 h-full w-1 bg-indigo-600 rounded-tr-lg rounded-br-lg transition-all duration-300"></span>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
