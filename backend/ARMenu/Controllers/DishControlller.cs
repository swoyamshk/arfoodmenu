using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.IO;
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

        // 🔹 POST: Create a new dish
        [HttpPost]
        public async Task<ActionResult<Dish>> CreateDish(
     [FromForm] string name,
     [FromForm] string description,
     [FromForm] decimal price,
     [FromForm] string menuCategoryId,
     [FromForm] bool isVegetarian,
     [FromForm] bool isSpicy,
     [FromForm] List<string> ingredients,
     IFormFile imageFile,
     IFormFile arModelFile)
        {
            try
            {
                // Validate `menuCategoryId`
                if (string.IsNullOrEmpty(menuCategoryId) || !ObjectId.TryParse(menuCategoryId, out _))
                {
                    return BadRequest("Invalid or missing MenuCategoryId.");
                }

                // Ensure both image and AR model files are uploaded
                if (imageFile == null || arModelFile == null)
                {
                    return BadRequest("Both image and AR model files are required.");
                }

                // Convert image file
                byte[] imageBytes;
                using (var imageStream = new MemoryStream())
                {
                    await imageFile.CopyToAsync(imageStream);
                    imageBytes = imageStream.ToArray();
                    Console.WriteLine($"Image Size: {imageBytes.Length} bytes");
                }

                // Convert AR model file
                byte[] arModelBytes;
                using (var modelStream = new MemoryStream())
                {
                    await arModelFile.CopyToAsync(modelStream);
                    arModelBytes = modelStream.ToArray();
                    Console.WriteLine($"AR Model Size: {arModelBytes.Length} bytes");
                }

                // Ensure data is properly set before insertion
                if (imageBytes.Length == 0 || arModelBytes.Length == 0)
                {
                    return BadRequest("File conversion failed.");
                }

                // Create a new dish instance
                var dish = new Dish
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Name = name,
                    Description = description,
                    Price = price,
                    MenuCategoryId = menuCategoryId,
                    IsVegetarian = isVegetarian,
                    IsSpicy = isSpicy,
                    Ingredients = ingredients ?? new List<string>(),
                    ImageFile = imageBytes,
                    ArModelFile = arModelBytes
                };

                // Insert into database
                await _dishesCollection.InsertOneAsync(dish);

                return CreatedAtAction(nameof(GetDishById), new { id = dish.Id }, dish);
            }
            catch (Exception ex)
            {
                // Log the exception and return a 500 error
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dish>>> GetAllDishes()
        {
            var dishes = await _dishesCollection.Find(_ => true).ToListAsync();
            return Ok(dishes);
        }


        // 🔹 GET: Retrieve a dish by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Dish>> GetDishById(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid dish ID.");
            }

            var dish = await _dishesCollection.Find(d => d.Id == id).FirstOrDefaultAsync();
            if (dish == null) return NotFound();

            return Ok(dish);
        }
    }
}
