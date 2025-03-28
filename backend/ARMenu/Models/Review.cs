
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;


namespace ARMenu.Models
{

        public class Review
        {
            [BsonId]
            [BsonRepresentation(BsonType.ObjectId)]
            public string Id { get; set; }
            public string DishId { get; set; }
            public string UserId { get; set; }

            public int Rating { get; set; }

            public string Comment { get; set; }

            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        }

        public class ReviewDto
        {
            public int Rating { get; set; }
            public string Comment { get; set; }
        }
    }
