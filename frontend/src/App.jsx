import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodApp from './components/FoodApp';  // Your pizza selection page
import Register from "./components/Register";
import CreateMenuCategory from "./components/CreateMenuCategory";
import { useState } from "react";
import Login from './components/Login';
import CreateDishForm from "./components/CreateDish";
import BottomNavBar from "./components/BottomNavbar";
import ProfilePage from "./components/ProfilePage";
import FavoritesPage from "./components/FavouritesPage";
import NotificationsPage from "./components/NotificationPage";
import DishDetails from './components/DishDetails';
import CartPage from "./components/CartPage";
import { CartProvider } from "./context/CartProvider";
import UpdateProfile from "./components/UpdateProfile";
import { ToastContainer } from "react-toastify";
import SuccessPage from "./components/SuccessPage";
import FailurePage from "./components/Failure";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import ARjsViewer from "./components/CameraAccess";
import WebXRARViewer from "./components/CameraAccess";

function App() {

  const [token, setToken] = useState();
  const stripePromise = loadStripe("pk_test_51Qxm8xRxY9y7noBqepQU947aEuqomG7nDgc8lQTYrWOQJ5SPYKfOGam2IuV3J1sUAD2YIXzaNyu0QShc692A2M9100gwfJoIge");

  return (
    <>
    <Elements stripe={stripePromise}>
    <ToastContainer/>
    <CartProvider>
    <Router>
      <Routes>
        <Route path="/" element={<FoodApp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken}/>} />
        {/* <Route path="/ar-view" element={<WebXRARViewer />} /> */}
        <Route path="/create-menu-category" element={<CreateMenuCategory/>} />
        <Route path="/create-dish" element={<CreateDishForm/>} />
        <Route path="/profile" element={<ProfilePage/>} />
        <Route path="/notifications" element={<NotificationsPage/>} />
        <Route path="/favorites" element={<FavoritesPage/>} />
        <Route path="/dish/:id" element={<DishDetails/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/update-profile" element={<UpdateProfile/>} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/webxr/:id" element={<WebXRARViewer />} />
      </Routes>
      <BottomNavBar/>
      </Router> 
      </CartProvider>
      </Elements>
      </>
  // <ARjsViewer/>
      
  );
}

export default App;

