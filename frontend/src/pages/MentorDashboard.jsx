import React from 'react'

const MentorDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Simple Message Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100">
          <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg">
            📊
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Mentor Dashboard
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-8"></div>
          <p className="text-3xl text-gray-700 mb-8 leading-relaxed">
            This page will be developed in the next phase
          </p>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            We're working on creating an amazing dashboard experience for our mentors. 
            Stay tuned for updates!
          </p>
          <button 
            onClick={() => alert('Dashboard coming soon!')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl"
          >
            Notify Me When Ready
          </button>
        </div>
      </div>
    </div>
  )
}

export default MentorDashboard