import React, { useEffect, useState } from 'react';
import { createDish } from '../services/dishServices';  // API call function to create dish
import { getMenuCategories } from '../services/menuServices';  // API call function to get categories

const CreateDishForm = () => {
  const [dish, setDish] = useState({
    name: '',
    description: '',
    price: '',
    imageFile: null,
    arModelFile: null,
    ingredients: '',
    isVegetarian: false,
    isSpicy: false,
    menuCategoryId: ''
  });
  
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getMenuCategories();
      console.log("Fetched Categories:", fetchedCategories); // Log response
      setCategories(fetchedCategories);
    };
    
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    e.preventDefault();
    console.log("Dish State:", dish);
    setDish(prevDish => ({
      ...prevDish,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setDish(prevDish => ({
      ...prevDish,
      [name]: files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate MenuCategoryId
    if (!dish.menuCategoryId) {
      alert("Please select a category.");
      return;
    }
  
    const formData = new FormData();
    formData.append('name', dish.name);
    formData.append('description', dish.description);
    formData.append('price', dish.price);
    formData.append('imageFile', dish.imageFile);
    formData.append('arModelFile', dish.arModelFile);
    formData.append('ingredients', dish.ingredients);
    formData.append('isVegetarian', dish.isVegetarian);
    formData.append('isSpicy', dish.isSpicy);
    formData.append('menuCategoryId', dish.menuCategoryId); // Ensure this is appended
  
    try {
      await createDish(formData); // Call the API to create the dish
      alert('Dish created successfully');
    } catch (error) {
      console.error('Error creating dish:', error);
      alert('Failed to create dish. Please check the console for details.');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Dish Name</label>
        <input
          type="text"
          name="name"
          value={dish.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={dish.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={dish.price}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
       <select
  name="menuCategoryId"
  value={dish.menuCategoryId}
  onChange={(e) => {
    console.log("Selected Category ID:", e.target.value);
    setDish(prevDish => ({
      ...prevDish,
      menuCategoryId: e.target.value
    }));
  }}
  required
  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>
  <option value="">Select a category</option>
  {categories.map(category => (
    <option key={category._id} value={category._id}>{category.name}</option> 
  ))}
</select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image File</label>
        <input
          type="file"
          name="imageFile"
          onChange={handleFileChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">AR Model File</label>
        <input
          type="file"
          name="arModelFile"
          onChange={handleFileChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex items-center">
        <label className="mr-2">Vegetarian</label>
        <input
          type="checkbox"
          name="isVegetarian"
          checked={dish.isVegetarian}
          onChange={handleChange}
          className="h-5 w-5 text-indigo-600"
        />
      </div>

      <div className="flex items-center">
        <label className="mr-2">Spicy</label>
        <input
          type="checkbox"
          name="isSpicy"
          checked={dish.isSpicy}
          onChange={handleChange}
          className="h-5 w-5 text-indigo-600"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white font-medium text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Create Dish
      </button>
    </form>
  );
};

export default CreateDishForm;