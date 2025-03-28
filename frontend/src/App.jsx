import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./context/CartProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
// Import custom Error Boundary
import ErrorBoundary from "./error/ErrorBoundary";

// Lazy load components to improve performance
const FoodApp = lazy(() => import('./components/FoodApp'));
const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const CreateMenuCategory = lazy(() => import('./components/CreateMenuCategory'));
const CreateDishForm = lazy(() => import('./components/CreateDish'));
const BottomNavBar = lazy(() => import('./components/BottomNavbar'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const FavoritesPage = lazy(() => import('./components/FavouritesPage'));
const NotificationsPage = lazy(() => import('./components/NotificationPage'));
const DishDetails = lazy(() => import('./components/DishDetails'));
const CartPage = lazy(() => import('./components/CartPage'));
const UpdateProfile = lazy(() => import('./components/UpdateProfile'));
const SuccessPage = lazy(() => import('./components/SuccessPage'));
const FailurePage = lazy(() => import('./components/Failure'));
const WebXRARViewer = lazy(() => import('./components/CameraAccess'));
const CreateRestaurantPage = lazy(() => import('./components/Restaurant'));

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const stripePromise = loadStripe("pk_test_51Qxm8xRxY9y7noBqepQU947aEuqomG7nDgc8lQTYrWOQJ5SPYKfOGam2IuV3J1sUAD2YIXzaNyu0QShc692A2M9100gwfJoIge");

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!sessionStorage.getItem("sessionActive")) {
        localStorage.clear(); // Clears localStorage only if the session is inactive (closed tab/window)
      }
    };
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sessionStorage.removeItem("sessionActive"); // Remove session marker when tab is closed
      } else {
        sessionStorage.setItem("sessionActive", "true"); // Mark session as active when tab is visible
      }
    };
  
    sessionStorage.setItem("sessionActive", "true"); // Set session active on mount
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
        </div>
      }>
        <Elements stripe={stripePromise}>
          <ToastContainer/>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/" element={<FoodApp />} />
                <Route path="/login" element={<Login setToken={setToken} />} />
                <Route path="/register" element={<Register setToken={setToken}/>} />
                <Route path="/create-menu-category" element={<CreateMenuCategory/>} />
                <Route path="/create-dish" element={<CreateDishForm/>} />
                <Route path="/profile" element={<ProfilePage/>} />
                <Route path="/notifications" element={<NotificationsPage/>} />
                <Route path="/favorites" element={<FavoritesPage/>} />
                <Route path="/dish/:id" element={<DishDetails/>} />
                <Route path="/cart" element={<CartPage/>} />
                <Route path="/update-profile" element={<UpdateProfile/>} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/failure" element={<FailurePage />} />
                <Route path="/webxr/:id" element={<WebXRARViewer />} />
                <Route path="/create-restaurant" element={<CreateRestaurantPage/>} />
                
                {/* Catch-all route for any undefined routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <BottomNavBar/>
            </Router> 
          </CartProvider>
        </Elements>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;