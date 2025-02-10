import { useCart } from "../context/CartProvider";

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();

  console.log("Cart items in CartPage:", cart); // Debugging

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
                <h2 className="text-lg">{item.name}</h2>
                <p className="text-gray-500">${item.price.toFixed(2)} x {item.quantity}</p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800"
          >
            Clear Cart
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
