import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// ===== AUTH REQUESTS =====
export const registerUser = async (userData) => {
  return await API.post("/auth/register", userData);
};

export const loginUser = async (userData) => {
  return await API.post("/auth/login", userData);
};

export const getMe = async (token) => {
  return await API.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
};
