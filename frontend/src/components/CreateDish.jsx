import React, { useEffect, useState } from 'react';
import { createDish } from '../services/dishServices';
import { getMenuCategories } from '../services/menuServices';
import { getRestaurants } from '../services/restaurantServices';

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
    menuCategoryId: '',
    restaurantId: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await getMenuCategories();
        const fetchedRestaurants = await getRestaurants();
        setCategories(fetchedCategories);
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDish(prevDish => ({
      ...prevDish,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setDish(prevDish => ({
      ...prevDish,
      [name]: file
    }));

    // Create image preview
    if (name === 'imageFile' && file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    const validationErrors = [];
    if (!dish.name) validationErrors.push("Dish name is required");
    if (!dish.description) validationErrors.push("Description is required");
    if (!dish.price || isNaN(dish.price)) validationErrors.push("Valid price is required");
    if (!dish.menuCategoryId) validationErrors.push("Category is required");
    if (!dish.restaurantId) validationErrors.push("Restaurant is required");
    if (!dish.imageFile) validationErrors.push("Image file is required");
    if (!dish.arModelFile) validationErrors.push("AR model file is required");

    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    const formData = new FormData();
    Object.keys(dish).forEach(key => {
      if (key === 'ingredients') {
        const ingredientsArray = dish.ingredients ? dish.ingredients.split(',').map(i => i.trim()) : [];
        ingredientsArray.forEach((ingredient, index) => {
          formData.append(`ingredients[${index}]`, ingredient);
        });
      } else if (key === 'imageFile' || key === 'arModelFile') {
        formData.append(key, dish[key]);
      } else if (typeof dish[key] === 'boolean') {
        formData.append(key, dish[key].toString());
      } else {
        formData.append(key, dish[key]);
      }
    });

    try {
      await createDish(formData);
      alert('Dish created successfully');
      // Reset form
      setDish({
        name: '',
        description: '',
        price: '',
        imageFile: null,
        arModelFile: null,
        ingredients: '',
        isVegetarian: false,
        isSpicy: false,
        menuCategoryId: '',
        restaurantId: ''
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error creating dish:', error);
      alert(`Failed to create dish: ${error.response?.data || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create New Dish
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Dish Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={dish.name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={dish.description}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    id="price"
                    type="number"
                    name="price"
                    value={dish.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                    Ingredients (comma-separated)
                  </label>
                  <input
                    id="ingredients"
                    type="text"
                    name="ingredients"
                    value={dish.ingredients}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="restaurantId" className="block text-sm font-medium text-gray-700">
                    Restaurant
                  </label>
                  <select
                    id="restaurantId"
                    name="restaurantId"
                    value={dish.restaurantId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a restaurant</option>
                    {restaurants.map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="menuCategoryId" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="menuCategoryId"
                    name="menuCategoryId"
                    value={dish.menuCategoryId}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Image Upload
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <input
                        id="imageFile"
                        type="file"
                        name="imageFile"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="hidden"
                      />
                      {previewImage ? (
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="mx-auto h-32 w-auto object-cover rounded-md"
                        />
                      ) : (
                        <div>
                          <svg 
                            className="mx-auto h-12 w-12 text-gray-400" 
                            stroke="currentColor" 
                            fill="none" 
                            viewBox="0 0 48 48" 
                            aria-hidden="true"
                          >
                            <path 
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                              strokeWidth={2} 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                            />
                          </svg>
                          <p className="text-xs text-gray-500">Upload a file</p>
                        </div>
                      )}
                      <label 
                        htmlFor="imageFile" 
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload an image</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    AR Model Upload
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <input
                        id="arModelFile"
                        type="file"
                        name="arModelFile"
                        onChange={handleFileChange}
                        required
                        className="hidden"
                      />
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
                        stroke="currentColor" 
                        fill="none" 
                        viewBox="0 0 48 48" 
                        aria-hidden="true"
                      >
                        <path 
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                          strokeWidth={2} 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                        />
                      </svg>
                      <p className="text-xs text-gray-500">Upload AR model file</p>
                      <label 
                        htmlFor="arModelFile" 
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Select file</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input
                      id="isVegetarian"
                      type="checkbox"
                      name="isVegetarian"
                      checked={dish.isVegetarian}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isVegetarian" className="ml-2 block text-sm text-gray-900">
                      Vegetarian
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="isSpicy"
                      type="checkbox"
                      name="isSpicy"
                      checked={dish.isSpicy}
                      onChange={handleChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isSpicy" className="ml-2 block text-sm text-gray-900">
                      Spicy
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              >
                Create Dish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDishForm;