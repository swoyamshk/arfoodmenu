using Moq;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using System.Collections.Generic;
using System.Threading.Tasks;
using ARMenu.Controllers;
using ARMenu.Models;
using System.Linq;

namespace ARMenu.Tests
{
    public class MenuCategoryControllerTests
    {
        private readonly Mock<IMongoCollection<MenuCategory>> _mockMenuCategoryCollection;
        private readonly MenuCategoryController _controller;

        public MenuCategoryControllerTests()
        {
            _mockMenuCategoryCollection = new Mock<IMongoCollection<MenuCategory>>();
            var mockMongoClient = new Mock<IMongoClient>();
            var mockDatabase = new Mock<IMongoDatabase>();

            // Fix here: Setting up GetDatabase without optional arguments
            mockMongoClient.Setup(client => client.GetDatabase(It.IsAny<string>(), null)).Returns(mockDatabase.Object);

            mockDatabase.Setup(db => db.GetCollection<MenuCategory>("MenuCategories", null)).Returns(_mockMenuCategoryCollection.Object);

            _controller = new MenuCategoryController(mockMongoClient.Object);
        }

        [Fact]
        public async Task CreateMenuCategory_ReturnsCreatedAtActionResult_WhenValidData()
        {
            var newCategory = new MenuCategory
            {
                Name = "Appetizers",
                Description = "Delicious starters"
            };

            var result = await _controller.CreateMenuCategory(newCategory);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            Assert.Equal(201, createdResult.StatusCode);
            Assert.Equal(newCategory.Name, ((MenuCategory)createdResult.Value).Name);
        }

        [Fact]
        public async Task CreateMenuCategory_ReturnsBadRequest_WhenInvalidData()
        {
            // Arrange
            var invalidCategory = new MenuCategory
            {
                Name = "" // Invalid, name is empty
            };

            // Act
            var result = await _controller.CreateMenuCategory(invalidCategory);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal(400, badRequestResult.StatusCode);
        }

    
    }
}
