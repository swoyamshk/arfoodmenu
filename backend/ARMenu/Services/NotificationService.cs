using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using ARMenu.Models;

public class NotificationService
{
    private readonly IMongoCollection<Notification> _notifications;

    public NotificationService(IMongoDatabase database)
    {
        _notifications = database.GetCollection<Notification>("Notifications");
    }

    public async Task CreateNotification(Notification notification)
    {
        await _notifications.InsertOneAsync(notification);
    }

    public async Task<List<Notification>> GetUserNotifications(string userId)
    {
        return await _notifications.Find(n => n.UserId == userId && !n.IsRead).ToListAsync();
    }

    public async Task MarkAsRead(string notificationId)
    {
        var filter = Builders<Notification>.Filter.Eq(n => n.Id, notificationId);
        var update = Builders<Notification>.Update.Set(n => n.IsRead, true);
        await _notifications.UpdateOneAsync(filter, update);
    }
}
