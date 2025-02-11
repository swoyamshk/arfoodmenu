import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodApp from './components/FoodApp';  // Your pizza selection page
import Register from "./components/Register";
import CreateMenuCategory from "./components/CreateMenuCategory";
import { useState } from "react";
import Login from './components/Login';
import WebXRARViewer from "./components/CameraAccess";
import CreateDishForm from "./components/CreateDish";
import BottomNavBar from "./components/BottomNavbar";
import ProfilePage from "./components/ProfilePage";
import FavoritesPage from "./components/FavouritesPage";
import NotificationsPage from "./components/NotificationPage";
import DishDetails from './components/DishDetails';
import CartPage from "./components/CartPage";
import { CartProvider } from "./context/CartProvider";
import UpdateProfile from "./components/UpdateProfile";

function App() {

  const [token, setToken] = useState();

  return (
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<FoodApp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken}/>} />
        <Route path="/ar-view" element={<WebXRARViewer />} />
        <Route path="/create-menu-category" element={CreateMenuCategory} />
        <Route path="/create-dish" element={CreateDishForm} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/favorites" element={<FavoritesPage/>} />
        <Route path="/dish/:id" element={<DishDetails/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/update-profile" element={<UpdateProfile/>} />
      </Routes>
      <BottomNavBar/>
      </Router> 
      </CartProvider>
  
      
  );
}

export default App;

