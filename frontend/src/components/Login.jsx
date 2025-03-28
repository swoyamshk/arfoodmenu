import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getUserProfile } from "../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });
  
      // Check if response has data and token
      if (response.data?.token && response.data?.role) {
        // Store token and role in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("userId", response.data.userId);
  
        setToken(response.data.token);
  
        // Navigate based on the role
        navigate(response.data.role === "admin" ? "/create-dish" : "/profile");
  
        toast.success("Login successful!");
      } else {
        // Handle cases where response might not have expected data
        toast.error("Invalid response from server.");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      // Check for specific error responses
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        switch (error.response.status) {
          case 401:
            toast.error("Invalid email or password. Please try again.");
            break;
          case 404:
            toast.error("User not found. Please check your email.");
            break;
          case 403:
            toast.error("Account locked. Please contact support.");
            break;
          default:
            toast.error(error.response.data.message || "Login failed. Please try again.");
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An unexpected error occurred. Please try again.");
      }
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
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
                alt="Google"
                className="h-6 w-6"
              />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png"
                alt="Facebook"
                className="h-6 w-6"
              />
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