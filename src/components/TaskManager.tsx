import React, { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
  Select,
  MenuItem as DropdownItem,
  Checkbox,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import plusIcon from "../assets/plus.svg";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Task } from "../types/task";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TaskDetailsDialog from "./TaskDetailsDialog";

const TaskManager = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onAddTask,
  setTasks,
}: {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (newTask: Task) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onTaskClick: (task: Task) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [categoryAnchor, setCategoryAnchor] = useState<null | HTMLElement>(
    null
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    dueDate: "",
    status: "TO-DO",
    category: [],
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkStatusChange = (status: Task["status"]) => {
    selectedTasks.forEach((taskId) => onUpdateTask(taskId, { status }));
    setSelectedTasks([]);
    setIsSnackbarOpen(true);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach((taskId) => onDeleteTask(taskId));
    setSelectedTasks([]);
    setIsSnackbarOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const groupedTasks: { [key in Task["status"]]: Task[] } = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    COMPLETED: tasks.filter((task) => task.status === "COMPLETED"),
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const movedTask =
      groupedTasks[source.droppableId as Task["status"]][source.index];
    const originalStatus = movedTask.status;
    const newStatus = destination.droppableId as Task["status"];

    // Optimistically update the UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === movedTask.id ? { ...task, status: newStatus } : task
      )
    );

    try {
      // Update Firebase
      await onUpdateTask(movedTask.id, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);

      // Revert the UI update if Firebase update fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === movedTask.id ? { ...task, status: originalStatus } : task
        )
      );
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      await onUpdateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      alert("Task title is required!");
      return;
    }

    const newTaskObject: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      dueDate: newTask.dueDate || "",
      status: newTask.status || "TO-DO",
      category: newTask.category || ["Work"],
      description: newTask.description || "",
      createdBy: "defaultUser",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTaskObject);
    setNewTask({ title: "", dueDate: "", status: "TO-DO", category: [] });
    setIsAddingTask(false);
  };

  const getBackgroundColor = (section: string) => {
    switch (section) {
      case "TO-DO":
        return "#FAC3FF";
      case "IN-PROGRESS":
        return "#85D9F1";
      case "COMPLETED":
        return "#CEFFCC";
      default:
        return "white";
    }
  };

  return (
    <Box sx={{ padding: { xs: "10px", sm: "20px" }, overflowX: "hidden" }}>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", sm: "repeat(5, 1fr)" }}
        textAlign="left"
        mb={2}
        px={2}
        sx={{
          fontWeight: "bold",
          fontFamily: "Mulish, sans-serif",
          display: { xs: "none", lg: "grid" },
        }}
      >
        <Typography
          sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}
        >
          Task Name
        </Typography>
        <Typography
          sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}
        >
          Due On
        </Typography>
        <Typography
          sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}
        >
          Task Status
        </Typography>
        <Typography
          sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}
        >
          Task Category
        </Typography>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(groupedTasks).map(([section, sectionTasks]) => (
          <Droppable key={section} droppableId={section}>
            {(provided) => (
              <Accordion
                defaultExpanded
                sx={{ mb: 2, borderRadius: 2 }}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: getBackgroundColor(section),
                    borderRadius: 2,
                  }}
                >
                  <Typography sx={{ fontWeight: "bold" }}>
                    {section === "TO-DO"
                      ? "Todo "
                      : section === "IN-PROGRESS"
                      ? "In-Progress "
                      : "Completed "}
                    ({sectionTasks.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{ backgroundColor: "#F1F1F1", borderRadius: 2 }}
                >
                  {section === "TO-DO" && isAddingTask && (
                    <>
                      <Box
                        display="grid"
                        gridTemplateColumns="1fr 1fr 1fr 1fr 1fr"
                        alignItems="center"
                        gap={2}
                        mb={2}
                        sx={{
                          padding: "12px",
                          backgroundColor: "#F1F1F1",
                          borderRadius: "8px",
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Task Title */}
                        <TextField
                          placeholder="Task Title"
                          variant="standard"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          size="small"
                          InputProps={{
                            style: {
                              fontFamily: "Mulish, sans-serif",
                              fontSize: "14px",
                            },
                          }}
                          sx={{
                            gridColumn: "1 / span 1",
                          }}
                        />

                        {/* Due Date */}
                        <TextField
                          type="date"
                          placeholder="Due Date"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                          size="small"
                          InputProps={{
                            style: {
                              fontFamily: "Mulish, sans-serif",
                              fontSize: "14px",
                            },
                          }}
                          sx={{
                            gridColumn: "2 / span 1",
                          }}
                        />

                        {/* Status Icon Dropdown */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gridColumn: "3 / span 1",
                          }}
                        >
                          <Button
                            onClick={(e) => setStatusAnchor(e.currentTarget)}
                            sx={{
                              backgroundColor: "#F1F1F1",
                              borderRadius: "100%",
                              padding: "8px",
                              border: "1px solid #CCC",
                            }}
                          >
                            <Typography className="text-black">+</Typography>
                          </Button>
                          <Menu
                            anchorEl={statusAnchor}
                            open={Boolean(statusAnchor)}
                            onClose={() => setStatusAnchor(null)}
                          >
                            <MenuItem
                              onClick={() =>
                                setNewTask({ ...newTask, status: "TO-DO" })
                              }
                            >
                              TO-DO
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                setNewTask({
                                  ...newTask,
                                  status: "IN-PROGRESS",
                                })
                              }
                            >
                              IN-PROGRESS
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                setNewTask({ ...newTask, status: "COMPLETED" })
                              }
                            >
                              COMPLETED
                            </MenuItem>
                          </Menu>
                        </Box>

                        {/* Category Icon Dropdown */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gridColumn: "4 / span 1",
                          }}
                        >
                          <Button
                            onClick={(e) => setCategoryAnchor(e.currentTarget)}
                            sx={{
                              backgroundColor: "#F1F1F1",
                              borderRadius: "100%",
                              padding: "8px",
                              border: "1px solid #CCC",
                            }}
                          >
                            <Typography className="text-black">+</Typography>
                          </Button>
                          <Menu
                            anchorEl={categoryAnchor}
                            open={Boolean(categoryAnchor)}
                            onClose={() => setCategoryAnchor(null)}
                          >
                            <MenuItem
                              onClick={() =>
                                setNewTask({ ...newTask, category: ["Work"] })
                              }
                            >
                              Work
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                setNewTask({
                                  ...newTask,
                                  category: ["Personal"],
                                })
                              }
                            >
                              Personal
                            </MenuItem>
                          </Menu>
                        </Box>
                      </Box>

                      {/* Buttons */}
                      <Box display="flex" justifyContent="flex-start" gap={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddTask}
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            padding: "8px 16px",
                            fontFamily: "Mulish, sans-serif",
                            fontSize: "14px",
                            backgroundColor: "#8A2BE2",
                            "&:hover": {
                              backgroundColor: "#7B1984",
                            },
                          }}
                        >
                          Add Task
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setIsAddingTask(false)}
                          sx={{
                            textTransform: "none",
                            borderRadius: "20px",
                            padding: "8px 16px",
                            fontFamily: "Mulish, sans-serif",
                            fontSize: "14px",
                            color: "#8A2BE2",
                            borderColor: "#8A2BE2",
                            "&:hover": {
                              backgroundColor: "#F2E4F8",
                            },
                          }}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  )}

                  {/* Add Task Button */}
                  {section === "TO-DO" && !isAddingTask && (
                    <Button
                      onClick={() => setIsAddingTask(true)}
                      className="flex items-center"
                      sx={{
                        color: "#8A2BE2",
                        fontFamily: "Mulish, sans-serif",
                        textTransform: "none",
                        fontSize: "14px",
                      }}
                    >
                      <img
                        src={plusIcon}
                        alt="Add Task"
                        className="w-4 h-4 mr-2"
                      />
                      Add Task
                    </Button>
                  )}

                  {sectionTasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          display="grid"
                          gridTemplateColumns={{
                            xs: "1fr",
                            lg: "repeat(5, 1fr)",
                          }}
                          alignItems="center"
                          py={1}
                          px={2}
                          borderBottom="1px solid #e0e0e0"
                          onClick={() => handleTaskClick(task)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            {task.status === "COMPLETED" && (
                              <CheckCircleIcon
                                color="success"
                                sx={{ display: { xs: "none", lg: "inline" } }}
                              />
                            )}
                            {task.status !== "COMPLETED" && (
                              <RadioButtonUncheckedIcon
                                color="disabled"
                                sx={{ display: { xs: "none", lg: "inline" } }}
                              />
                            )}
                            <Checkbox
                              checked={selectedTasks.includes(task.id)}
                              onChange={() => toggleTaskSelection(task.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <DragIndicatorIcon />
                            <Typography
                              sx={{
                                fontFamily: "Mulish, sans-serif",
                                fontWeight: "bold",
                                textDecoration:
                                  task.status === "COMPLETED"
                                    ? "line-through"
                                    : "none",
                              }}
                            >
                              {task.title}
                            </Typography>
                          </Box>
                          <Typography
                            sx={{
                              fontFamily: "Mulish, sans-serif",
                              display: { xs: "none", lg: "inline" },
                            }}
                          >
                            {task.dueDate}
                          </Typography>
                          <Select
                            value={task.status}
                            onClick={(e) => e.stopPropagation()} // Prevents triggering the onClick for the task row
                            onChange={(e) =>
                              handleStatusChange(
                                task.id,
                                e.target.value as Task["status"]
                              )
                            }
                            size="small"
                            displayEmpty
                            sx={{
                              fontFamily: "Mulish, sans-serif",
                              fontWeight: "semi-bold",
                              backgroundColor: "#DDDADD",
                              borderRadius: 3,
                              padding: 1,
                              width: "75%",
                              border: "none",
                              display: { xs: "none", lg: "inline" },
                            }}
                          >
                            <DropdownItem value="TO-DO">TO-DO</DropdownItem>
                            <DropdownItem value="IN-PROGRESS">
                              IN PROGRESS
                            </DropdownItem>
                            <DropdownItem value="COMPLETED">
                              COMPLETED
                            </DropdownItem>
                          </Select>

                          <Typography
                            sx={{
                              fontFamily: "Mulish, sans-serif",
                              display: { xs: "none", lg: "inline" },
                            }}
                          >
                            {task.category.join(", ")}
                          </Typography>
                          <IconButton
                            onClick={(event) => handleMenuOpen(event, task)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                            <MenuItem
                              onClick={(event) => {
                                handleMenuClose(event);
                                onDeleteTask(task.id);
                              }}
                            >
                              Delete
                            </MenuItem>
                          </Menu>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </AccordionDetails>
              </Accordion>
            )}
          </Droppable>
        ))}
      </DragDropContext>
      {selectedTask && (
        <TaskDetailsDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          task={selectedTask}
          onUpdateTask={onUpdateTask}
        />
      )}

      {selectedTasks.length > 0 && (
        <Box
          position="fixed"
          bottom={16}
          left="50%"
          sx={{
            transform: "translateX(-50%)",
            backgroundColor: "#222",
            borderRadius: "16px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            width: "50%",
            border: "1px solid #444",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Tasks Selected Box */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 12px",
              borderRadius: "12px",
              border: "1px solid white",
              color: "white",
              fontWeight: "bold",
              gap: 1,
              backgroundColor: "#333",
              cursor: "pointer",
            }}
            onClick={() => setSelectedTasks([])} // Clear selection when clicked
          >
            {selectedTasks.length} Task(s) Selected
            <Box
              sx={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "#444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "white",
                cursor: "pointer",
              }}
            >
              ×
            </Box>
          </Box>

          {/* Status Dropdown */}
          <Select
            value=""
            displayEmpty
            onChange={(e) =>
              handleBulkStatusChange(e.target.value as Task["status"])
            }
            sx={{
              backgroundColor: "#444",
              color: "white",
              borderRadius: "8px",
              width: "30%",
              "& .MuiSelect-icon": { color: "white" },
            }}
          >
            <DropdownItem value="" disabled>
              Status
            </DropdownItem>
            <DropdownItem value="TO-DO">To-Do</DropdownItem>
            <DropdownItem value="IN-PROGRESS">In Progress</DropdownItem>
            <DropdownItem value="COMPLETED">Completed</DropdownItem>
          </Select>

          {/* Delete Button */}
          <Button
            variant="contained"
            color="error"
            onClick={handleBulkDelete}
            sx={{
              backgroundColor: "#D32F2F",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              "&:hover": {
                backgroundColor: "#B71C1C",
              },
            }}
          >
            Delete
          </Button>
        </Box>
      )}
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        message="Action completed successfully!"
      />
    </Box>
  );
};

export default TaskManager;
