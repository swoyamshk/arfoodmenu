using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace ARMenu.Models
{
    public class Notification
    {
        [BsonId]
        public string Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string? UserId { get; set; } // Nullable for guests

        public string? GuestId { get; set; } // Unique guest identifier (from localStorage)

        [BsonRepresentation(BsonType.ObjectId)]
        public string OrderId { get; set; } // Related order

        public string Message { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
