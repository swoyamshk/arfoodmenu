//using ARMenu.Data;
//using ARMenu.Models;
//using MongoDB.Driver;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace ARMenu.Services
//{
//    public class OrderService
//    {
//        private readonly MongoDbService _mongoDbService;

//        public OrderService(MongoDbService mongoDbService)
//        {
//            _mongoDbService = mongoDbService;
//        }

//        public async Task CreateOrderAsync(Order order)
//        {
//            await _mongoDbService.Orders.InsertOneAsync(order);
//        }

//        public async Task<List<Order>> GetOrdersByUserIdAsync(string userId)
//        {
//            return await _mongoDbService.Orders.Find(o => o.UserId == userId).ToListAsync();
//        }

//        public async Task<Order> GetOrderByIdAsync(int id)
//        {
//            return await _mongoDbService.Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
//        }
//    }
//}