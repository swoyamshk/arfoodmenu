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
                var token = await _authService.RegisterUser(request.Username, request.Email, request.Password);
                return Ok(new { Token = token });
            }
            catch (Exception ex)
            {
                // You can customize this to return specific error messages based on the exception type
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var token = await _authService.LoginUser(request.Email, request.Password);
            return token == null ? Unauthorized("Invalid credentials") : Ok(new { Token = token });
        }
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
