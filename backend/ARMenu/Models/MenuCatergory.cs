using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace ARMenu.Models
{
    public class MenuCategory
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        // This will be populated with ObjectIds of Dish objects
        public List<ObjectId> Dishes { get; set; } = new List<ObjectId>();
    }
}
