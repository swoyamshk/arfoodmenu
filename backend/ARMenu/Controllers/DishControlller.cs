using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Driver.GridFS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishController : ControllerBase
    {
        private readonly IMongoCollection<Dish> _dishesCollection;
        private readonly GridFSBucket _gridFS;

        public DishController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _dishesCollection = database.GetCollection<Dish>("Dishes");
            _gridFS = new GridFSBucket(database);
        }

        // 🔹 POST: Create a new dish with image & AR model stored in GridFS
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
                if (string.IsNullOrEmpty(menuCategoryId) || !ObjectId.TryParse(menuCategoryId, out _))
                {
                    return BadRequest("Invalid or missing MenuCategoryId.");
                }

                if (imageFile == null || arModelFile == null)
                {
                    return BadRequest("Both image and AR model files are required.");
                }

                // 🔹 Upload Image to GridFS
                using var imageStream = imageFile.OpenReadStream();
                var imageFileId = await _gridFS.UploadFromStreamAsync(imageFile.FileName, imageStream);

                // 🔹 Upload AR Model to GridFS
                using var modelStream = arModelFile.OpenReadStream();
                var arModelFileId = await _gridFS.UploadFromStreamAsync(arModelFile.FileName, modelStream);

                // 🔹 Create dish and store GridFS file IDs
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
                    ImageFileId = imageFileId.ToString(),
                    ArModelFileId = arModelFileId.ToString()
                };

                await _dishesCollection.InsertOneAsync(dish);
                return CreatedAtAction(nameof(GetDishById), new { id = dish.Id }, dish);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        // 🔹 GET: Retrieve all dishes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dish>>> GetAllDishes()
        {
            var dishes = await _dishesCollection.Find(_ => true).ToListAsync();
            return Ok(dishes);
        }

        // 🔹 GET: Retrieve a dish by ID
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

        // 🔹 GET: Retrieve image file from GridFS
        [HttpGet("image/{fileId}")]
        public async Task<IActionResult> GetImage(string fileId)
        {
            if (!ObjectId.TryParse(fileId, out var objectId))
            {
                return BadRequest("Invalid file ID.");
            }

            var stream = new MemoryStream();
            await _gridFS.DownloadToStreamAsync(objectId, stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream, "image/jpeg");
        }

        // 🔹 GET: Retrieve AR model file from GridFS
        [HttpGet("armodel/{fileId}")]
        public async Task<IActionResult> GetARModel(string fileId)
        {
            if (!ObjectId.TryParse(fileId, out var objectId))
            {
                return BadRequest("Invalid file ID.");
            }

            var stream = new MemoryStream();
            await _gridFS.DownloadToStreamAsync(objectId, stream);
            stream.Seek(0, SeekOrigin.Begin);
            return File(stream, "application/octet-stream", "model.glb");
        }

        // 🔹 DELETE: Remove dish and its associated files from GridFS
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDish(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid dish ID.");
            }

            var dish = await _dishesCollection.Find(d => d.Id == id).FirstOrDefaultAsync();
            if (dish == null) return NotFound();

            // Delete image & AR model from GridFS
            if (ObjectId.TryParse(dish.ImageFileId, out var imageObjectId))
            {
                await _gridFS.DeleteAsync(imageObjectId);
            }
            if (ObjectId.TryParse(dish.ArModelFileId, out var modelObjectId))
            {
                await _gridFS.DeleteAsync(modelObjectId);
            }

            // Delete dish from collection
            await _dishesCollection.DeleteOneAsync(d => d.Id == id);
            return NoContent();
        }
    }
}
