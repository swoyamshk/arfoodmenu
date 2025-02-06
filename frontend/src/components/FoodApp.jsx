"use client";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/buttons";
import { useNavigate } from "react-router-dom";

// Simple icon components to replace Lucide icons
const PizzaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10" />
  </svg>
);

const BurgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CoffeeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const SlidersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </svg>
);

export default function FoodApp() {
  const navigate = useNavigate(); // Hook to navigate

  const handlePizzaClick = () => {
    navigate("/ar-view");
  };

  const categories = [
    { icon: <PizzaIcon />, name: "Pizza", color: "bg-orange-100 text-orange-500" },
    { icon: <BurgerIcon />, name: "Burger", color: "bg-rose-100 text-rose-500" },
    { icon: <CoffeeIcon />, name: "Drinks", color: "bg-blue-100 text-blue-500" },
    { icon: <PizzaIcon />, name: "Sushi", color: "bg-purple-100 text-purple-500" },
  ];

  const pizzas = [
    {
      name: "Meat Pizza",
      type: "Mixed Pizza",
      price: 8.3,
      image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpenphfGVufDB8fDB8fHww",
    },
    {
      name: "Cheese Pizza",
      type: "Mixed Pizza",
      price: 7.3,
      image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpenphfGVufDB8fDB8fHww",
    },
    {
      name: "Meat Pizza",
      type: "Mixed Pizza",
      price: 8.3,
      image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpenphfGVufDB8fDB8fHww",
    },
    {
      name: "Cheese Pizza",
      type: "Mixed Pizza",
      price: 7.3,
      image: "https://images.unsplash.com/photo-1576458088443-04a19bb13da6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHBpenphfGVufDB8fDB8fHww",
    },
  ];

  return (
    <div className="max-w-md mx-auto p-4 bg-white min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hello,</h1>
          <p className="text-gray-500">What you want eat today?</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-yellow-400 overflow-hidden">
          <img src="/logo192.png" alt="Profile" className="w-full h-full object-cover" />
        </div>
      </header>

      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Input placeholder="Search for Food" className="pl-8 pr-4 py-3 rounded-xl bg-gray-100 border-none" />
          <span className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        <Button variant="default" className="px-4 rounded-xl bg-orange-500 hover:bg-orange-600">
          <SlidersIcon />
        </Button>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${category.color} whitespace-nowrap`}
          >
            {category.icon}
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {pizzas.map((pizza, index) => (
          <div key={index} className={`p-3 rounded-2xl ${index === 1 ? "border-2 border-blue-500" : ""}`}>
            <div className="relative mb-3">
              <img
                src={pizza.image || "/placeholder.svg"}
                alt={pizza.name}
                className="w-full h-auto rounded-full"
              />
            </div>
            <h3 className="font-semibold">{pizza.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{pizza.type}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">$ {pizza.price.toFixed(2)}</span>
              <Button
                size="icon"
                className="rounded-full bg-orange-500 hover:bg-orange-600 h-8 w-8"
                onClick={handlePizzaClick}
              >
                <PlusIcon />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
