// src/parents_info/ParentProfile.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Briefcase,
} from "lucide-react";
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

  useEffect(() => {
    const email = localStorage.getItem("email") || "";
    const fullName = localStorage.getItem("fullName") || "";
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

    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleSaveProfile = () => {
    if (!profile.fullName.trim()) return showError("Full Name required");
    if (!profile.phone.trim()) return showError("Phone required");
    if (!profile.address.trim()) return showError("Address required");

    localStorage.setItem("fullName", profile.fullName);
    localStorage.setItem("phone", profile.phone);
    localStorage.setItem("address", profile.address);

    showSuccess("Profile saved successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 mt-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Parent Profile</h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <img
            src={imagePreview || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border"
          />
          <label className="absolute bottom-1 right-1 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700">
            <Camera size={18} />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="flex items-center gap-2 font-semibold text-gray-700">
            <User size={18} />
            Full Name
          </span>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
          />
        </label>

        <label className="block">
          <span className="flex items-center gap-2 font-semibold text-gray-700">
            <Phone size={18} />
            Phone Number
          </span>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="flex items-center gap-2 font-semibold text-gray-700">
            <Mail size={18} />
            Email (Not Editable)
          </span>
          <input
            type="text"
            value={profile.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 shadow-sm cursor-not-allowed"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className="flex items-center gap-2 font-semibold text-gray-700">
            <MapPin size={18} />
            Address
          </span>
          <textarea
            rows={3}
            value={profile.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
          ></textarea>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => (window.location.href = "/parent/jobs")}
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Briefcase size={18} />
          My Posted Jobs
        </button>

        <button
          onClick={handleSaveProfile}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Save size={18} />
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default ParentProfile;
