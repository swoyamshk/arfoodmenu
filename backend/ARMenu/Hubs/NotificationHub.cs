using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class NotificationHub : Hub
{
    public async Task SendOrderNotification(string userId, string message)
    {
        if (!string.IsNullOrEmpty(userId))
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }
        else
        {
            await Clients.All.SendAsync("ReceiveNotification", message); // Send to all if guest
        }
    }
}