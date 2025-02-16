import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";

const useNotifications = (userId, guestId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:8080/notificationHub")
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("Connected to NotificationHub"))
      .catch(err => console.error("SignalR Connection Error:", err));

    connection.on("ReceiveNotification", (message) => {
      setNotifications((prev) => [...prev, message]);
      toast.info(message);
    });

    return () => {
      connection.stop();
    };
  }, [userId, guestId]);

  return notifications;
};

export default useNotifications;