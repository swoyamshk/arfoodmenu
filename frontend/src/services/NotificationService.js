class NotificationService {
  async saveNotification(userId, message) {
    console.log("Saving Notification - userId:", userId);
    console.log("Saving Notification - message:", message);

    if (!userId || !message) {
      console.error("Missing userId or message");
      throw new Error("UserId and message are required");
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/notifications/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId, 
          message 
        })
      });

      console.log("Notification Save Response:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving notification:", errorData);
        throw new Error(errorData.message || "Failed to save notification");
      }
      
      const result = await response.json();
      console.log("Notification Save Result:", result);
      
      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }
}

export default NotificationService;