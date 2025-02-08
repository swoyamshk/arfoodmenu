using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuCategoryController : ControllerBase
    {
        private readonly IMongoCollection<MenuCategory> _menuCategoryCollection;

        public MenuCategoryController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _menuCategoryCollection = database.GetCollection<MenuCategory>("MenuCategories");
        }

        // 🔹 POST: Create a new MenuCategory
        [HttpPost]
        public async Task<ActionResult<MenuCategory>> CreateMenuCategory([FromBody] MenuCategory menuCategory)
        {
            if (menuCategory == null || string.IsNullOrWhiteSpace(menuCategory.Name))
            {
                return BadRequest("Menu category name is required.");
            }

            // ✅ Remove manual ID assignment, let MongoDB handle it
            await _menuCategoryCollection.InsertOneAsync(menuCategory);

            return CreatedAtAction(nameof(GetMenuCategoryById), new { id = menuCategory.Id }, menuCategory);
        }


        // 🔹 GET: Get all MenuCategories
        [HttpGet]
        public async Task<ActionResult<List<object>>> GetMenuCategories()
        {
            var categories = await _menuCategoryCollection.Find(_ => true).ToListAsync();

            var formattedCategories = categories.Select(c => new
            {
                _id = c.Id,  // ✅ Ensure `_id` is included
                name = c.Name,
                description = c.Description
            }).ToList();

            return Ok(formattedCategories);
        }

        // 🔹 GET: Get MenuCategory by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuCategory>> GetMenuCategoryById(string id)
        {
            // ✅ Validate `id` before querying
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid category ID.");
            }

            var menuCategory = await _menuCategoryCollection.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (menuCategory == null) return NotFound();

            return Ok(menuCategory);
        }
    }
}
