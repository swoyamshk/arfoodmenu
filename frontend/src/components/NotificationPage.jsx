import useNotifications from "../services/useNotification";

const NotificationsPage = ({ userId, guestId }) => {
  const notifications = useNotifications(userId, guestId);

  return (
    <div className="fixed top-4 right-4 bg-white shadow-md p-3 rounded-md">
      {notifications.map((notification, index) => (
        <div key={index} className="p-2 border rounded bg-blue-100 text-blue-800 mb-2">
          <p>{notification}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
