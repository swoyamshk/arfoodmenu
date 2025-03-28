import { useState } from "react";
import { registerUser } from "../services/authServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = ({ setToken }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { username, email, password, role: "customer" };

    console.log("Sending registration data:", userData);

    try {
      const data = await registerUser(userData);
      console.log("Registration Response:", data);

      if (typeof data === "object" && data.message) {
        if (data.message.includes("User already exists")) {
          toast.error("User already exists");
          return;
        } else {
          toast.success(data.message);
        }
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success("Registration successful!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Main content container with bottom padding */}
      <div className="flex-1 flex justify-center items-center pb-20">
        {" "}
        {/* Added pb-20 */}
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Create your new account
          </h2>
          <p className="text-sm text-gray-600 mb-6 text-center">
            Create an account to start looking for the food you like
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
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
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                required
                className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                Agree with Terms of Service and Privacy Policy
              </span>
            </div>
            <button
              type="submit"
              className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Or sign in with</p>
            <div className="mt-4 flex justify-center space-x-4">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                <img
                  src="https://via.placeholder.com/24"
                  alt="Google"
                  className="h-6 w-6"
                />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                <img
                  src="https://via.placeholder.com/24"
                  alt="Facebook"
                  className="h-6 w-6"
                />
              </button>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
  href="#"
  className="text-blue-500 hover:text-blue-700"
  onClick={(e) => {
    e.preventDefault(); // Prevents default anchor behavior
    navigate("/login");
  }}
>
  Sign in
</a>

            </p>
          </div>
        </div>
      </div>

      {/* Sample fixed bottom navbar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2">
        <div className="max-w-4xl mx-auto flex justify-around">
          <button className="p-2">Home</button>
          <button className="p-2">Cart</button>
          <button className="p-2">Profile</button>
        </div>
      </nav>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;
