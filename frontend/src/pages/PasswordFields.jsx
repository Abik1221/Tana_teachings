import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordFields = ({ password, confirmPassword, onChange, errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-4">
      {/* Password */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter a strong password"
            className={`w-full pl-10 pr-10 py-2 rounded-lg ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
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
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="Re-enter your password"
            className={`w-full pl-10 pr-10 py-2 rounded-lg ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
        )}
      </div>
    </div>
  );
};

export default PasswordFields;
