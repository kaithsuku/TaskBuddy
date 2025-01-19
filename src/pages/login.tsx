import { useNavigate } from "react-router-dom";
import taskManagementUI from "../assets/Task list view 3.svg"; // Replace with the actual path to your UI asset
import backgroundCircle from "../assets/circles_bg.svg"; // Replace with the actual path to your circle asset
import googleLogo from "../assets/google-logo.png"; // Replace with the actual path to your Google logo asset
import { signInWithGoogle } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Logged in user:", user.displayName);
      console.log("Photo:", user.photoURL);
      if (user.displayName) {
        localStorage.setItem("user_name", user.displayName);
      }
      if (user.photoURL) {
        localStorage.setItem("user_photo", user.photoURL);
      }
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-pink-50 overflow-hidden items-center justify-center">
      {/* Background Circle */}
      <img
        src={backgroundCircle}
        alt="Background Circle"
        className="absolute top-[-300px] md:top-0 md:right-0 md:w-[830px] md:h-[830px] w-[500px] h-[500px] z-0"
      />

      {/* Left Section */}
      <div className="z-10 flex flex-col items-center text-center md:items-start md:text-left w-full max-w-lg p-6">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">TaskBuddy</h1>
        <p className="text-gray-600 text-lg mb-6">
          Streamline your workflow and track progress effortlessly with our all-in-one task management app.
        </p>
        <button
          className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-700 focus:ring-offset-2"
          onClick={handleLogin}
        >
          <img src={googleLogo} alt="Google logo" className="w-5 h-5 mr-3" />
          Continue with Google
        </button>
      </div>

      {/* Right Section */}
      <div className="hidden md:hidden lg:flex lg:w-1/2 lg:items-center lg:justify-end z-10">
        <img
          src={taskManagementUI}
          alt="Task Management UI"
          className="absolute w-full max-w-lg right-0"
        />
      </div>
    </div>
  );
};

export default Login;
