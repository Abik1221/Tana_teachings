import React from 'react';

const DashboardStats = ({ stats, profile, setActiveSection }) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800">Welcome back, {profile.name}!</h2>
            <p className="text-gray-600 text-sm lg:text-base">Here's your overview on Tana Tetoural platform</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-gray-500">Mentor since Jan 2024</p>
            <p className="text-gray-600 font-semibold text-sm lg:text-base">Verified Mentor</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-500">Active Students</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 lg:mt-2">{stats.totalStudents}</p>
            </div>
            <div className="text-lg lg:text-2xl text-gray-600 font-bold w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-500">Pending Applications</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 lg:mt-2">{stats.pendingApplications}</p>
            </div>
            <div className="text-lg lg:text-2xl text-gray-600 font-bold w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
              📋
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-500">Jobs Applied</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 lg:mt-2">{stats.jobsApplied}</p>
            </div>
            <div className="text-lg lg:text-2xl text-gray-600 font-bold w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
              💼
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-4 lg:p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-semibold text-gray-500">Monthly Earnings</p>
              <p className="text-2xl lg:text-3xl font-bold text-gray-800 mt-1 lg:mt-2">{stats.monthlyEarnings.toLocaleString()} ETB</p>
            </div>
            <div className="text-lg lg:text-2xl text-gray-600 font-bold w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center">
              ETB
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Job Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <button 
              onClick={() => setActiveSection('jobfinder')}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 lg:py-4 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 text-center text-sm lg:text-base"
            >
              Find Jobs
            </button>
            <button 
              onClick={() => setActiveSection('profile')}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 lg:py-4 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 text-center text-sm lg:text-base"
            >
              Update Profile
            </button>
            <button 
              onClick={() => setActiveSection('students')}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 lg:py-4 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 text-center text-sm lg:text-base"
            >
              My Students
            </button>
            <button 
              onClick={() => setActiveSection('applications')}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 lg:py-4 px-3 lg:px-4 rounded-lg lg:rounded-xl transition-all duration-300 text-center text-sm lg:text-base"
            >
              View Applications
            </button>
          </div>
        </div>

        {/* Job Alerts */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-800">Recent Job Matches</h3>
            <span className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
              {stats.jobsApplied} jobs
            </span>
          </div>
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm lg:text-base truncate">Web Development Mentor Needed</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs lg:text-sm text-gray-600 mt-1">
                  <span className="truncate">EthioTech Academy</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate">Addis Ababa</span>
                </div>
              </div>
              <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ml-2 bg-gray-100 text-gray-800 border border-gray-300">
                Apply
              </span>
            </div>
            <div className="flex items-center justify-between p-3 lg:p-4 border border-gray-200 rounded-lg lg:rounded-xl">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm lg:text-base truncate">Python Data Science Tutor</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs lg:text-sm text-gray-600 mt-1">
                  <span className="truncate">Data Science Ethiopia</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="truncate">Remote</span>
                </div>
              </div>
              <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ml-2 bg-gray-100 text-gray-800 border border-gray-300">
                Applied
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;