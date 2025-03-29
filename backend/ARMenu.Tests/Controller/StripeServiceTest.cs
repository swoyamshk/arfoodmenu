    using Moq;
    using Stripe;
    using System.Threading;
    using System.Threading.Tasks;
    using Xunit;

namespace ARMenu.Tests
{

    public class StripeServiceTests
    {
        [Fact]
        public void CreatePaymentIntent_ValidAmount_ReturnsPaymentIntent()
        {

            var mockPaymentIntentService = new Mock<PaymentIntentService>();
            var expectedPaymentIntent = new PaymentIntent { Id = "pi_test123", Amount = 5000 };

            mockPaymentIntentService
                .Setup(s => s.Create(It.IsAny<PaymentIntentCreateOptions>(), null))
                .Returns(expectedPaymentIntent);

            var stripeService = new StripeService(mockPaymentIntentService.Object);

            var result = stripeService.CreatePaymentIntent(50); 

            Assert.NotNull(result);
            Assert.Equal("pi_test123", result.Id); 
            Assert.Equal(5000, result.Amount);
        }
    }

}
