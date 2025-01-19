import task_icon from "../assets/task_icon.svg";

const Header = ({ user, onLogout }: { user: { name: string; photo: string }; onLogout: () => void }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white ">
      <div className="flex items-center font-mulish">
        <img src={task_icon} alt="TaskBuddy Logo" className="w-8 h-8 mr-2" />
        <h1 className=" text-xl font-bold">TaskBuddy</h1>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">{user.name}</span>
        <img src={user.photo} alt="User Avatar" className="w-10 h-10 rounded-full" />
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
