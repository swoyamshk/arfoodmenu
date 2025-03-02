import { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    try {
      const cartToStore = cart.map(({ id, name, price, quantity }) => ({
        id,
        name,
        price,
        quantity,
      }));
      localStorage.setItem("cart", JSON.stringify(cartToStore));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cart]);

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

  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage:", error);
      }
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Create an order and save it to the DB
  const createOrder = async (userId) => {
    if (!userId) {
      console.error("User ID is missing.");
      return;
    }
  
    const orderData = {
      userId,
      orderDate: new Date().toISOString(),
      totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      orderItems: cart.map((item) => ({
        dishId: item.id,
        dishName: item.name,
        price: item.price,
        quantity: item.quantity,
        // Do NOT include 'Id' or 'OrderId' here, let the backend handle it
      })),
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/Orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        throw new Error(`Failed to place order: ${response.statusText}`);
      }
  
      // console.log("Order placed successfully!");
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error.message);
    }
  };
  
  

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, createOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
