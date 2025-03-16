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
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || !dish?.id) {
      return;
    }
    const checkFavorite = async () => {
      try {
        const favorites = await getFavoriteDishes(userId);
        const favorite = favorites.find((f) => f.dishId === dish.id);
        setIsFavorite(!!favorite);
        setFavoriteId(favorite ? favorite.id : null);
      } catch (error) {
        console.error("Error checking favorite:", error.response?.data || error.message);
      }
    };
    checkFavorite();
  }, [dish?.id, userId]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("You need to log in to save favorites.");
      navigate("/login");
      return;
    }
    if (!dish?.id) {
      toast.error("Invalid dish ID.");
      return;
    }
    try {
      if (isFavorite) {
        await removeFavoriteDish(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success(`${dish.name} removed from favorites!`);
      } else {
        const newFavorite = await addFavoriteDish(userId, dish.id);
        setIsFavorite(true);
        setFavoriteId(newFavorite.id);
        toast.success(`${dish.name} added to favorites!`);
      }
    } catch (error) {
      console.error("Error updating favorites:", error.response?.data || error.message);
      toast.error("Failed to update favorites.");
    }
  };

  const handleClick = () => {
    navigate(`/dish/${dish.id}`, { state: { dish } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`);
  };

  const handleEyeClick = (e) => {
    e.stopPropagation();
    if (dish.arModelFileId) {
      navigate(`/webxr/${dish.id}`, { state: { dish } });
    } else {
      toast.error("No 3D model available for this dish");
    }
  };

  return (
    <div
      className="p-3 rounded-2xl shadow-md cursor-pointer bg-white"
      onClick={handleClick}
    >
      <div className="relative mb-3">
        <img
          src={getImageUrl(dish.imageFileId)}
          alt={dish.name}
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
      </div>
      <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
      {dish.restaurantName && (
        <p className="text-xs text-gray-400 mb-2">From: {dish.restaurantName}</p>
      )}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{dish.description}</p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="font-bold text-base sm:text-lg mb-2 sm:mb-0">
          $ {dish.price.toFixed(2)}
        </span>
        <div className="flex flex-wrap gap-2">
          <Button
            size="icon"
            className={`rounded-full h-8 w-8 ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
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