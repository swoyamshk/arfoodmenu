import axios from "axios";

// Update API_URL to match the backend port you're running
const API_URL = "https://localhost:8080/api/dish"; // Adjust to your backend port

// Create a new dish
export const createDish = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating dish:", error.response?.data || error.message);
    throw error;
  }
};
// Get all dishes
export const getAllDishes = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes:", error);
    throw error;
  }
};

// Get a specific dish by ID
export const getDishById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish by ID:", error);
    throw error;
  }
};

// Update a dish by ID
export const updateDish = async (id, dishData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, dishData);
    return response.data;
  } catch (error) {
    console.error("Error updating dish:", error);
    throw error;
  }
};

// Delete a dish by ID
export const deleteDish = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting dish:", error);
    throw error;
  }
};
