import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Retrieve and parse the cart from localStorage (fallback to empty array)
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart changes to localStorage
  useEffect(() => {
    try {
      // Avoid large data being stored in localStorage
      const cartToStore = cart.map(({ id, name, price, quantity }) => ({
        id, name, price, quantity
      }));
      localStorage.setItem("cart", JSON.stringify(cartToStore)); // Save reduced data to localStorage
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

  // Add to cart function
  const addToCart = (dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  // Remove a single item from cart
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart)); // Sync with localStorage
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
      return updatedCart;
    });
  };

  // Clear entire cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart"); // Remove from localStorage
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
