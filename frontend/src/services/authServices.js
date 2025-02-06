import axios from "axios";

// Update API_URL to match the backend port you're running
const API_URL = "https://localhost:8080/api/auth"; // Correct port is 44300

export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};


