using ARMenu.Services;
using Microsoft.AspNetCore.Mvc;

namespace ARMenu.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
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
            var (token, role) = await _authService.LoginUser(request.Email, request.Password);
            if (token == null)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new { Token = token, Role = role });
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Add this field
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
