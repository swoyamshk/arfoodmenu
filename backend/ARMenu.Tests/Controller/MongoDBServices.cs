using ARMenu.Models;
using ARMenu.Services;
using Microsoft.Extensions.Options;
using Moq;
using MongoDB.Driver;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using MongoDB.Bson;


namespace ARMenu.Tests
{
    public class MongoDbServiceTests
    {
        private readonly Mock<IMongoCollection<User>> _mockUserCollection;
        private readonly Mock<IMongoCollection<Order>> _mockOrderCollection;
        private readonly Mock<IMongoCollection<Dish>> _mockDishCollection;
        private readonly Mock<IMongoCollection<Review>> _mockReviewCollection;
        private readonly Mock<IMongoDatabase> _mockDatabase;
        private readonly Mock<IMongoClient> _mockClient;
        private readonly MongoDbService _mongoDbService;

        public MongoDbServiceTests()
        {
            _mockUserCollection = new Mock<IMongoCollection<User>>();
            _mockOrderCollection = new Mock<IMongoCollection<Order>>();
            _mockDishCollection = new Mock<IMongoCollection<Dish>>();
            _mockReviewCollection = new Mock<IMongoCollection<Review>>();

            _mockDatabase = new Mock<IMongoDatabase>();
            _mockClient = new Mock<IMongoClient>();

            var mockSettings = Options.Create(new MongoDbSettings
            {
                ConnectionString = "mongodb://localhost:27017",
                DatabaseName = "TestDB",
                UserCollection = "Users"
            });

            _mockClient.Setup(c => c.GetDatabase(mockSettings.Value.DatabaseName, null))
                       .Returns(_mockDatabase.Object);

            _mockDatabase.Setup(db => db.GetCollection<User>(mockSettings.Value.UserCollection, null))
                         .Returns(_mockUserCollection.Object);

            _mockDatabase.Setup(db => db.GetCollection<Order>("Orders", null))
                         .Returns(_mockOrderCollection.Object);

            _mockDatabase.Setup(db => db.GetCollection<Dish>("Dishes", null))
                         .Returns(_mockDishCollection.Object);

            _mockDatabase.Setup(db => db.GetCollection<Review>("Reviews", null))
                         .Returns(_mockReviewCollection.Object);

            _mongoDbService = new MongoDbService(mockSettings);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ValidEmail_ReturnsUser()
        {
            var email = "test9f7669d0-23e5-4b39-94ba-8fb28bb4f349@example.com";
            var expectedUser = new User { Id = "67e7a348b24656ec34609457", Email = email };

            var mockCursor = new Mock<IAsyncCursor<User>>();
            mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<System.Threading.CancellationToken>()))
                      .Returns(true)   
                      .Returns(false); 
            mockCursor.Setup(c => c.Current).Returns(new List<User> { expectedUser }); 


            _mockUserCollection.Setup(c => c.FindAsync(It.IsAny<FilterDefinition<User>>(),
                                                        It.IsAny<FindOptions<User, User>>(),
                                                        default))
                               .ReturnsAsync(mockCursor.Object);

            var user = await _mongoDbService.GetUserByEmailAsync(email);

            Assert.NotNull(user); 
            Assert.Equal(email, user.Email); 
        }

        [Fact]
        public async Task AddUserAsync_ValidUser_CallsInsertOneAsync()
        {
            var mockCollection = new Mock<IMongoCollection<User>>();
            var mockSettings = Options.Create(new MongoDbSettings
            {
                ConnectionString = "mongodb://localhost:27017",
                DatabaseName = "TestDB",
                UserCollection = "Users"
            });

            var service = new MongoDbService(mockSettings);

            var testUser = new User
            {
                Id = ObjectId.GenerateNewId().ToString(), 
                Username = "TestUser",
                Email = $"test{Guid.NewGuid()}@example.com", 
                ConfirmationToken = "test-token",
                IsEmailConfirmed = false
            };


            await service.AddUserAsync(testUser);

            var retrievedUser = await service.GetUserByIdAsync(testUser.Id);
            Assert.NotNull(retrievedUser);
            Assert.Equal(testUser.Email, retrievedUser.Email);
        }

