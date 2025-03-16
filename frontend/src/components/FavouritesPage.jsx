import { useEffect, useState } from "react";
import { getFavoriteDishes } from "../services/favouritesServices";
import { getDishById } from "../services/dishServices";
import DishCard from "../components/DishCard";
import { useNavigate } from "react-router-dom"; // Added for navigation

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Check for authentication
  const navigate = useNavigate(); // For redirecting to login

  useEffect(() => {
    // Only fetch favorites if user is logged in
    if (token && userId) {
      const fetchFavorites = async () => {
        try {
          const favoriteRecords = await getFavoriteDishes(userId);
          console.log("FavoritesPage - Fetched favorite records:", favoriteRecords);

          if (!favoriteRecords || favoriteRecords.length === 0) {
            setFavorites([]);
            return;
          }

          const dishPromises = favoriteRecords.map((favorite) =>
            getDishById(favorite.dishId)
          );
          const dishes = await Promise.all(dishPromises);
          console.log("FavoritesPage - Fetched dishes:", dishes);

          setFavorites(dishes);
        } catch (err) {
          setError("Failed to load favorites.");
          console.error("FavoritesPage - Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchFavorites();
    } else {
      setLoading(false); // No need to keep loading if not logged in
    }
  }, [userId, token]); // Added token as dependency

  // If not logged in, show login message
  if (!token || !userId) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-white">
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex items-center justify-center pb-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Login Required
            </h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to view your favorite dishes.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Go to Login
            </button>
          </div>
        </div>
        {/* Fixed bottom navbar */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button className="p-2">Home</button>
            <button className="p-2">Cart</button>
            <button className="p-2">Profile</button>
          </div>
        </nav>
      </div>
    );
  }

  if (loading) return <p className="text-center text-gray-500">Loading favorites...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  console.log("FavoritesPage - Rendering favorites:", favorites);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-6">Your Favorite Dishes</h1>
        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">You haven’t added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-6">
            {favorites.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
 
    </div>
  );
}