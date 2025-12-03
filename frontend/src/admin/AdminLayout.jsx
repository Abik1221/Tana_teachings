// src/admin/AdminLayout.jsx
import React, { useState } from "react";
import { Users, Briefcase, FileText, BarChart2, Menu, X } from "lucide-react";
import AdminDashboard from "./AdminDashboard";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Toggle sidebar for mobile
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2
            className={`font-bold text-lg text-indigo-600 ${
              sidebarOpen ? "" : "hidden"
            }`}
          >
            Admin
          </h2>
          <button className="sm:hidden" onClick={toggleSidebar}>
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        <nav className="flex flex-col mt-4 space-y-2">
          <SidebarItem
            label="Overview"
            icon={<BarChart2 />}
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            label="Users"
            icon={<Users />}
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            label="Jobs"
            icon={<Briefcase />}
            active={activeTab === "jobs"}
            onClick={() => setActiveTab("jobs")}
            sidebarOpen={sidebarOpen}
          />
          <SidebarItem
            label="Applications"
            icon={<FileText />}
            active={activeTab === "applications"}
            onClick={() => setActiveTab("applications")}
            sidebarOpen={sidebarOpen}
          />
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <AdminDashboard activeTab={activeTab} />
      </main>
    </div>
  );
};

const SidebarItem = ({ label, icon, active, onClick, sidebarOpen }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
      active ? "bg-indigo-600 text-white" : "hover:bg-gray-200 text-gray-700"
    }`}
  >
    {icon}
    {sidebarOpen && <span>{label}</span>}
  </button>
);

export default AdminLayout;
