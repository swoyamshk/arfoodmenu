using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class Dish
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public decimal Price { get; set; }

    public string ImageFileId { get; set; }    // For the dish image
    public string ArModelFileId { get; set; }  

    public List<string> Ingredients { get; set; }

    public bool IsVegetarian { get; set; }

    public bool IsSpicy { get; set; }

    [BsonRepresentation(BsonType.ObjectId)]
    public string MenuCategoryId { get; set; }
}