class NotificationService {
    constructor(userId) {
      this.socket = new WebSocket(" wss://echo.websocket.org"); // Your WebSocket server
      this.userId = userId;
    }
  
    connect(setNotifications) {
      this.socket.onopen = () => console.log("Connected to WebSocket");
  
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data); // Parse incoming JSON
      
          console.log("Received WebSocket message:", data); // Debugging
      
          if (this.userId && data.message) {
            this.saveNotification(this.userId, data.message); // Pass only the message string
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };
      
      
      
  
      this.socket.onerror = (error) => console.error("WebSocket Error:", error);
    }
  
    async saveNotification(userId, message) {
      console.log("Saving notification with:", userId, message); // Debugging
    
      if (!userId || !message) {
        console.error("Missing userId or message");
        return;
      }
    
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/notifications/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, message }) // Ensure message is a plain string
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error saving notification:", errorData);
        } else {
          console.log("Notification saved successfully!");
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
    
      
      
  }
  
  export default NotificationService;