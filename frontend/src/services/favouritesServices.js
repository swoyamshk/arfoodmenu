// services/dishServices.js
import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/dish`;
const FAVORITE_API_URL = `${process.env.REACT_APP_BASE_URL}/api/FavoriteDish`;



// Add a dish to favorites
export const addFavoriteDish = async (userId, dishId) => {
  try {
    const response = await axios.post(FAVORITE_API_URL, { userId, dishId });
    return response.data;
  } catch (error) {
    console.error("Error adding favorite dish:", error.response?.data || error.message);
    throw error;
  }
};

// Get all favorite dishes for a user
export const getFavoriteDishes = async (userId) => {
    try {
      const response = await axios.get(`${FAVORITE_API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite dishes:", error.response?.data || error.message);
      throw error;
    }
  };

  export const getDishesByIds = async (dishIds) => {
    try {
      const dishPromises = dishIds.map(id => axios.get(`${API_URL}/${id}`));
      const responses = await Promise.all(dishPromises);
      return responses.map(res => res.data);
    } catch (error) {
      console.error("Error fetching dish details:", error.response?.data || error.message);
      throw error;
    }
  };
// Remove a dish from favorites
export const removeFavoriteDish = async (favoriteId) => {
  try {
    const response = await axios.delete(`${FAVORITE_API_URL}/${favoriteId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing favorite dish:", error.response?.data || error.message);
    throw error;
  }
};