using Microsoft.AspNetCore.SignalR;

public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        string connectionId = Context.ConnectionId;
        string userId = Context.UserIdentifier ?? "Guest";

        Console.WriteLine($"SignalR Connected - ConnectionId: {connectionId}, UserId: {userId}");
        _logger.LogInformation($"SignalR Connected - ConnectionId: {connectionId}, UserId: {userId}");

        await base.OnConnectedAsync();
    }


    public override async Task OnDisconnectedAsync(Exception exception)
    {
        string connectionId = Context.ConnectionId;
        string userId = Context.UserIdentifier ?? "Guest";

        if (exception != null)
        {
            Console.WriteLine($" SignalR Disconnected - ConnectionId: {connectionId}, UserId: {userId}, Reason: {exception.Message}");
            _logger.LogWarning($" SignalR Disconnected - ConnectionId: {connectionId}, UserId: {userId}, Reason: {exception.Message}");
        }
        else
        {
            Console.WriteLine($"SignalR Disconnected - ConnectionId: {connectionId}, UserId: {userId}");
            _logger.LogInformation($" SignalR Disconnected - ConnectionId: {connectionId}, UserId: {userId}");
        }

        await base.OnDisconnectedAsync(exception);
    }
}