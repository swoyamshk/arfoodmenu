import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateUserProfile, getUserProfile } from "../services/authServices"; // Assuming you've moved the API functions to a service file

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      navigate("/login"); // Redirect to login if not authenticated
    } else {
      setUserId(storedUserId);
      fetchUserProfile(storedUserId);
    }
  }, [navigate]);

  const fetchUserProfile = async (id) => {
    try {
      const user = await getUserProfile(id);
      setUsername(user.username);
      setEmail(user.email);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Failed to fetch profile.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token"); // Get stored JWT token
      const userId = localStorage.getItem("userId"); // Get stored user ID
      if (!token) {
        navigate("/login");
        return;
      }

      const updatedUser = await updateUserProfile(userId, { username, email });
      setMessage(updatedUser.message || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Update Profile</h2>
        {message && <p className="text-red-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="username">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
