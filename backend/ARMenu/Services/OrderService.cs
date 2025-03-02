using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

public class OrderService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<OrderService> _logger;

    public OrderService(IHubContext<NotificationHub> hubContext, ILogger<OrderService> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task CreateOrder(string userId)
    {
        // Order creation logic
        _logger.LogInformation($"Order placed for user: {userId}");

        string message = "Your order has been placed successfully!";

        if (!string.IsNullOrEmpty(userId))
        {
            _logger.LogInformation($"Sending notification to user: {userId}");
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", message);
        }
        else
        {
            _logger.LogInformation("Sending notification to all users");
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}
