// import Header from './components/Header';
// import MenuSection from './components/MenuSection';

// const menuData = [
//   {
//     section: "Appetizers",
//     items: [
//       { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic, and basil", price: 8.99 },
//       { id: 2, name: "Calamari", description: "Crispy fried squid with marinara sauce", price: 10.99 },
//     ]
//   },
//   {
//     section: "Main Courses",
//     items: [
//       { id: 3, name: "Margherita Pizza", description: "Classic pizza with tomato sauce, mozzarella, and basil", price: 14.99 },
//       { id: 4, name: "Grilled Salmon", description: "Fresh salmon fillet with lemon butter sauce", price: 18.99 },
//     ]
//   },
//   {
//     section: "Desserts",
//     items: [
//       { id: 5, name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 7.99 },
//       { id: 6, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a gooey center", price: 8.99 },
//     ]
//   }
// ];

// export default function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <h1 className="text-3xl font-bold text-center mb-8">Our Menu</h1>
//         {menuData.map((section, index) => (
//           <MenuSection key={index} title={section.section} items={section.items} />
//         ))}
//       </main>
//     </div>
//   );
// }


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodApp from './components/FoodApp';  // Your pizza selection page
import ModelViewerPage from './components/ModelViewerPage'; // Your 3D model page
import Register from "./components/Register";
import { useState } from "react";
import Login from './components/Login';
import CameraAccess from "./components/CameraAccess";
import WebXRARViewer from "./components/CameraAccess";

function App() {

  const [token, setToken] = useState();

  return (
      <Routes>
        <Route path="/" element={<FoodApp />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken}/>} />
        <Route path="/ar-view" element={<WebXRARViewer />} />
      </Routes>


     // <div>
    //   <FoodApp/>
    //   {/* <Register setToken={setToken} /> */}
    //   {/* <Login setToken={setToken}/> */}
    //   {/* <CameraAccess/> */}
    // </div>
  );
}

export default App;

