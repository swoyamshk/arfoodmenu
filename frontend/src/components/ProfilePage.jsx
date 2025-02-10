import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // Convert to boolean

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); // Convert to boolean
    };

    checkAuth(); // Initial check

    window.addEventListener("storage", checkAuth); // Listen for changes in storage (e.g., login/logout from another tab)

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect if not authenticated
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // Prevent rendering before redirecting
  }

  return (
    <div className="max-w-md mx-auto bg-white p-5 rounded-lg shadow-lg pt-10">
      {/* Profile Header */}
      <div className="bg-orange-500 hover:bg-orange-600 p-4 rounded-lg text-white flex items-center">
        <img
          src="/profile-pic.jpg" 
          alt="Profile"
          className="w-14 h-14 rounded-full border-2 border-white"
        />
        <div className="ml-3">
          <h2 className="text-lg font-bold">Itunuoluwa Abidoye</h2>
          <p className="text-sm">@Itunuoluwa</p>
        </div>
        <button className="ml-auto text-white">✏️</button>
      </div>

      {/* Account Settings */}
      <div className="mt-5 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-gray-700 font-semibold mb-3">Account</h3>
        <div className="space-y-3">
          <ProfileOption title="My Account" description="Make changes to your account" />
          <ProfileOption title="Change Password" description="Update your password for security" />
          <div className="flex justify-between items-center">
            <ProfileOption title="Face ID / Touch ID" description="Manage your device security" />
            <input
              type="checkbox"
              checked={faceIdEnabled}
              onChange={() => setFaceIdEnabled(!faceIdEnabled)}
              className="toggle-checkbox"
            />
          </div>
          <ProfileOption 
            title="Log Out" 
            description="Sign out of your account" 
            isLogout 
            onClick={() => {
              localStorage.removeItem("token"); // Clear token
              setIsLoggedIn(false); // Update state to trigger re-render
              navigate("/login"); // Redirect to login
            }} 
          />
        </div>
      </div>

      {/* More Section */}
      <div className="mt-5 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-gray-700 font-semibold mb-3">More</h3>
        <ProfileOption title="Help & Support" description="Get help and contact support" />
        <ProfileOption title="About App" description="Learn more about this app" />
      </div>
    </div>
  );
};

// Profile option component
const ProfileOption = ({ title, description, isLogout, onClick }) => {
  return (
    <div 
      className={`flex items-center justify-between py-2 ${isLogout ? "text-red-500 cursor-pointer" : "text-gray-700"}`} 
      onClick={onClick}
    >
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <span className="text-gray-400">›</span>
    </div>
  );
};

export default ProfilePage;
