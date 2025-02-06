import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MenuSection from './components/MenuSection';
import Food3DModelPage from './components/Food3DModelPage';

const menuData = [
  {
    section: "Appetizers",
    items: [
      { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic, and basil", price: 8.99 },
      { id: 2, name: "Calamari", description: "Crispy fried squid with marinara sauce", price: 10.99 },
    ]
  },
  {
    section: "Main Courses",
    items: [
      { id: 3, name: "Margherita Pizza", description: "Classic pizza with tomato sauce, mozzarella, and basil", price: 14.99 },
      { id: 4, name: "Grilled Salmon", description: "Fresh salmon fillet with lemon butter sauce", price: 18.99 },
    ]
  },
  {
    section: "Desserts",
    items: [
      { id: 5, name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 7.99 },
      { id: 6, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey center", price: 8.99 },
    ]
  }
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header>
          <h1>Our Menu</h1>
        </header>
        <Routes>
          <Route path="/" element={<MenuSection title="Menu" items={menuData} />} />
          <Route path="/model/:id" element={<Food3DModelPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
