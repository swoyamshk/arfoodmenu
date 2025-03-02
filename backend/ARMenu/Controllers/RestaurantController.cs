using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RestaurantController : ControllerBase
    {
        private readonly IMongoCollection<Restaurant> _restaurantsCollection;

        public RestaurantController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _restaurantsCollection = database.GetCollection<Restaurant>("Restaurants");
        }

        [HttpPost]
        public async Task<ActionResult<Restaurant>> CreateRestaurant([FromBody] Restaurant restaurant)
        {
            restaurant.Id = ObjectId.GenerateNewId().ToString();
            await _restaurantsCollection.InsertOneAsync(restaurant);
            return CreatedAtAction(nameof(GetRestaurantById), new { id = restaurant.Id }, restaurant);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetAllRestaurants()
        {
            var restaurants = await _restaurantsCollection.Find(_ => true).ToListAsync();
            return Ok(restaurants);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurantById(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid restaurant ID.");
            }

            var restaurant = await _restaurantsCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (restaurant == null) return NotFound();

            return Ok(restaurant);
        }
    }
}