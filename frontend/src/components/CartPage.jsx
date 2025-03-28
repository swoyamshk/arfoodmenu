import { useState } from "react";
import { useCart } from "../context/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import NotificationService from "../services/NotificationService";

const stripePromise = loadStripe("pk_test_51PnC86P5gKndYWM0ADRswnFAOTQHnYiE5DVfrrNlWoH9CEALhJbxv9O4nvnmcJTcHEs1a97RA0tuzORaYRqRf0Bx00cvXPNOAZ");

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { cart, removeFromCart, clearCart, createOrder } = useCart();
  const userId = localStorage.getItem("userId");
  const currency = "USD";
  const notificationService = new NotificationService();

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert("Please log in to place an order.");
      return;
    }
  
    const confirmOrder = window.confirm("Are you sure you want to proceed to payment?");
    if (!confirmOrder) return;
  
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
        return;
      }
  
      // Create order and get order details
      const orderResult = await createOrder(userId);
      
      if (!orderResult) {
        throw new Error("Order creation failed");
      }
  
      // Create a detailed order description
      const orderDescription = cart
        .map(item => `${item.name} x${item.quantity}`)
        .join(", ");
  
      // Save notification
      const notificationMessage = `Order placed successfully! 
  Items: ${orderDescription}
  Total: $${totalAmount.toFixed(2)}`;
      
      try {
        await notificationService.saveNotification(userId, notificationMessage);
      } catch (notificationError) {
        console.error("Notification Save Error:", notificationError);
        alert("Order placed, but could not save notification.");
      }
  
      alert("Payment successful!");
      clearCart();
    } catch (err) {
      console.error("Full Error:", err);
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
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // Calculate total amount
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };

  const handleCashOrder = () => {
    const confirmCashOrder = window.confirm("Confirm Cash on Delivery order?");
    if (confirmCashOrder) {
      // Implement cash order logic here
      alert("Order placed successfully with Cash on Delivery!");
      clearCart(); // Clear the cart after successful cash order
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-16 w-16 text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
            />
          </svg>
          <p className="text-xl text-gray-600 font-semibold">Your cart is empty</p>
          <p className="text-gray-500 mt-2">Looks like you haven't added any items yet</p>
        </div>
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

        {/* Total Amount Display */}
        <div className="mt-4 text-xl font-bold">
          Total: ${totalAmount.toFixed(2)}
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Clear Cart
          </button>
        </div>

        {/* Payment Method Selection */}
        <div className="mt-4 border p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Select Payment Method</h2>
          <div className="flex items-center mb-2">
            <input 
              type="radio" 
              id="stripe" 
              name="paymentMethod" 
              value="stripe"
              checked={paymentMethod === "stripe"}
              onChange={() => handlePaymentMethodChange("stripe")}
              className="mr-2"
            />
            <label htmlFor="stripe" className="mr-4">Credit Card (Stripe)</label>
            
            <input 
              type="radio" 
              id="cash" 
              name="paymentMethod" 
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => handlePaymentMethodChange("cash")}
              className="mr-2"
            />
            <label htmlFor="cash">Cash on Delivery</label>
          </div>

          {/* Conditional Rendering of Payment Methods */}
          {paymentMethod === "stripe" ? (
            <div className="mt-4 border p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Enter Payment Details</h2>
              <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={totalAmount} />
              </Elements>
            </div>
          ) : (
            <div className="mt-4 border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Cash on Delivery</h2>
              <p className="mb-4">You will pay the total amount of ${totalAmount.toFixed(2)} upon delivery.</p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
                onClick={handleCashOrder}
              >
                Place Cash Order
              </button>
            </div>
          )}
        </div>
      </>
      )}
    </div>
  );
};

export default CartPage;