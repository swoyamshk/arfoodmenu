import { useState } from "react";
import { loginUser } from "../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
  
      if (data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Login successful!");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.data;
  
        if (error.response.status === 401) {
          toast.error("Invalid credentials.");
        } else {
          toast.error(errorMessage || "Login failed. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;