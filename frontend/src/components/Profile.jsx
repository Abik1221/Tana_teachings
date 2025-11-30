import React from 'react';

const Profile = ({ 
  profile, 
  isEditing, 
  setIsEditing, 
  editForm, 
  handleEditChange, 
  handleImageUpload, 
  handleRemoveImage, 
  imagePreview,
  handleSave, 
  handleCancel, 
  stats 
}) => {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="bg-white rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">Mentor Profile</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-colors text-sm lg:text-base"
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            
          </div>
        </div>

        {!isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6 gap-4">
                <div className="relative">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-300 rounded-full flex items-center justify-center text-gray-700 text-2xl lg:text-4xl overflow-hidden">
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
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-800">{profile.name}</h3>
                  <p className="text-lg lg:text-xl text-gray-600 font-semibold">{profile.title}</p>
                  <div className="flex items-center gap-3 lg:gap-4 mt-1">
                    <p className="text-gray-600 text-sm lg:text-base">{profile.location}</p>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {profile.gender}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6 text-sm lg:text-base">{profile.bio}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">Contact Information</h4>
                  <p className="text-gray-600 mb-2 text-sm lg:text-base">{profile.email}</p>
                  <p className="text-gray-600 mb-2 text-sm lg:text-base">{profile.phone}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">Expertise Areas</h4>
                  <div className="flex flex-wrap gap-1 lg:gap-2">
                    {profile.expertise.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl lg:rounded-2xl p-4 lg:p-6">
              <h4 className="font-semibold text-gray-800 mb-3 lg:mb-4 text-sm lg:text-base">Mentorship Details</h4>
              <p className="text-gray-600 mb-2 text-sm lg:text-base"><strong>Hourly Rate:</strong> {profile.hourlyRate} ETB</p>
              <p className="text-gray-600 mb-3 lg:mb-4 text-sm lg:text-base"><strong>Languages:</strong> {profile.languages.join(', ')}</p>
              
              <h4 className="font-semibold text-gray-800 mb-3 text-sm lg:text-base">Profile Stats</h4>
              <div className="space-y-2 lg:space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Students Mentored</span>
                  <span className="text-gray-600 font-semibold text-sm lg:text-base">{stats.totalStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Rating</span>
                  <span className="text-gray-600 font-semibold text-sm lg:text-base">{stats.averageRating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">Response Rate</span>
                  <span className="text-gray-600 font-semibold text-sm lg:text-base">95%</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-6">
            {/* Improved Profile Photo Upload Section */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-4 text-sm lg:text-base">Profile Photo</h4>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Profile Image with Camera Icon Overlay */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-300">
                    {imagePreview || editForm.profileImage ? (
                      <img 
                        src={imagePreview || editForm.profileImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-2xl">👤</span>
                    )}
                  </div>
                  
                  {/* Camera Icon Overlay */}
                  <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors shadow-lg">
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                
                {/* Upload Controls */}
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors text-sm text-center">
                    
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    
                    {(imagePreview || editForm.profileImage) && (
                      <button
                        onClick={handleRemoveImage}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Recommended: Square image, 200x200 pixels, max 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  value={editForm.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="w-full mt-1 p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm lg:text-base"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => handleEditChange('gender', e.target.value)}
                  className="w-50px mt-1 p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm lg:text-base"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                value={editForm.bio}
                onChange={(e) => handleEditChange('bio', e.target.value)}
                className="w-full mt-1 p-2 lg:p-3 border border-gray-300 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm lg:text-base"
                rows={4}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-colors text-sm lg:text-base"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-lg lg:rounded-xl transition-colors text-sm lg:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;