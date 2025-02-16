using ARMenu.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ARMenu.Services
{
    public class MongoDbService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Order> _orders; // New collection for orders

        public MongoDbService(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _users = database.GetCollection<User>(settings.Value.UserCollection);
            _orders = database.GetCollection<Order>("Orders"); // Initialize orders collection
        }

        // User-related methods
        public async Task<User> GetUserByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task<User> GetUserByIdAsync(string id)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            return await _users.Find(filter).FirstOrDefaultAsync();
        }

        public async Task<User> UpdateUserProfileAsync(string id, string username, string email)
        {
            var filter = Builders<User>.Filter.Eq(u => u.Id, id);
            var update = Builders<User>.Update
                .Set(u => u.Username, username)
                .Set(u => u.Email, email);

            var options = new FindOneAndUpdateOptions<User>
            {
                ReturnDocument = ReturnDocument.After
            };

            return await _users.FindOneAndUpdateAsync(filter, update, options);
        }

        public async Task AddUserAsync(User user) =>
            await _users.InsertOneAsync(user);

        // Order-related methods
        public async Task CreateOrderAsync(Order order) =>
            await _orders.InsertOneAsync(order);

        public async Task<List<Order>> GetOrdersByUserIdAsync(string userId) =>
            await _orders.Find(o => o.UserId == userId).ToListAsync();

        public async Task<Order> GetOrderByIdAsync(string id) =>
    await _orders.Find(o => o.Id == id).FirstOrDefaultAsync();

        public async Task UpdateOrderAsync(string id, Order order)
        {
            var filter = Builders<Order>.Filter.Eq(o => o.Id, id);
            await _orders.ReplaceOneAsync(filter, order);
        }

        public async Task DeleteOrderAsync(string id)
        {
            var filter = Builders<Order>.Filter.Eq(o => o.Id, id);
            await _orders.DeleteOneAsync(filter);
        }

    }

    public class MongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string UserCollection { get; set; }
    }
}