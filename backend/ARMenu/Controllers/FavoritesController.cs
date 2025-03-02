using ARMenu.Models;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteDishController : ControllerBase
    {
        private readonly IMongoCollection<FavoriteDish> _favoritesCollection;
        private readonly IMongoCollection<Dish> _dishesCollection;

        public FavoriteDishController(IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase("ARFoodMenu");
            _favoritesCollection = database.GetCollection<FavoriteDish>("FavoriteDishes");
            _dishesCollection = database.GetCollection<Dish>("Dishes");
        }

        // POST: Add a dish to favorites
        [HttpPost]
        public async Task<IActionResult> AddFavorite([FromBody] FavoriteDish favorite)
        {
            if (!ObjectId.TryParse(favorite.UserId, out _) || !ObjectId.TryParse(favorite.DishId, out _))
            {
                return BadRequest("Invalid UserId or DishId.");
            }

            var dishExists = await _dishesCollection.Find(d => d.Id == favorite.DishId).AnyAsync();
            if (!dishExists)
            {
                return BadRequest("Dish does not exist.");
            }

            var existingFavorite = await _favoritesCollection
                .Find(f => f.UserId == favorite.UserId && f.DishId == favorite.DishId)
                .FirstOrDefaultAsync();
            if (existingFavorite != null)
            {
                return Ok("Dish is already in favorites.");
            }

            favorite.Id = ObjectId.GenerateNewId().ToString();
            await _favoritesCollection.InsertOneAsync(favorite);
            return CreatedAtAction(nameof(GetFavoritesByUser), new { userId = favorite.UserId }, favorite);
        }

        // GET: Get all favorite dish IDs for a user
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<FavoriteDish>>> GetFavoritesByUser(string userId)
        {
            if (!ObjectId.TryParse(userId, out _))
            {
                return BadRequest("Invalid UserId.");
            }

            var favorites = await _favoritesCollection
                .Find(f => f.UserId == userId)
                .ToListAsync();

            return Ok(favorites);
        }

        // DELETE: Remove a dish from favorites
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveFavorite(string id)
        {
            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid favorite ID.");
            }

            var result = await _favoritesCollection.DeleteOneAsync(f => f.Id == id);
            if (result.DeletedCount == 0)
            {
                return NotFound("Favorite not found.");
            }

            return NoContent();
        }
    }
}