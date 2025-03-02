import { useEffect, useState } from "react";
import { getFavoriteDishes } from "../services/favouritesServices";
import { getDishById } from "../services/dishServices"; // Adjust import path
import DishCard from "../components/DishCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]); // Will store full dish objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Step 1: Fetch favorite records
        const favoriteRecords = await getFavoriteDishes(userId);
        console.log("FavoritesPage - Fetched favorite records:", favoriteRecords);

        if (!favoriteRecords || favoriteRecords.length === 0) {
          setFavorites([]);
          return;
        }

        // Step 2: Fetch dish details for each dishId
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
  }, [userId]); // Added userId as dependency in case it changes

  if (loading) return <p className="text-center text-gray-500">Loading favorites...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  console.log("FavoritesPage - Rendering favorites:", favorites);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white min-h-screen">
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
  );
}