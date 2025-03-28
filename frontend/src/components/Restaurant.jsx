import { useState } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_URL}/api/restaurant`;

const CreateRestaurantPage = () => {
  const [newRestaurant, setNewRestaurant] = useState({
    id:1,
    name: "",
    address: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await axios.post(API_URL, newRestaurant);
      
      setSuccess(`Restaurant "${response.data.name}" created successfully with ID: ${response.data.id}`);
      setNewRestaurant({ name: "", address: "", description: "" });
    } catch (err) {
      setError("Failed to create restaurant: " + (err.response?.data || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-2xl font-bold mb-5">Create New Restaurant</h1>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <form onSubmit={handleCreateRestaurant} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Restaurant Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter restaurant name"
              value={newRestaurant.name}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={newRestaurant.address}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description (optional)"
              value={newRestaurant.description}
              onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {loading ? "Creating..." : "Create Restaurant"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-red-500 text-sm">{error}</p>
        )}
        {success && (
          <p className="mt-3 text-green-500 text-sm">{success}</p>
        )}
      </div>
    </div>
  );
};

export default CreateRestaurantPage;