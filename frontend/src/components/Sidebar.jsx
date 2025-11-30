import React from 'react';

const Sidebar = ({ profile, setActiveSection, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'jobfinder', label: 'Find Jobs', icon: '💼' },
    { id: 'profile', label: 'My Profile', icon: '👤' },
    { id: 'students', label: 'My Students', icon: '👥' },
    
  ];

  const handleMenuClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white p-4 fixed top-0 left-0 right-0 z-50 border-b border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 mr-3"
            >
              <span className="text-xl">☰</span>
            </button>
            <h1 className="text-lg font-bold">Tana Tetoural</h1>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm">
            {profile.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              profile.name.charAt(0)
            )}
          </div>
        </div>
      </div>

      <div className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-300 transition-transform duration-300 ease-in-out lg:transition-none`}>
        
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 p-6">
            {/* Platform Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Tana Tetoural</h1>
              <p className="text-sm text-gray-600">Mentor Platform</p>
            </div>

            {/* Profile Summary */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 overflow-hidden">
                {profile.profileImage ? (
                  <img 
                    src={profile.profileImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
              <h2 className="text-lg font-bold mb-1">{profile.name}</h2>
              <p className="text-sm mb-2">Mentor</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xs text-gray-600">{profile.location}</p>
                <span className="text-xs text-gray-600">
                  {profile.gender}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation - COMPLETELY PLAIN TEXT */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-0">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  style={{
                    background: 'transparent',
                    backgroundColor: 'transparent',
                    color: '#000000',
                    border: 'none',
                    boxShadow: 'none'
                  }}
                  className="w-full text-left py-2 px-3 flex items-center hover:bg-transparent"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;