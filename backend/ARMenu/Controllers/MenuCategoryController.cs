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
    public class MenuCategoryController : ControllerBase
    {
        private readonly IMongoCollection<MenuCategory> _menuCategoryCollection;

        public MenuCategoryController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _menuCategoryCollection = database.GetCollection<MenuCategory>("MenuCategories");
        }

        // Create a new MenuCategory
        [HttpPost]
        public async Task<ActionResult<MenuCategory>> CreateMenuCategory(MenuCategory menuCategory)
        {
            await _menuCategoryCollection.InsertOneAsync(menuCategory);
            return CreatedAtAction(nameof(GetMenuCategoryById), new { id = menuCategory.Id.ToString() }, menuCategory);
        }

        // Get all MenuCategories
        [HttpGet]
        public async Task<ActionResult<List<MenuCategory>>> GetMenuCategories()
        {
            var menuCategories = await _menuCategoryCollection.Find(_ => true).ToListAsync();
            return Ok(menuCategories);
        }

        // Get MenuCategory by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<MenuCategory>> GetMenuCategoryById(string id)
        {
            var menuCategory = await _menuCategoryCollection.Find(c => c.Id == new ObjectId(id)).FirstOrDefaultAsync();
            if (menuCategory == null) return NotFound();
            return Ok(menuCategory);
        }

        // Add Dishes to a MenuCategory
        [HttpPut("{id}/addDishes")]
        public async Task<ActionResult> AddDishesToCategory(string id, List<ObjectId> dishIds)
        {
            var menuCategory = await _menuCategoryCollection.Find(c => c.Id == new ObjectId(id)).FirstOrDefaultAsync();
            if (menuCategory == null) return NotFound();

            var updateDefinition = Builders<MenuCategory>.Update.PushEach(c => c.Dishes, dishIds);
            await _menuCategoryCollection.UpdateOneAsync(c => c.Id == new ObjectId(id), updateDefinition);

            return NoContent();
        }
    }
}
