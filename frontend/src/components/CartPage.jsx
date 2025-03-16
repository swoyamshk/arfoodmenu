import { useState } from "react";
import { useCart } from "../context/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
// Load Stripe public key
const stripePromise = loadStripe("pk_test_51Qxm8xRxY9y7noBqepQU947aEuqomG7nDgc8lQTYrWOQJ5SPYKfOGam2IuV3J1sUAD2YIXzaNyu0QShc692A2M9100gwfJoIge");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { cart, removeFromCart, clearCart, createOrder } = useCart();
  const userId = localStorage.getItem("userId");
const currency ="USD";
  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }
  
    const confirmOrder = window.confirm("Are you sure you want to proceed to payment?");
    if (!confirmOrder) return;
  
    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
    try {
      setIsProcessing(true);
      setError(null);
  
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalAmount, currency}),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Payment creation failed");
  
      const { clientSecret } = data;
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
  
      if (error) {
        setError(`Payment failed: ${error.message}`);
      } else {
        alert("Payment successful!");
        
        // **Call createOrder to save the cart items in the order database**
        await createOrder(userId);
      }
    } catch (err) {
      setError(`An error occurred: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div>
      <CardElement className="border p-2 rounded-md mb-4" />
      <button
        onClick={handlePlaceOrder}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full"
        disabled={cart.length === 0 || isProcessing}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
        {cart.map((item) => (
  <div key={item.id} className="flex items-center justify-between border-b py-2">
    <div>
      <h2 className="text-lg">{item.name || "Unknown Item"}</h2>
      <p className="text-gray-500">
        ${item.price ? item.price.toFixed(2) : "0.00"} x {item.quantity || 1}
      </p>
    </div>
    <button
      onClick={() => removeFromCart(item.id)}
      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
    >
      Remove
    </button>
  </div>
))}


          <div className="mt-4 flex gap-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
            >
              Clear Cart
            </button>
          </div>

          {/* Stripe Elements Wrapper */}
          <div className="mt-6 border p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">Enter Payment Details</h2>
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;