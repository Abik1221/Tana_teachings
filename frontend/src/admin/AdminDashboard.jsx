// src/admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  BarChart2,
  Users,
  Briefcase,
  FileText,
  ClipboardList,
  Menu,
  X,
} from "lucide-react";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";

import OverviewSection from "./sections/OverviewSection";
import UsersSection from "./sections/UsersSection";
import JobsSection from "./sections/JobsSection";
import ApplicationsSection from "./sections/ApplicationsSection";
import ReportsSection from "./sections/ReportsSection";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true); // expanded by default
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "users":
        return <UsersSection />;
      case "jobs":
        return <JobsSection />;
      case "applications":
        return <ApplicationsSection />;
      case "reports":
        return <ReportsSection />;
      default:
        return <OverviewSection />;
    }
  };

  const menuItems = [
    { label: "Overview", icon: <BarChart2 /> },
    { label: "Users", icon: <Users /> },
    { label: "Jobs", icon: <Briefcase /> },
    { label: "Applications", icon: <FileText /> },
    { label: "Reports", icon: <ClipboardList /> },
  ];

  // Admin info
  const admin = {
    name: localStorage.getItem("fullName") || "Admin User",
    email: localStorage.getItem("email") || "admin@example.com",
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside
        className={`bg-white shadow-lg fixed inset-y-0 left-0 z-50
          flex flex-col justify-between transition-all duration-300
          ${sidebarOpen ? "w-56" : "w-20"} hidden md:flex`}
      >
        {/* Header with avatar to collapse */}
        <div
          className="flex items-center justify-between p-4 border-b cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <h2 className="font-bold text-lg text-indigo-600">Admin</h2>
          ) : (
            <TbLayoutSidebarRightCollapse
              size={24}
              className="text-indigo-600"
            />
          )}
        </div>

        {/* Menu */}
        <nav className="flex flex-col mt-4 space-y-2 flex-1">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              isActive={activeSection === item.label.toLowerCase()}
              onClick={() => setActiveSection(item.label.toLowerCase())}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* Footer admin info */}
        <div className="flex items-center p-4 border-t">
          <img
            src={`https://ui-avatars.com/api/?name=${admin.name}&background=5B21B6&color=fff`}
            alt="Admin"
            className={`w-10 h-10 rounded-full transition-all duration-300 ${
              sidebarOpen ? "" : "mx-auto"
            }`}
          />
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden fixed top-0 left-0 right-5 bg-white shadow-md z-50 flex items-center justify-between px-4 py-2">
        <h2 className="font-bold text-indigo-600">Admin</h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-y-0 left-0 w-56 z-50 bg-white shadow-md h-screen flex flex-col border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-bold text-indigo-600">Admin</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X />
            </button>
          </div>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setActiveSection(item.label.toLowerCase());
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 p-3 transition-all w-full text-left
                ${
                  activeSection === item.label.toLowerCase()
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
          {/* Mobile footer */}
          <div className="flex items-center p-4 mt-auto border-t">
            <img
              src={`https://ui-avatars.com/api/?name=${admin.name}&background=5B21B6&color=fff`}
              alt="Admin"
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium">{admin.name}</p>
              <p className="text-xs text-gray-500 truncate">{admin.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0  opacity-40 md:hidden z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main
        className="flex-1 mr-5 mt-12 md:mt-10 overflow-y-auto  transition-all"
        style={{
          marginLeft: window.innerWidth >= 768 ? (sidebarOpen ? 280 : 100) : 10,
        }}
      >
        {renderSection()}
      </main>
    </div>
  );
}

function SidebarItem({ label, icon, isActive, onClick, sidebarOpen }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-3 transition-all duration-300 rounded-lg w-full
        ${
          isActive
            ? "bg-indigo-600 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-200"
        }`}
    >
      {icon}
      {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}
