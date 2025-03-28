using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly string _stripeSecretKey = "sk_test_51PnC86P5gKndYWM0ELEYsZgKCHbAGJkcakXd6r6aHtVcPVAOFSixKdnfMDTi1bozZYLRF4ptp5NlfesnfZ7i4uIX00UAXvV5Xy"; // Replace with your actual secret key

    public PaymentsController()
    {
        StripeConfiguration.ApiKey = _stripeSecretKey;
    }

    [HttpPost("create-payment-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest paymentRequest)
    {
        try
        {
            // Explicitly convert the amount from decimal to long (amount in cents)
            long amountInCents = (long)(paymentRequest.Amount * 100);

            var paymentIntentOptions = new PaymentIntentCreateOptions
            {
                Amount = amountInCents, // Use the long value
                Currency = paymentRequest.Currency,
                PaymentMethodTypes = new List<string> { "card" }, // You can specify other payment methods as well
            };

            var paymentIntentService = new PaymentIntentService();
            var paymentIntent = await paymentIntentService.CreateAsync(paymentIntentOptions);

            // Return the client secret for the payment to be completed on the frontend
            return Ok(new { clientSecret = paymentIntent.ClientSecret });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

}

public class PaymentRequest
{
    public decimal Amount { get; set; }
    public string Currency { get; set; }
}
