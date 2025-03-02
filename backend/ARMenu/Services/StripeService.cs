using Stripe;
using System;

public class StripeService
{
    private readonly string _secretKey = "sk_test_51Qxm8xRxY9y7noBqwnqI1hesER2xrSs9Jx8MMEYRdsPqtUtzWlpQiIfYMP0kon6xmIF47O8W7XA2JKhUHawnwPzl00fuCcUQ72"; // Use your Stripe secret key

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
