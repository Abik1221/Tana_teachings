import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = localStorage.getItem("token");

  useEffect(() => {
    if (!isAuthenticated || storedUser?.role !== "admin") {
      navigate("/"); // redirect non-admin users
    }
  }, [storedUser, navigate, isAuthenticated]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-5">
        <h2 className="text-xl font-semibold dark:text-white">Admin Panel</h2>
        <nav className="mt-6 space-y-3">
          <button
            className="block w-full text-left py-2 px-3 rounded 
            hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            📊 Dashboard
          </button>
          <button
            className="block w-full text-left py-2 px-3 rounded 
            hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            👨‍👩‍👧 Manage Parents
          </button>
          <button
            className="block w-full text-left py-2 px-3 rounded 
            hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            🎓 Manage Mentors
          </button>
          <button
            className="block w-full text-left py-2 px-3 rounded 
            hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
          >
            📩 Applications
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="block w-full text-left py-2 px-3 text-red-600 font-semibold 
              hover:bg-red-100 rounded"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold dark:text-white">
          Welcome, {storedUser?.fullName}
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          Manage users, mentors, and system settings here.
        </p>

        {/* Dashboard items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-lg font-semibold dark:text-white">
              Total Parents
            </h3>
            <p className="text-2xl mt-4 dark:text-gray-300">150</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-lg font-semibold dark:text-white">
              Total Mentors
            </h3>
            <p className="text-2xl mt-4 dark:text-gray-300">45</p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
            <h3 className="text-lg font-semibold dark:text-white">
              Pending Applications
            </h3>
            <p className="text-2xl mt-4 dark:text-gray-300">12</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
