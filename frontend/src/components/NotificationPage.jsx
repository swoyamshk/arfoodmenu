import { useEffect, useState } from "react";

const NotificationPage = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
const userId = localStorage.getItem("userId");
  useEffect(() => {
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

    // Fetch existing notifications from MongoDB or local storage
    if (userId) {
      fetch(`${process.env.REACT_APP_BASE_URL}/api/notifications/${userId}`)
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch(console.error);
    } else {
      const localNotifications = JSON.parse(localStorage.getItem("notifications") || "[]");
      setNotifications(localNotifications);
    }
  }, [userId, socket]);

  return (
    <div className="fixed top-4 right-4">
      {notifications.map((notif) => (
        <div key={notif.id} className="p-2 bg-green-500 text-white rounded mb-2">
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;