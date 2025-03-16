import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation

const NotificationPage = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token"); // Check for authentication
  const navigate = useNavigate(); // For redirecting to login

  useEffect(() => {
    // Only set up WebSocket and fetch notifications if logged in
    if (token && userId) {
      // Connect WebSocket and listen for messages
      if (socket) {
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.userId === userId) {
            setNotifications((prev) => [...prev, { id: Date.now(), message: data.message }]);
          }
        };

        socket.onerror = (error) => console.error("WebSocket Error:", error);
      }

      // Fetch existing notifications from MongoDB
      fetch(`${process.env.REACT_APP_BASE_URL}/api/notifications/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch(console.error);
    } else {
      // If not logged in, set empty notifications or local ones if you want to keep that feature
      const localNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      setNotifications(localNotifications);
    }
  }, [userId, token, socket]); // Added token to dependencies

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
              You need to be logged in to view your notifications.
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

  return (
    <div className="w-full min-h-screen flex flex-col bg-white">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-20">
        <h1 className="text-2xl font-bold mb-6 px-4 md:px-6">Your Notifications</h1>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500">No notifications yet.</p>
        ) : (
          <div className="space-y-2 px-4 md:px-6">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-2 bg-green-500 text-white rounded">
                {notif.message}
              </div>
            ))}
          </div>
        )}
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
};

export default NotificationPage;