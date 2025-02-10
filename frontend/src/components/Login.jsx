import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jwt_decode from "jwt-decode";  // Import jwt-decode

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser({ email, password });
  
      if (data?.token && data?.role) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setToken(data.token);
  
        // Navigate based on the role
        navigate(data.role === "admin" ? "/create-dish" : "/profile");
  
        toast.success("Login successful!");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };
  
  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to your account
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a href="#" className="text-sm text-blue-500 hover:text-blue-700 mt-2 block">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign in
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Or sign in with</p>
          <div className="mt-4 flex justify-center space-x-4">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <img src="https://via.placeholder.com/24" alt="Google" className="h-6 w-6" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <img src="https://via.placeholder.com/24" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <a href="#" className="text-blue-500 hover:text-blue-700" onClick={handleRegisterClick}>Register</a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
