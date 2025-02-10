import { useLocation, useNavigate } from "react-router-dom";
import { Home, Heart, Bell, User, ShoppingCart } from "lucide-react";

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", icon: <Home size={24} />, path: "/" },
    { name: "Favorites", icon: <Heart size={24} />, path: "/favorites" },
    { name: "Cart", icon: <ShoppingCart size={32} />, path: "/cart" },
    { name: "Notifications", icon: <Bell size={24} />, path: "/notifications" },
    { name: "Profile", icon: <User size={24} />, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t shadow-md flex justify-around items-center p-3">
      {navItems.map((item, index) => (
        <div
          key={item.path}
          className={`flex flex-col items-center ${
            item.name === "Cart" ? "relative" : ""
          } ${
            item.name === "Favorites" ? "ml-4" : "" // Add margin-left to Favorites
          }`}
        >
          <button
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-gray-600 hover:text-black ${
              location.pathname === item.path ? "text-orange-500" : ""
            } ${
              item.name === "Cart"
                ? "bg-orange-500 text-white rounded-full p-3 -mt-8 shadow-lg"
                : ""
            }`}
          >
            {item.icon}
            {item.name !== "Cart" && (
              <span className="text-xs">{item.name}</span>
            )}
          </button>
        </div>
      ))}
    </nav>
  );
};

export default BottomNavBar;