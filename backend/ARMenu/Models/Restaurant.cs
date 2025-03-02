using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ARMenu.Models
{
    public class Restaurant
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string Name { get; set; }

        public string Address { get; set; }  // Optional: Add more fields as needed
        public string Description { get; set; }  // Optional
    }
}