"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/buttons";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllDishes, getAllRestaurants } from "../services/dishServices";
import DishCard from "../components/DishCard";

// Simple icon components (unchanged)
const PizzaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10" />
  </svg>
);

const BurgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CoffeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
  </svg>
);

const SlidersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </svg>
);

// Login Popup Component
const LoginPopup = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-6">
          You need to login to add dishes to your favorites list.
        </p>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </Button>
          <Button
            onClick={onLogin}
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function FoodApp() {
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showLoginPopup, setShowLoginPopup] = useState(false); // Control popup visibility

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantData = await getAllRestaurants();
        setRestaurants(restaurantData);
        const dishData = await getAllDishes(selectedRestaurant || null);
        setDishes(dishData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedRestaurant]);

  const handlePizzaClick = () => {
    navigate("/ar-view");
  };

  const handleAddToFavorites = (dish) => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      // Add your favorites logic here
      console.log(`Added ${dish.name} to favorites`);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginPopup(false);
    navigate("/login"); // Assuming you have a login route
  };

  const categories = [
    { icon: <PizzaIcon />, name: "Pizza", color: "bg-orange-100 text-orange-500" },
    { icon: <BurgerIcon />, name: "Burger", color: "bg-rose-100 text-rose-500" },
    { icon: <CoffeeIcon />, name: "Drinks", color: "bg-blue-100 text-blue-500" },
    { icon: <PizzaIcon />, name: "Sushi", color: "bg-purple-100 text-purple-500" },
  ];

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 max-w-4xl mx-auto w-full pb-20">
        <header className="flex flex-wrap justify-between items-center mb-6 px-4 md:px-6">
          <div>
            <h1 className="text-2xl font-bold">Hello,</h1>
            <p className="text-gray-500">What you want to eat today?</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-400 overflow-hidden">
            <img src="/logo192.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </header>

        <div className="flex flex-wrap gap-2 items-center mb-6 px-4 md:px-6">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              placeholder="Search for Food"
              className="pl-8 pr-4 py-3 rounded-xl bg-gray-100 border-none w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          <select
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-100 border-none min-w-[150px]"
          >
            <option value="">All Restaurants</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.id}>
                {restaurant.name}
              </option>
            ))}
          </select>
          <Button variant="default" className="px-4 rounded-xl bg-orange-500 hover:bg-orange-600">
            <SlidersIcon />
          </Button>
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2 px-4 md:px-6">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${category.color} whitespace-nowrap`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-6">
          {filteredDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              onClick={handlePizzaClick}
              onAddToFavorites={() => handleAddToFavorites(dish)} // Pass favorites handler
            />
          ))}
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button className="p-2">Home</button>
          <button className="p-2">Cart</button>
          <button className="p-2">Profile</button>
        </div>
      </nav>

      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        onLogin={handleLoginRedirect}
      />
    </div>
  );
}