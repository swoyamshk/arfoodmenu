using ARMenu.Models;
using ARMenu.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ARMenu.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IMongoCollection<Review> _reviews;
        private readonly IMongoCollection<Dish> _dishes;

        public ReviewsController(MongoDbService mongoDbService)
        {
            // Access collections from MongoDbService
            _reviews = mongoDbService.GetReviewCollection();
            _dishes = mongoDbService.GetDishCollection();
        }

        // GET: api/reviews/{dishId}
        [HttpGet("{dishId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(string dishId)
        {
            var reviews = await _reviews
                .Find(r => r.DishId == dishId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews);
        }

        // POST: api/reviews/{dishId}
        [HttpPost("{dishId}")]
        public async Task<ActionResult<Review>> AddReview(string dishId, [FromBody] ReviewDto reviewDto)
        {
            // Validate dish exists
            var dish = await _dishes.Find(d => d.Id == dishId).FirstOrDefaultAsync();
            if (dish == null)
            {
                return NotFound("Dish not found");
            }

            // Validate rating
            if (reviewDto.Rating < 1 || reviewDto.Rating > 5)
            {
                return BadRequest("Rating must be between 1 and 5");
            }

            var review = new Review
            {
                DishId = dishId,
                UserId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            await _reviews.InsertOneAsync(review);

            return CreatedAtAction(nameof(GetReviews), new { dishId }, review);
        }
    }
}
