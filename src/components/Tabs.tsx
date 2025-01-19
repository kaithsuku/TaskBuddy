import React, { Dispatch, SetStateAction } from "react";
import list_icon from "../assets/list_icon.svg";
import board_icon from "../assets/view-board.svg";


interface TabsProps {
  activeTab: "list" | "board"; 
  setActiveTab: Dispatch<SetStateAction<"list" | "board">>; 
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 border-b bg-white">
      <button
        className={`flex items-center px-4 py-2 ${activeTab === "list" ? "border-b-2 border-blue-500" : ""}`}
        onClick={() => setActiveTab("list")}
      >
        <img src={list_icon} alt="List Icon" className="w-4 h-4 mr-2" />
        List
      </button>
      <button
        className={`flex items-center px-4 py-2 ${activeTab === "board" ? "border-b-2 border-blue-500" : ""}`}
        onClick={() => setActiveTab("board")} 
      >
        <img src={board_icon} alt="Board Icon" className="w-4 h-4 mr-2" />
        Board
      </button>
    </div>
  );
};

export default Tabs;
