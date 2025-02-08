using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class MenuCategory
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString(); // ✅ Auto-generate ID

    public string Name { get; set; }
    public string Description { get; set; }
}
