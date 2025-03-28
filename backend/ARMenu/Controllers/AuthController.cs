using System.Security.Claims;
using ARMenu.Services;
using Microsoft.AspNetCore.Mvc;
using ARMenu.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using Microsoft.AspNetCore.WebUtilities;
using System.Text.Encodings.Web;
using System.Text;

namespace ARMenu.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly MongoDbService _mongoDbService;
        private readonly IEmailService _emailService;

        public AuthController(AuthService authService, MongoDbService mongoDbService, EmailService emailService)
        {
            _authService = authService;
            _mongoDbService = mongoDbService;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            // Check if user already exists
            var existingUser = await _mongoDbService.GetUserByEmailAsync(request.Email);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            // Create new user
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Email = request.Email,
                Username = request.Username ?? request.Email.Split('@')[0], // Default username from email
                PasswordHash = hashedPassword,
                Role = string.IsNullOrEmpty(request.Role) ? "customer" : request.Role,
                IsEmailConfirmed = false // Ensure email confirmation is required
            };

            // Log the email before proceeding with registration
            Console.WriteLine($"Registering user with email: {user.Email}");

            // Save user to database
            await _mongoDbService.AddUserAsync(user);

            // Generate email confirmation token
            var confirmationToken = Guid.NewGuid().ToString();
            await _mongoDbService.SaveEmailConfirmationTokenAsync(user.Id, confirmationToken);

            // Encode token for safe URL usage
            var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(confirmationToken));
            var confirmationLink = $"{Request.Scheme}://{Request.Host}/api/auth/confirm-email?userId={user.Id}&token={encodedToken}";

            // Ensure confirmation email is being sent with the correct email address
            try
            {
                // Log the confirmation link and email details
                Console.WriteLine($"Confirmation link: {confirmationLink}");
                Console.WriteLine($"Sending confirmation email to: {user.Email}");

                if (string.IsNullOrEmpty(user.Email))
                {
                    return StatusCode(500, new { message = "User email is missing, cannot send confirmation email." });
                }

                // Send confirmation email
                await _emailService.SendEmailAsync(user.Email, "Confirm Your Email",
                    $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(confirmationLink)}'>clicking here</a>.");
            }
            catch (Exception ex)
            {
                // Log error and return failure response
                return StatusCode(500, new { message = "User registered but email confirmation failed.", error = ex.Message });
            }

            return Ok(new { message = "User registered successfully. Please check your email to confirm your account." });
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

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            try
            {
                // Decode the token
                byte[] decodedTokenBytes;
                try
                {
                    decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
                    var confirmationToken = Encoding.UTF8.GetString(decodedTokenBytes);

                    // Validate input parameters
                    if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(confirmationToken))
                    {
                        return BadRequest(new { message = "Invalid confirmation parameters." });
                    }

                    // Verify the token against the stored token for this user
                    var isValid = await _mongoDbService.VerifyEmailConfirmationTokenAsync(userId, confirmationToken);

                    if (!isValid)
                    {
                        return BadRequest(new
                        {
                            message = "Invalid or expired confirmation link.",
                            details = "The confirmation link may have already been used or has expired."
                        });
                    }

                    // Activate user account
                    var isActivated = await _mongoDbService.ActivateUserAccountAsync(userId);
                    if (!isActivated)
                    {
                        return BadRequest(new { message = "Account activation failed." });
                    }

                    return Ok(new { message = "Email confirmed successfully! You can now log in." });
                }
                catch (FormatException)
                {
                    return BadRequest(new
                    {
                        message = "Invalid token format.",
                        details = "The confirmation token could not be decoded properly."
                    });
                }
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.WriteLine($"Email confirmation error: {ex.Message}");
                return StatusCode(500, new
                {
                    message = "An unexpected error occurred during email confirmation.",
                    details = ex.Message
                });
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
