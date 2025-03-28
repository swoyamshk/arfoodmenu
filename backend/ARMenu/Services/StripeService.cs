using Stripe;
using System;

public class StripeService
{
    private readonly string _secretKey = "sk_test_51PnC86P5gKndYWM0ELEYsZgKCHbAGJkcakXd6r6aHtVcPVAOFSixKdnfMDTi1bozZYLRF4ptp5NlfesnfZ7i4uIX00UAXvV5Xy"; // Use your Stripe secret key

    public StripeService()
    {
        StripeConfiguration.ApiKey = _secretKey;
    }

    public PaymentIntent CreatePaymentIntent(long amount)
    {
        var options = new PaymentIntentCreateOptions
        {
            Amount = amount * 100, // Amount should be in cents
            Currency = "usd",
        };

        var service = new PaymentIntentService();
        PaymentIntent paymentIntent = service.Create(options);

        return paymentIntent;
    }
}
