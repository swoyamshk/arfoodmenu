using Stripe;

public class StripeService
{
    private readonly PaymentIntentService _paymentIntentService;

    // Constructor now accepts PaymentIntentService as a dependency
    public StripeService(PaymentIntentService paymentIntentService)
    {
        _paymentIntentService = paymentIntentService;
        StripeConfiguration.ApiKey = "sk_test_51PnC86P5gKndYWM0ELEYsZgKCHbAGJkcakXd6r6aHtVcPVAOFSixKdnfMDTi1bozZYLRF4ptp5NlfesnfZ7i4uIX00UAXvV5Xy";
    }

    public PaymentIntent CreatePaymentIntent(long amount)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = amount * 100, // Convert to cents
            Currency = "usd",
        };

        return _paymentIntentService.Create(options);
    }
}
