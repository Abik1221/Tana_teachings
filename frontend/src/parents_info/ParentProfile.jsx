// src/parents_info/ParentProfile.jsx
import React, { useState, useEffect } from "react";
import { Camera, Save, User, Mail, Phone, MapPin, Edit, X } from "lucide-react";
import { showSuccess, showError } from "../utils/toast";

const ParentProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    address: "",
    email: "",
    photo: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fullName = localStorage.getItem("fullName") || "";
    const email = localStorage.getItem("email") || "";
    const phone = localStorage.getItem("phone") || "";
    const address = localStorage.getItem("address") || "";

    setProfile({ fullName, phone, address, email });
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfile((prev) => ({ ...prev, photo: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (
      !profile.fullName.trim() ||
      !profile.phone.trim() ||
      !profile.address.trim()
    ) {
      return showError("All fields are required except email.");
    }

    localStorage.setItem("fullName", profile.fullName);
    localStorage.setItem("phone", profile.phone);
    localStorage.setItem("address", profile.address);

    showSuccess("Profile updated successfully!");
    setIsEditing(false);
  };

  const cancelEdit = () => {
    const fullName = localStorage.getItem("fullName") || "";
    const email = localStorage.getItem("email") || "";
    const phone = localStorage.getItem("phone") || "";
    const address = localStorage.getItem("address") || "";

    setProfile({ fullName, phone, address, email });
    setIsEditing(false);
  };

  return (
    <div className="w-full text-gray-800 bg-gray-50 min-h-screen px-4 md:px-10 py-6">
      {/* Header */}
      <div className="relative mb-16">
        <div className="h-48 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg" />

        <div className="absolute left-8 -bottom-20 w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
          <img
            src={imagePreview || profile.photo || "/default-avatar.png"}
            alt="profile"
            className="w-full h-full object-cover"
          />

          {isEditing && (
            <label className="absolute bottom-2 right-2 bg-white shadow-lg cursor-pointer p-2 rounded-full hover:scale-110 transition-transform">
              <Camera size={20} className="text-indigo-600" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        {/* Header Name */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-indigo-700">
            {profile.fullName || "Your Name"}
          </h2>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              <Edit size={18} /> Edit Profile
            </button>
          )}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 font-medium">
              <User size={18} /> Full Name
            </label>
            <input
              disabled={!isEditing}
              type="text"
              value={profile.fullName}
              className={`w-full rounded-lg border px-3 py-2 ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
              }`}
              onChange={(e) => handleChange("fullName", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 font-medium">
              <Phone size={18} /> Phone Number
            </label>
            <input
              disabled={!isEditing}
              type="text"
              value={profile.phone}
              className={`w-full rounded-lg border px-3 py-2 ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
              }`}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 font-medium">
              <Mail size={18} /> Email (Not Editable)
            </label>
            <input
              type="text"
              value={profile.email}
              disabled
              className="w-full rounded-lg border bg-gray-100 px-3 py-2 cursor-not-allowed"
            />
          </div>

          {/* Address */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 font-medium">
              <MapPin size={18} /> Address
            </label>
            <textarea
              disabled={!isEditing}
              rows={3}
              value={profile.address}
              className={`w-full rounded-lg border px-3 py-2 ${
                !isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
              }`}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        {isEditing && (
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:bg-indigo-700"
            >
              <Save size={18} /> Save Changes
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-500"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParentProfile;
