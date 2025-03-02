// Models/FavoriteDish.cs
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace ARMenu.Models
{
    public class FavoriteDish
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string UserId { get; set; } // Links to the user (or use a session ID if no auth)
        [BsonRepresentation(BsonType.ObjectId)]
        public string DishId { get; set; } // Links to the dish

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime AddedDate { get; set; } = DateTime.UtcNow; // When it was favorited
    }
}