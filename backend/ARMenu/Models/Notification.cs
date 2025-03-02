using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

public class Notification
{
    [BsonId] // This attribute tells MongoDB to treat this property as the unique identifier
    public ObjectId Id { get; set; }

    public string UserId { get; set; }
    public string Message { get; set; }
    public DateTime Timestamp { get; set; }
}
