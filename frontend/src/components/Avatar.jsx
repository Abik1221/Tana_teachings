import React from "react";

const Avatar = ({
  name = "",
  size = 40,
  onClick = () => {},
  className = "",
}) => {
  // Generate initials
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names
      .map((n) => n[0].toUpperCase())
      .join("")
      .slice(0, 2);
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition duration-150 ${className}`}
      style={{ width: size, height: size }}
    >
      {getInitials(name)}
    </button>
  );
};

export default Avatar;