        //[Fact]
        //public async Task CreateOrderAsync_ValidOrder_CallsInsertOneAsync()
        //{
        //    // Arrange
        //    var mockOrderCollection = new Mock<IMongoCollection<Order>>();
        //    var mockSettings = Options.Create(new MongoDbSettings
        //    {
        //        ConnectionString = "mongodb://localhost:27017",
        //        DatabaseName = "TestDB",
        //        UserCollection = "Orders"
        //    });

        //    var service = new MongoDbService(mockSettings);

        //    var newOrder = new Order
        //    {
        //        Id = ObjectId.GenerateNewId().ToString(),
        //        UserId = "67e7a348b24656ec34609457"
        //    };

        //    // Setup the mock to return Task.CompletedTask when InsertOneAsync is called
        //    mockOrderCollection
        //        .Setup(c => c.InsertOneAsync(It.IsAny<Order>(), It.IsAny<InsertOneOptions>(), It.IsAny<CancellationToken>()))
        //        .Returns(Task.CompletedTask);

        //    // Act
        //    await service.CreateOrderAsync(newOrder);

        //    // Assert
        //    mockOrderCollection.Verify(c => c.InsertOneAsync(newOrder, null, default), Times.Once);
        //}



        //// ✅ Test GetOrderByIdAsync
        //[Fact]
        //public async Task GetOrderByIdAsync_ValidId_ReturnsOrder()
        //{
        //    // Arrange
        //    var orderId = "67c31a0a8e2fe5ed744c59ac";
        //    var expectedOrder = new Order { Id = orderId, UserId = "67aa06dac0698b92ed3a4230" };

        //    var mockCursor = new Mock<IAsyncCursor<Order>>();
        //    mockCursor.SetupSequence(c => c.MoveNext(It.IsAny<System.Threading.CancellationToken>()))
        //              .Returns(true).Returns(false);
        //    mockCursor.Setup(c => c.Current).Returns(new List<Order> { expectedOrder });

        //    _mockOrderCollection.Setup(c => c.FindAsync(It.IsAny<FilterDefinition<Order>>(), It.IsAny<FindOptions<Order, Order>>(), default))
        //                        .ReturnsAsync(mockCursor.Object);

        //    // Act
        //    var order = await _mongoDbService.GetOrderByIdAsync(orderId);

        //    // Assert
        //    Assert.NotNull(order);
        //    Assert.Equal(orderId, order.Id);
        //}
        //// ✅ Test DeleteOrderAsync
        //[Fact]
        //public async Task DeleteOrderAsync_ValidId_CallsDeleteOneAsync()
        //{
        //    // Arrange
        //    var orderId = "67aa06dac0698b92ed3a4230";

        //    // Act
        //    await _mongoDbService.DeleteOrderAsync(orderId);

        //    // Assert
        //    _mockOrderCollection.Verify(c => c.DeleteOneAsync(It.IsAny<FilterDefinition<Order>>(), default), Times.Once);
        //}

        // ✅ Test UpdateUserProfileAsync
        [Fact]
        public async Task UpdateUserProfileAsync_ValidUser_UpdatesUserProfile()
        {
            // Arrange
            var userId = "67aa06dac0698b92ed3a4230";
            var newUsername = "UpdatedUser";
            var newEmail = "updated@example.com";

            var expectedUser = new User { Id = userId, Username = newUsername, Email = newEmail };

            _mockUserCollection.Setup(c => c.FindOneAndUpdateAsync(
                It.IsAny<FilterDefinition<User>>(),
                It.IsAny<UpdateDefinition<User>>(),
                It.IsAny<FindOneAndUpdateOptions<User>>(),
                default))
                .ReturnsAsync(expectedUser);

            // Act
            var updatedUser = await _mongoDbService.UpdateUserProfileAsync(userId, newUsername, newEmail);

            // Assert
            Assert.NotNull(updatedUser);
            Assert.Equal(newUsername, updatedUser.Username);
            Assert.Equal(newEmail, updatedUser.Email);
        }


    }
}