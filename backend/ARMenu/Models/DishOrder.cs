using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ARMenu.Models
{
    public class DishOrder
    {
        [BsonRepresentation(BsonType.ObjectId)]
        public ObjectId DishId { get; set; }

        public int Quantity { get; set; }

        public decimal PriceAtOrder { get; set; }
    }
}
