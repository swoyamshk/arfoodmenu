using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : ControllerBase
    {
        private readonly IMongoCollection<Dish> _dishesCollection;

        public DishController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _dishesCollection = database.GetCollection<Dish>("Dishes");
        }

        // Create a new Dish
        [HttpPost]
        public async Task<ActionResult<Dish>> CreateDish(Dish dish)
        {
            if (string.IsNullOrEmpty(dish.MenuCategoryId) || !ObjectId.TryParse(dish.MenuCategoryId, out _))
            {
                return BadRequest("Invalid or missing MenuCategoryId.");
            }

            await _dishesCollection.InsertOneAsync(dish);
            return CreatedAtAction(nameof(GetDishById), new { id = dish.Id.ToString() }, dish);
        }


        // Get Dish by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Dish>> GetDishById(string id)
        {
            var dish = await _dishesCollection.Find(d => d.Id == new ObjectId(id)).FirstOrDefaultAsync();
            if (dish == null) return NotFound();
            return Ok(dish);
        }
    }
}
