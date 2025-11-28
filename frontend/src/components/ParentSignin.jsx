import React, { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginUserMock as loginUser } from "../services/mockApi";
import { showSuccess, showError } from "../utils/toast";

const ParentSignin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Email + Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);

      // Save dynamic user data
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("fullName", res.data.user.fullName);
      localStorage.setItem("role", res.data.user.role);
      localStorage.setItem("email", res.data.user.email);
      window.dispatchEvent(new Event("storage"));
      showSuccess("Login successful!");

      // Navigate based on dynamic role
      if (res.data.user.role === "parent") {
        navigate("/ParentDashboard");
      } else if (res.data.user.role === "admin") {
        navigate("/AdminDashboard");
      } else if (res.data.user.role === "mentor") {
        navigate("/MentorDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      showError(error.response?.data?.message || "Login failed");
    }
  };

  // Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await fetch("", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        showSuccess("Logged in with Google!");
        navigate("/ParentDashboard");
      } else {
        showError("Google login failed");
      }
    } catch {
      showError("Google login error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6 text-center">
          <LogIn size={48} className="text-indigo-600 mb-3" />
          <h2 className="text-3xl font-extrabold text-gray-800">
            Parent Sign In
          </h2>{" "}
          <p className="text-gray-500 mt-1 text-sm">
            Welcome back! Sign in to manage your family account.
          </p>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 py-3  rounded-lg focus:outline-none hover:border-b-indigo-500 transition"
              required
            />
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 py-3  rounded-lg   focus:outline-none hover:border-b-indigo-500 transition"
              required
            />
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>
          <div className="flex justify-start mt-3 text-sm">
            <a
              href="/forgot-password"
              className="text-indigo-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg"
          >
            Sign In with Email
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        {/* Google Login */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showError("Google login failed")}
          />
        </div>

        {/* Auth Footer */}
        <div className="text-center mt-5 text-sm text-gray-600">
          <p>
            Don’t have an account?{" "}
            <Link
              to="/parent-signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentSignin;
