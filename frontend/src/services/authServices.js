import axios from "axios";

// Update API_URL to match the backend port you're running
const API_URL = `${process.env.REACT_APP_BASE_URL}/api/auth`;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Backend Response:", response.data); // ✅ Log full response
    return response.data;
  } catch (error) {
    console.error("Backend Error:", error.response?.data || error.message);
    throw error;
  }
};



export const loginUser = async (userData) => {
  return await axios.post(`${API_URL}/login`, userData);
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const token = localStorage.getItem("token"); // Get the JWT token
    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await axios.put(`${API_URL}/update/${userId}`, userData, {
      headers: {
        "Content-Type": "application/json",
        // Ensure correct token is used
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};



export const getUserProfile = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch user profile");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
