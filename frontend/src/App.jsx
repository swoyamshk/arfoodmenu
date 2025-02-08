import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FoodApp from './components/FoodApp';  // Your pizza selection page
import ModelViewerPage from './components/ModelViewerPage'; // Your 3D model page
import Register from "./components/Register";
import CreateMenuCategory from "./components/CreateMenuCategory";
import { useState } from "react";
import Login from './components/Login';
import CameraAccess from "./components/CameraAccess";
import WebXRARViewer from "./components/CameraAccess";
import CreateDishForm from "./components/CreateDish";
import DishList from "./components/DishList";

function App() {

  const [token, setToken] = useState();

  return (
      // <Routes>
      //   <Route path="/" element={<FoodApp />} />
      //   <Route path="/login" element={<Login setToken={setToken} />} />
      //   <Route path="/register" element={<Register setToken={setToken}/>} />
      //   <Route path="/ar-view" element={<WebXRARViewer />} />
      //   <Route path="/create-menu-category" element={CreateMenuCategory} />
      //   <Route path="/create-dish" element={CreateDishForm} />

      // </Routes>

     <div>
      {/* <FoodApp/> */}
      {/* <CreateDishForm/> */}
      <DishList/>
      {/* <Register setToken={setToken} /> */}
      {/* <Login setToken={setToken}/> */}
      {/* <CameraAccess/> */}
    </div>
  );
}

export default App;

