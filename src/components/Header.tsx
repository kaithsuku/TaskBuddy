import React, { useState } from "react";
import task_icon from "../assets/task_icon.svg";
import logout_icon from "../assets/logout.svg";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

const Header = ({ user }: { user: { name: string; photo: string } }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-white relative">
      {/* App Name and Logo Section */}
      <div className="flex items-center font-mulish">
        <img
          src={task_icon}
          alt="TaskBuddy Logo"
          className="w-8 h-8 mr-2 hidden sm:block" // Hide logo on small screens
        />
        <h1 className="text-xl font-bold">TaskBuddy</h1> {/* App name remains visible */}
      </div>

      {/* User Section */}
      <div className="flex items-center space-x-4 relative">
        <span className="text-sm">{user.name}</span>
        <img
          src={user.photo}
          alt="User Avatar"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={() => setDropdownOpen((prev) => !prev)} // Toggle dropdown
        />
        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-md border z-50">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm bg-[#FFF9F9] text-black hover:bg-[#7B1984] hover:text-white border-b last:border-none"
            >
              <img src={logout_icon} alt="Logout Icon" className="w-4 h-4 mr-2 inline-block" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
