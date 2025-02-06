using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ARMenu.Models
{
    public class Order
    {
        [BsonId]
        public ObjectId Id { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId UserId { get; set; }

        public List<DishOrder> Dishes { get; set; }

        public decimal TotalPrice { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
