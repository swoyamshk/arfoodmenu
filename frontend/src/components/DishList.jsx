// import { useEffect, useState } from "react";
// import { getAllDishes } from "../services/dishServices";

// const DishList = () => {
//   const [dishes, setDishes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDishes = async () => {
//       try {
//         const data = await getAllDishes();
//         setDishes(data);
//       } catch (err) {
//         setError("Failed to load dishes.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDishes();
//   }, []);

//   if (loading) return <p className="text-center text-gray-500">Loading dishes...</p>;
//   if (error) return <p className="text-center text-red-500">{error}</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-semibold text-center mb-6">Dishes Menu</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {dishes.map((dish) => (
//           <div key={dish.id} className="bg-white rounded-lg shadow-lg p-4">
//             {dish.imageFile && (
//               <img
//                 src={`data:image/png;base64,${dish.imageFile}`}
//                 alt={dish.name}
//                 className="w-full h-48 object-cover rounded-t-lg"
//               />
//             )}
//             <div className="p-4">
//               <h2 className="text-xl font-semibold">{dish.name}</h2>
//               <p className="text-gray-600">{dish.description}</p>
//               <p className="text-gray-800 font-bold mt-2">${dish.price.toFixed(2)}</p>
//               <p className="text-sm text-gray-500">{dish.isVegetarian ? "Vegetarian" : "Non-Vegetarian"}</p>
//               <p className="text-sm text-gray-500">{dish.isSpicy ? "Spicy" : "Mild"}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DishList;
