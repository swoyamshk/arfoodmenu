import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../context/CartProvider";
import { toast } from "react-toastify";

const DishDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useCart();
  const dish = location.state?.dish;

  if (!dish) {
    return <div className="p-5">Dish not found!</div>;
  }
  console.log("Dish to be added:", dish);
  console.log("Dish ID:", dish?.id); // Ensure this is not undefined
  
  const handleAddToCart = () => {
    addToCart(dish);
    toast.success(`${dish.name} added to cart!`);
  };

  return (
    <div className="p-5">
      <img
        src={dish.imageFile ? `data:image/png;base64,${dish.imageFile}` : "/placeholder.svg"}
        alt={dish.name}
        className="w-full h-60 object-cover rounded-lg mb-3"
      />
      <h1 className="text-2xl font-bold">{dish.name}</h1>
      <p className="text-gray-500 mb-3">{dish.description}</p>
      <span className="text-lg font-semibold">$ {dish.price.toFixed(2)}</span>
      <button
        onClick={handleAddToCart}
        className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default DishDetails;