import { useNavigate } from "react-router-dom";
import { Button } from "./ui/buttons";
import { useCart } from "../context/CartProvider";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { addFavoriteDish, getFavoriteDishes, removeFavoriteDish } from "../services/favouritesServices";
import { getImageUrl } from "../services/dishServices";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M1 12s3-7 11-7 11 7 11 7-3 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const DishCard = ({ dish }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const userId = localStorage.getItem("userId"); // Fallback for testing

  console.log("DishCard - Initial User ID:", userId);
  console.log("DishCard - Dish Object:", dish);

  useEffect(() => {
    if (!userId || !dish?.id) {
      console.log("DishCard - Skipping useEffect: userId or dish.id missing");
      return;
    }

    console.log("DishCard - useEffect - User ID:", userId);
    console.log("DishCard - useEffect - Dish ID:", dish.id);

    const checkFavorite = async () => {
      try {
        console.log("DishCard - Checking favorites for User ID:", userId);
        const favorites = await getFavoriteDishes(userId);
        console.log("DishCard - Retrieved favorites:", favorites);
        const favorite = favorites.find(f => f.dishId === dish.id);
        console.log("DishCard - Found favorite:", favorite);
        setIsFavorite(!!favorite);
        setFavoriteId(favorite ? favorite.id : null);
      } catch (error) {
        console.error("DishCard - Error checking favorite:", error.response?.data || error.message);
      }
    };

    checkFavorite();
  }, [dish?.id, userId]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!userId) {
      console.log("DishCard - No userId, redirecting to login");
      toast.error("You need to log in to save favorites.");
      navigate("/login");
      return;
    }

    if (!dish?.id) {
      console.log("DishCard - Invalid dish ID");
      toast.error("Invalid dish ID.");
      return;
    }

    console.log("DishCard - Toggling favorite - Payload:", { userId, dishId: dish.id });

    try {
      if (isFavorite) {
        console.log("DishCard - Removing favorite with ID:", favoriteId);
        await removeFavoriteDish(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success(`${dish.name} removed from favorites!`);
      } else {
        console.log("DishCard - Adding favorite with User ID:", userId, "Dish ID:", dish.id);
        const newFavorite = await addFavoriteDish(userId, dish.id);
        console.log("DishCard - New favorite added:", newFavorite);
        setIsFavorite(true);
        setFavoriteId(newFavorite.id);
        toast.success(`${dish.name} added to favorites!`);
      }
    } catch (error) {
      console.error("DishCard - Error updating favorites:", error.response?.data || error.message);
      toast.error("Failed to update favorites.");
    }
  };

  const handleClick = () => {
    console.log("DishCard - Navigating to dish details with ID:", dish.id);
    navigate(`/dish/${dish.id}`, { state: { dish } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    console.log("DishCard - Adding to cart:", dish.name);
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`);
  };

  const handleEyeClick = () => {
    window.location.href = `${process.env.REACT_APP_WEBXR_URL}/webxr`;
  };

  return (
    <div className="p-3 rounded-2xl cursor-pointer shadow-md" onClick={handleClick}>
      <div className="relative mb-3">
        <img
          src={getImageUrl(dish.imageFileId)}
          alt={dish.name}
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => { e.target.src = "/placeholder.svg"; }}
        />
      </div>
      <h3 className="font-semibold">{dish.name}</h3>
      {dish.restaurantName && (
        <p className="text-xs text-gray-400">From: {dish.restaurantName}</p>
      )}
      <p className="text-sm text-gray-500 mb-2">{dish.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold">$ {dish.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <Button
            size="icon"
            className={`rounded-full h-8 w-8 ${isFavorite ? "bg-red-500 hover:bg-red-600" : "bg-gray-200 hover:bg-gray-300"}`}
            onClick={handleToggleFavorite}
          >
            <HeartIcon filled={isFavorite} />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-orange-500 hover:bg-orange-600 h-8 w-8"
            onClick={handleAddToCart}
          >
            <PlusIcon />
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-blue-500 hover:bg-blue-600 h-8 w-8"
            onClick={handleEyeClick}
          >
            <EyeIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
