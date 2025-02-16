using System.Security.Claims;
using ARMenu.Services;
using Microsoft.AspNetCore.Mvc;
using ARMenu.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace ARMenu.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly MongoDbService _mongoDbService;
        public AuthController(AuthService authService, MongoDbService mongoDbService)
        {
            _authService = authService;
            _mongoDbService = mongoDbService;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var (token, role) = await _authService.RegisterUser(request.Username, request.Email, request.Password, request.Role);
                if (token == null)
                    return BadRequest(new { message = "User already exists" });

                return Ok(new { Token = token, Role = role });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (token, role, userId) = await _authService.LoginUser(request.Email, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { Token = token, Role = role, userId = userId });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserById(string id)
        {

            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("Invalid user ID.");
            }

            var user = await _mongoDbService.GetUserByIdAsync(id);
            if (user == null) return NotFound();

            return Ok(user);
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateProfile(string id, [FromBody] UserUpdateDto request)
        {

            try
            {
                // Validate ID
                if (!ObjectId.TryParse(id, out _))
                {
                    return BadRequest("Invalid user ID.");
                }

                // Fetch existing user to ensure partial updates work
                var existingUser = await _mongoDbService.GetUserByIdAsync(id);
                if (existingUser == null)
                {
                    return NotFound("User not found.");
                }

                // Use existing values if not provided
                var updatedUsername = request.Username ?? existingUser.Username;
                var updatedEmail = request.Email ?? existingUser.Email;

                // Attempt to update the user
                var updatedUser = await _mongoDbService.UpdateUserProfileAsync(id, updatedUsername, updatedEmail);
                if (updatedUser == null)
                {
                    return NotFound("Update failed.");
                }

                return Ok(new { message = "Profile updated successfully", user = updatedUser });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }




    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
