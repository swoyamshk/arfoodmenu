using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MongoDB.Bson;
using ARMenu.Services;

namespace ARMenu.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly MongoDbService _mongoDbService;

        public OrdersController(MongoDbService mongoDbService)
        {
            _mongoDbService = mongoDbService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] Order order)
        {
            // Generate new Order Id
            order.Id = ObjectId.GenerateNewId().ToString();

            // Assign OrderId and generate _id for each OrderItem
            foreach (var item in order.OrderItems)
            {
                item.Id = ObjectId.GenerateNewId().ToString(); // Assign new _id
                item.OrderId = order.Id; // Set OrderId
            }

            await _mongoDbService.CreateOrderAsync(order);
            return Ok(order);
        }



        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetOrdersByUserId(string userId)
        {
            var orders = await _mongoDbService.GetOrdersByUserIdAsync(userId);
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(string id)
        {
            var order = await _mongoDbService.GetOrderByIdAsync(id);
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(string id, [FromBody] Order order)
        {
            await _mongoDbService.UpdateOrderAsync(id, order);
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(string id)
        {
            await _mongoDbService.DeleteOrderAsync(id);
            return Ok();
        }
    }
}