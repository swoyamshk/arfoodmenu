import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Bell, Home, ShoppingCart, User } from "lucide-react";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token && userId) {
      fetchNotifications();
    }
  }, [userId, token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/notifications/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      const data = await response.json();
      // Sort notifications by date, most recent first
      const sortedNotifications = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If not logged in, show login message
  if (!token || !userId) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 flex items-center justify-center pb-20">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg">
            <Bell className="mx-auto mb-4 text-blue-500" size={64} />
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              Login Required
            </h1>
            <p className="text-gray-600 mb-6">
              Please log in to view your notifications.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 shadow-md"
            >
              Go to Login
            </button>
          </div>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
          <div className="max-w-4xl mx-auto flex justify-around">
            <button onClick={() => navigate('/')} className="flex flex-col items-center">
              <Home className="text-gray-500" />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => navigate('/cart')} className="flex flex-col items-center">
              <ShoppingCart className="text-gray-500" />
              <span className="text-xs">Cart</span>
            </button>
            <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
              <User className="text-gray-500" />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 pb-20">
        <div className="flex items-center mb-6 px-4 md:px-6">
          <Bell className="mr-3 text-blue-500" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">Your Notifications</h1>
        </div>
        
        {notifications.length === 0 ? (
          <div className="text-center bg-white p-6 rounded-xl shadow-md">
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-4 px-4 md:px-6">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500 flex items-start"
              >
                <div className="flex-grow">
                  <p className="text-gray-800 mb-2">{notif.message}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="mr-2" size={16} />
                    <span>{formatDate(notif.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Fixed bottom navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-2">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button onClick={() => navigate('/')} className="flex flex-col items-center">
            <Home className="text-gray-500" />
            <span className="text-xs">Home</span>
          </button>
          <button onClick={() => navigate('/cart')} className="flex flex-col items-center">
            <ShoppingCart className="text-gray-500" />
            <span className="text-xs">Cart</span>
          </button>
          <button onClick={() => navigate('/profile')} className="flex flex-col items-center">
            <User className="text-gray-500" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default NotificationPage;