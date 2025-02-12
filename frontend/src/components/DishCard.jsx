import { useNavigate } from "react-router-dom";
import { Button } from "./ui/buttons";
import { useCart } from "../context/CartProvider"; // Import useCart hook
import { toast } from "react-toastify"; // Import toast for notifications
import { getImageUrl } from "../services/dishServices"; // Import function to get image URL

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const DishCard = ({ dish }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Get addToCart function from context

  // Handle click on the card to navigate to dish details
  const handleClick = () => {
    navigate(`/dish/${dish.id}`, { state: { dish } }); // Navigate with dish data
  };

  // Handle click on the "+" button to add dish to cart
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    addToCart(dish); // Add dish to cart
    toast.success(`${dish.name} added to cart!`); // Show success notification
  };

  return (
    <div className="p-3 rounded-2xl cursor-pointer shadow-md" onClick={handleClick}>
      <div className="relative mb-3">
        <img
          src={getImageUrl(dish.imageFileId)} // Fetch image using correct API URL
          alt={dish.name}
          className="w-full h-40 object-cover rounded-lg"
          onError={(e) => { e.target.src = "/placeholder.svg"; }} // Fallback to placeholder on error
        />
      </div>
      <h3 className="font-semibold">{dish.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{dish.description}</p>
      <div className="flex justify-between items-center">
        <span className="font-bold">$ {dish.price.toFixed(2)}</span>
        <Button
          size="icon"
          className="rounded-full bg-orange-500 hover:bg-orange-600 h-8 w-8"
          onClick={handleAddToCart} // Add onClick handler for the button
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
};

export default DishCard;
