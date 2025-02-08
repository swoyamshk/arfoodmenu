import React, { useState } from 'react';
import { createMenuCategory } from '../services/menuServices';  // Import the createMenuCategory function

const CreateMenuCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCategory = {
            Name: name,
            Description: description,
        };

        try {
            // Call the createMenuCategory API function
            const response = await createMenuCategory(newCategory);
            setMessage(`Menu Category created successfully! ID: ${response.Id}`);
        } catch (error) {
            setMessage('Error creating Menu Category');
            console.error(error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Create Menu Category</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        className="mt-2 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    ></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Create Category
                </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        </div>
    );
};

export default CreateMenuCategory;
