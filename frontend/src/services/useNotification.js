import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_BASE_URL}/notificationHub`) // Ensure backend URL is correct
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information) // Enable logging
      .build();

    connection.start()
      .then(() => console.log("Connected to SignalR"))
      .catch((err) => console.error("SignalR Connection Failed:", err));

    connection.on("ReceiveNotification", (message) => {
      console.log("New notification received:", message); // Debugging
      setNotifications((prev) => [...prev, message]);
    });

    return () => {
      connection.stop();
    };
  }, [userId]);

  return notifications;
};

export default useNotifications;
