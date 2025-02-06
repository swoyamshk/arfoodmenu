using ARMenu.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace ARMenu.Data
{
    public class MongoDbService
    {
        private readonly IMongoCollection<User> _users;

        public MongoDbService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>(settings.Value.UserCollection);
        }

        public async Task<User> GetUserByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task AddUserAsync(User user) =>
            await _users.InsertOneAsync(user);
    }

    public class MongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string UserCollection { get; set; }
    }
}
