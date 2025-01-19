import React, { useState } from "react";
import { TextField, Button, Popover } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface ToolbarProps {
  onAddTask: () => void;
  onSearch: (query: string) => void;
  onFilterChange: (filter: { category: string; startDate: Date | null; endDate: Date | null }) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddTask, onSearch, onFilterChange }) => {
  const [filters, setFilters] = useState<{ category: string; startDate: Date | null; endDate: Date | null }>({
    category: "",
    startDate: null,
    endDate: null,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleFilterChange = (key: string, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDateSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setDateRange([ranges.selection]);
    handleFilterChange("startDate", startDate);
    handleFilterChange("endDate", endDate);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "date-range-popover" : undefined;

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-lg space-y-4 sm:space-y-0 sm:flex-nowrap">
      {/* Left Section: Filters */}
      <div className="flex flex-wrap sm:flex-nowrap items-center space-x-4">
        <label className="text-gray-600 whitespace-nowrap mb-2 sm:mb-0">Filter by:</label>
        <select
          className="border border-gray-300 rounded-[20px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2 sm:mb-0"
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>

        {/* Date Range Picker */}
        <Button
          variant="outlined"
          onClick={handleClick}
          className="border border-gray-300 rounded-[20px] px-3 py-2 text-gray-600 whitespace-nowrap mb-2 sm:mb-0"
        >
          {filters.startDate && filters.endDate
            ? `${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`
            : "Due Date"}
        </Button>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <DateRangePicker ranges={dateRange} onChange={handleDateSelect} moveRangeOnFirstSelection={false} />
        </Popover>
      </div>

      {/* Right Section: Search Bar and Add Task Button */}
      <div className="flex flex-wrap sm:flex-nowrap space-y-2 sm:space-y-0 space-x-0 sm:space-x-4">
        <TextField
          type="text"
          placeholder="Search tasks..."
          variant="outlined"
          size="small"
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            style: { borderRadius: 20, width: "200px" },
          }}
          className="w-full sm:w-auto"
        />

        <Button
          variant="contained"
          sx={{ backgroundColor: "#8A2BE2", textTransform: "none", borderRadius: "20px", padding: "8px 16px" }}
          onClick={onAddTask}
          className="w-full sm:w-auto"
        >
          ADD TASK
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
