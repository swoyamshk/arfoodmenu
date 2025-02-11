using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ARMenu.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using ARMenu.Data;

namespace ARMenu.Services
{
    public class AuthService
    {
        private readonly MongoDbService _mongoDbService;
        private readonly IConfiguration _configuration;
        private readonly string _secretKey ;


        public AuthService(MongoDbService mongoDbService, IConfiguration configuration)
        {
            _mongoDbService = mongoDbService;
            _configuration = configuration;
            _secretKey = _configuration["JwtSettings:SecretKey"];
        }

        public async Task<(string Token, string Role)> RegisterUser(string username, string email, string password, string role)
        {
            var existingUser = await _mongoDbService.GetUserByEmailAsync(email);
            if (existingUser != null)
                return (null, null);

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);

            // Ensure role is either "admin" or "customer"
            var userRole = string.IsNullOrEmpty(role) ? "customer" : role;

            var user = new User { Username = username, Email = email, PasswordHash = hashedPassword, Role = userRole };
            await _mongoDbService.AddUserAsync(user);

            var token = GenerateJwtToken(user);
            return (token, user.Role);
        }


        public async Task<(string Token, string Role, string userId)> LoginUser(string email, string password)
        {
            var user = await _mongoDbService.GetUserByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return (null, null, null);

            var token = GenerateJwtToken(user);
            //var userId = await _mongoDbService.GetUserByIdAsync(userId);
            return (token, user.Role, user.Id);
           
        }


        public string GenerateJwtToken(User user)
        {

            // Check if user or important properties are null
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user), "User cannot be null");
            }

            // Ensure _secretKey is not null
            if (string.IsNullOrEmpty(_secretKey))
            {
                throw new ArgumentNullException(nameof(_secretKey), "Secret key cannot be null or empty");
            }

            // Generate the claims based on the user object
            var claims = new[]
            {
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Role, user.Role)
        // Add other claims if necessary
    };

            // Security key and signing credentials
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Create the token
            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            // Return the JWT as a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
