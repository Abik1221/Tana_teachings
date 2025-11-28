import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { registerUser } from "../services/api";

const ParentSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // For password show/hide
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Error highlighting state
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // ===== GOOGLE SIGNUP =====
  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    showToast("Signing up with Google...", "success");

    try {
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: response.credential }),
      });

      const data = await res.json();
      if (data.success) showToast("✅ Google signup successful!");
      showToast("Google signup failed", "error");
    } catch (err) {
      console.error(err);
      showToast("Google signup error", "error");
    }
  };

  // ===== INPUT CHANGE =====
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // remove error when typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ===== FORM SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Please fix the errors below", "error");
      return;
    }

    // START LOADING
    setLoading(true);

    try {
      await registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      });

      showToast("Registered successfully!", "success");

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "❌ Registration failed");
    }

    // STOP LOADING
    setLoading(false);
    navigate("/parent-signin");
  };
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  // ==================== UI ====================
  return (
    <>
      {/* Toast is here */}
      {toast.show && (
        <div
          className={`fixed top-5 right-5 px-4 py-3 rounded-lg shadow-lg text-white z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="w-2xl  bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
          <div className="text-center mb-6">
            <UserPlus size={50} className="text-indigo-600 mx-auto mb-2" />
            <h2 className="text-3xl font-extrabold text-gray-800">
              Parent Sign Up
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Create your parent account to get started
            </p>
          </div>

          {/* Custom Google Button */}
          <button
            onClick={() => google.accounts.id.prompt()}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 mb-5"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              className="w-5 h-5"
              alt="Google"
            />
            Sign Up with Google
          </button>

          <div className="flex items-center mb-5">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg  ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg  ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="09XXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg  ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              <div className="relative">
                <MapPin
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="address"
                  placeholder="City / Subcity / Woreda"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg  ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg  ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 rounded-lg  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <hr className="flex-grow border-gray-300" />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition flex justify-center items-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* SIGN IN LINK */}
          <div className="text-center mt-4">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <a
                href="/parent-signin"
                className="text-indigo-600 font-semibold hover:underline"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParentSignup;
