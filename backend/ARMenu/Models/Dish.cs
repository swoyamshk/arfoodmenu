using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Collections.Generic;

namespace ARMenu.Models
{
    public class Dish
    {
        [BsonId]
        public ObjectId Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public decimal Price { get; set; }

        public string ImageUrl { get; set; }

        public string ArModelUrl { get; set; }

        public List<string> Ingredients { get; set; }

        public bool IsVegetarian { get; set; }

        public bool IsSpicy { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        public string MenuCategoryId { get; set; }
    }
}
