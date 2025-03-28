﻿using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/notifications")]
public class NotificationController : ControllerBase
{
    private readonly IMongoCollection<Notification> _notificationCollection;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(IMongoClient mongoClient, ILogger<NotificationController> logger)
    {
        var database = mongoClient.GetDatabase("ARFoodMenu");
        _notificationCollection = database.GetCollection<Notification>("Notifications");
        _logger = logger;
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveNotification([FromBody] Notification model)
    {
        if (model == null)
        {
            return BadRequest("Notification payload is null.");
        }

        if (string.IsNullOrEmpty(model.UserId) || string.IsNullOrEmpty(model.Message))
        {
            return BadRequest("UserId and Message are required.");
        }

        var notification = new Notification
        {
            UserId = model.UserId,
            Message = model.Message,
            Timestamp = DateTime.UtcNow
        };

        // Save the notification to the database
        await _notificationCollection.InsertOneAsync(notification);
        return Ok(new { success = true });
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetUserNotifications(string userId)
    {
        try
        {
            var notifications = await _notificationCollection
                .Find(n => n.UserId == userId)
                .SortByDescending(n => n.Timestamp)
                .ToListAsync();

            if (notifications == null || notifications.Count == 0)
            {
                return Ok(new List<Notification>()); // Return empty list instead of NotFound
            }

            return Ok(notifications);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving notifications for user {userId}: {ex.Message}");
            return StatusCode(500, "Internal server error");
        }
    }
}