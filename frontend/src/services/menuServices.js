import axios from "axios";

// Update API_URL to match the backend port you're running
const API_URL = "https://localhost:8080/api/menuCategory"; 

// Create a new category
export const createMenuCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating menu category:", error);
    throw error;
  }
};

// Get all categories
export const getAllMenuCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu categories:", error);
    throw error;
  }
};

// Get a specific category by ID
export const getMenuCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching menu category by ID:", error);
    throw error;
  }
};

// Update a category by ID
export const updateMenuCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error updating menu category:", error);
    throw error;
  }
};

// Delete a category by ID
export const deleteMenuCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting menu category:", error);
    throw error;
  }
};
