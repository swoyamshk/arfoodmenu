import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from "../context/CartProvider";
import { toast } from 'react-toastify';
import { addFavoriteDish, getFavoriteDishes, removeFavoriteDish } from "../services/favouritesServices";
import { getImageUrl } from "../services/dishServices";

// Icons
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

const StarIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const API_URL = `${process.env.REACT_APP_BASE_URL}`


const DishDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Dish state
  const [dish, setDish] = useState(location.state?.dish);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  
  // Review states
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [hoveredRating, setHoveredRating] = useState(0);
  
  // User identification
  const userId = localStorage.getItem("userId");

  // Fetch dish details if not passed in state
  useEffect(() => {
    const fetchDishDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dishes/${id}`);
        const data = await response.json();
        setDish(data);
      } catch (error) {
        console.error('Error fetching dish details:', error);
        toast.error('Failed to load dish details');
      }
    };

    if (!dish) {
      fetchDishDetails();
    }
  }, [id, dish]);

  // Fetch favorites
  useEffect(() => {
    const checkFavorite = async () => {
      if (!userId || !dish?.id) return;

      try {
        const favorites = await getFavoriteDishes(userId);
        const favorite = favorites.find((f) => f.dishId === dish.id);
        setIsFavorite(!!favorite);
        setFavoriteId(favorite ? favorite.id : null);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkFavorite();
  }, [dish?.id, userId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!dish?.id) return;

      try {
        const response = await fetch(`${API_URL}/api/reviews/${dish.id}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [dish?.id]);

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
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
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites.");
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`);
  };

  // Handle 3D model view
  const handleEyeClick = () => {
    if (dish.arModelFileId) {
      navigate(`/webxr/${dish.id}`, { state: { dish } });
    } else {
      toast.error("No 3D model available for this dish");
    }
  };

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You need to log in to submit a review.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/reviews/${dish.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: newReview.rating,
          comment: newReview.comment,
          dishId: dish.id,
          userId: userId
        })
      });

      if (response.ok) {
        const addedReview = await response.json();
        setReviews([...reviews, addedReview]);
        setNewReview({ rating: 0, comment: "" });
        toast.success("Review submitted successfully!");
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    }
  };

  // If dish is not found
  if (!dish) {
    return (
      <div className="p-5 text-gray-500 text-center">
        Dish not found!
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl shadow-md max-w-lg mx-auto">
      {/* Image Section */}
      <div className="relative mb-3">
        <img
          src={ getImageUrl(dish.imageFileId)}
          alt={dish.name}
          className="w-full h-60 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = "/placeholder.svg";
          }}
        />
      </div>

      {/* Dish Information */}
      <h1 className="font-semibold text-2xl mb-1">{dish.name}</h1>
      {dish.restaurantName && (
        <p className="text-xs text-gray-400 mb-2">
          From: {dish.restaurantName}
        </p>
      )}
      <p className="text-sm text-gray-500 mb-3 line-clamp-3">{dish.description}</p>

      {/* Dish Characteristics */}
      <div className="flex flex-wrap gap-2 mb-3">
        {dish.isSpicy && (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
            Spicy
          </span>
        )}
        {dish.isVegetarian && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Vegetarian
          </span>
        )}
      </div>

      {/* Ingredients Section */}
      {dish.ingredients && dish.ingredients.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Ingredients:</h3>
          <ul className="text-xs text-gray-600 flex flex-wrap gap-2">
            {dish.ingredients.map((ingredient, index) => (
              <li 
                key={index} 
                className="bg-gray-100 px-2 py-1 rounded-full"
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Price and Buttons Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <span className="font-bold text-lg sm:text-xl mb-2 sm:mb-0">
          $ {dish.price.toFixed(2)}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleToggleFavorite}
            className={`rounded-full h-8 w-8 flex items-center justify-center ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <HeartIcon filled={isFavorite} />
          </button>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 flex items-center justify-center h-8 sm:h-10"
          >
            <span className="text-sm sm:text-base mr-2">Add to Cart</span>
            <PlusIcon />
          </button>
          <button
            onClick={handleEyeClick}
            className="rounded-full bg-blue-500 hover:bg-blue-600 h-8 w-8 flex items-center justify-center"
          >
            <EyeIcon />
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-4">Reviews</h3>
        
        {/* Existing Reviews */}
        {reviews.length > 0 ? (
          <div className="space-y-3 mb-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-100 p-3 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon key={star} filled={star <= review.rating} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet</p>
        )}

        {/* Add Review Form */}
        <form onSubmit={handleSubmitReview} className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-md font-medium mb-3">Add Your Review</h4>
          <div className="flex items-center mb-3">
            <span className="mr-2 text-sm">Rating:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <StarIcon 
                    filled={
                      star <= (hoveredRating || newReview.rating)
                    } 
                  />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Write your review here..."
            className="w-full p-2 border rounded-lg text-sm mb-3"
            rows={3}
            required
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default DishDetails;