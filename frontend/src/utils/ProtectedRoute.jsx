import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 1️⃣ Not logged in → send them to login
  if (!token) {
    return <Navigate to="/parent-signin" replace />;
  }

  // 2️⃣ Logged in but not allowed role → redirect based on actual role
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "parent") return <Navigate to="/ParentDashboard" replace />;
    if (role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (role === "mentor") return <Navigate to="/mentor-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  // 3️⃣ Allowed → show child pages
  return <Outlet />;
};

export default ProtectedRoute;
