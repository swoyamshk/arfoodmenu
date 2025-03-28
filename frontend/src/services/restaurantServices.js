// services/restaurantServices.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BASE_URL}`;

export const getRestaurants = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/restaurant`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};