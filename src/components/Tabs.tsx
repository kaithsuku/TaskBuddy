import React, { Dispatch, SetStateAction } from "react";

interface TabsProps {
  activeTab: "list" | "board"; // Define the specific allowed values
  setActiveTab: Dispatch<SetStateAction<"list" | "board">>; // Correct type
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 border-b">
      <button
        className={`px-4 py-2 ${activeTab === "list" ? "border-b-2 border-blue-500" : ""}`}
        onClick={() => setActiveTab("list")} // Use valid state value
      >
        List
      </button>
      <button
        className={`px-4 py-2 ${activeTab === "board" ? "border-b-2 border-blue-500" : ""}`}
        onClick={() => setActiveTab("board")} // Use valid state value
      >
        Board
      </button>
    </div>
  );
};

export default Tabs;
