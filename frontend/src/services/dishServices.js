import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/dish`;
const RESTAURANT_API_URL = `${process.env.REACT_APP_BASE_URL}/api/restaurant`; 

// Create a new dish
export const createDish = async (formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating dish:", error.response?.data || error.message);
    throw error;
  }
};

// Get all dishes, optionally filtered by restaurantId
export const getAllDishes = async (restaurantId = null) => {
  try {
    const url = restaurantId
      ? `${API_URL}?restaurantId=${restaurantId}`
      : API_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching dishes:", error.response?.data || error.message);
    throw error;
  }
};

// Get all restaurants
export const getAllRestaurants = async () => {
  try {
    const response = await axios.get(RESTAURANT_API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error.response?.data || error.message);
    throw error;
  }
};

// Get a specific dish by ID
export const getDishById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dish by ID:", error.response?.data || error.message);
    throw error;
  }
};

// Get image URL for a dish
export const getImageUrl = (imageFileId) => {
  if (!imageFileId) return "/placeholder.jpg"; // Fallback image if no image ID is provided
  return `${API_URL}/image/${imageFileId}`;
};

// Update a dish by ID
export const updateDish = async (id, dishData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, dishData);
    return response.data;
  } catch (error) {
    console.error("Error updating dish:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a dish by ID
export const deleteDish = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting dish:", error.response?.data || error.message);
    throw error;
  }
};