import React, { useState } from "react";
import { TextField, Button, Popover } from "@mui/material";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style
import "react-date-range/dist/theme/default.css"; // Theme style

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
    <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
      {/* Filters */}
      <div className="flex space-x-4 items-center">
        <label className="text-gray-600">Filter by:</label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
          <option value="">Category</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Documentation">Documentation</option>
        </select>

        {/* Date Range Picker */}
        <Button
          variant="outlined"
          onClick={handleClick}
          sx={{ textTransform: "none", borderRadius: "20px" }}
        >
          {filters.startDate && filters.endDate
            ? `${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`
            : "Select Date Range"}
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
          <DateRangePicker
            ranges={dateRange}
            onChange={handleDateSelect}
            moveRangeOnFirstSelection={false}
          />
        </Popover>
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-4">
        <TextField
          type="text"
          placeholder="Search tasks..."
          variant="outlined"
          size="small"
          onChange={(e) => onSearch(e.target.value)}
          InputProps={{
            style: { borderRadius: 20, width: "200px" },
          }}
        />
      </div>

      {/* Add Task Button */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#8A2BE2", textTransform: "none", borderRadius: "20px", padding: "8px 16px" }}
        onClick={onAddTask}
      >
        ADD TASK
      </Button>
    </div>
  );
};

export default Toolbar;
