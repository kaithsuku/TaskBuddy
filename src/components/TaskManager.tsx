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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
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
    setSelectedTask(task); // Properly set the selected task here
  };
  

  const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  // ✅ Drag and Drop with Backend Sync
  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const movedTask = groupedTasks[source.droppableId as Task["status"]][source.index];
    const originalStatus = movedTask.status;
    const newStatus = destination.droppableId as Task["status"];

    try {
      // Optimistic UI update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === movedTask.id ? { ...task, status: newStatus } : task
        )
      );

      // Backend update
      await onUpdateTask(movedTask.id, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
      // toast.error("Failed to update task status. Reverting changes.");

      // Rollback on failure
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === movedTask.id ? { ...task, status: originalStatus } : task
        )
      );
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task["status"]) => {
    try {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      await onUpdateTask(taskId, { status: newStatus });
    } catch (error) {
      console.error("Error updating task status:", error);
      // toast.error("Failed to update task status. Please try again.");
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
    <Box>
      {/* Header */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        textAlign="left"
        mb={2}
        px={2}
        sx={{ fontWeight: "bold", fontFamily: "Mulish, sans-serif" }}
      >
        <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}>Task Name</Typography>
        <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}>Due On</Typography>
        <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}>Task Status</Typography>
        <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "semi-bold" }}>Task Category</Typography>
      </Box>

      {/* Task Sections */}
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
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: getBackgroundColor(section), borderRadius: 2 }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {section} ({sectionTasks.length})
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: '#F1F1F1', borderRadius: 2 }}>
                  {section === "TO-DO" && isAddingTask && (
                    <>
                      <Box
                        display="grid"
                        gridTemplateColumns="repeat(4, 1fr)"
                        alignItems="center"
                        gap={2}
                        mb={2}
                      >
                        <TextField
                          placeholder="Task Title"
                          value={newTask.title}
                          onChange={(e) =>
                            setNewTask({ ...newTask, title: e.target.value })
                          }
                          size="small"
                        />
                        <TextField
                          type="date"
                          placeholder="Due Date"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                          size="small"
                        />
                        <Select
                          value={newTask.status || "TO-DO"}
                          onChange={(e) =>
                            setNewTask({ ...newTask, status: e.target.value as Task["status"] })
                          }
                          size="small"
                          displayEmpty
                        >
                          <DropdownItem value="TO-DO">TO-DO</DropdownItem>
                          <DropdownItem value="In Progress">In Progress</DropdownItem>
                          <DropdownItem value="Completed">Completed</DropdownItem>
                        </Select>
                        <Select
                          value={newTask.category?.[0] || "Work"}
                          onChange={(e) =>
                            setNewTask({ ...newTask, category: [e.target.value] })
                          }
                          size="small"
                          displayEmpty
                        >
                          <DropdownItem value="Work">Work</DropdownItem>
                          <DropdownItem value="Personal">Personal</DropdownItem>
                        </Select>
                      </Box>
                      <Box display="flex" justifyContent="flex-start" gap={2}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleAddTask}
                        >
                          Add Task
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setIsAddingTask(false)}
                        >
                          Cancel
                        </Button>
                      </Box>
                    </>
                  )}
                  {section === "TO-DO" && !isAddingTask && (
                    <Button
                      onClick={() => setIsAddingTask(true)}
                      startIcon={<AddCircleOutlineIcon />}
                      sx={{ mb: 2 }}
                    >
                      + Add Task
                    </Button>
                  )}
                  {sectionTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          display="grid"
                          gridTemplateColumns="repeat(5, 1fr)"
                          alignItems="center"
                          py={1}
                          px={2}
                          borderBottom="1px solid #e0e0e0"
                          onClick={() => handleTaskClick(task)}
                          sx={{ cursor: "pointer" }}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                          <Checkbox
                            checked={selectedTasks.includes(task.id)}
                            onChange={() => toggleTaskSelection(task.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                            <DragIndicatorIcon />
                            {task.status === "COMPLETED" ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <RadioButtonUncheckedIcon color="disabled" />
                            )}
                            <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "bold", textDecoration: task.status === "COMPLETED" ? "line-through" : "none" }}>{task.title}</Typography>
                          </Box>
                          <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "bold" }}>{task.dueDate}</Typography>
                            <Select
                              value={task.status}
                              onChange={(e) => handleStatusChange(task.id, e.target.value as Task["status"])}
                              size="small"
                              displayEmpty
                              sx={{ 
                              fontFamily: "Mulish, sans-serif", 
                              fontWeight: "bold", 
                              backgroundColor: '#DDDADD', 
                              borderRadius: 3, 
                              padding: 1, 
                              width: '50%', 
                              border: 'none',
                              }}
                            >
                              <DropdownItem value="TO-DO" >TO-DO</DropdownItem>
                              <DropdownItem value="IN-PROGRESS">IN PROGRESS</DropdownItem>
                              <DropdownItem value="COMPLETED">COMPLETED</DropdownItem>
                            </Select>
                          <Typography sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "bold" }}>{task.category.join(", ")}</Typography>
                          <IconButton onClick={(event => handleMenuOpen(event, task))}>
                            <MoreVertIcon />
                          </IconButton>
                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                          >
                            <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
                            <MenuItem onClick={(event) => {
                              handleMenuClose(event);
                              onDeleteTask(task.id);
                            }}>Delete</MenuItem>
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

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <Box
          position="fixed"
          bottom={16}
          left="50%"
          sx={{ transform: "translateX(-50%)", backgroundColor: "#333", borderRadius: 2, p: 2, display: "flex", gap: 2 }}
        >
          <Typography color="white">{selectedTasks.length} Task(s) Selected</Typography>
          <Select
            value=""
            displayEmpty
            onChange={(e) => handleBulkStatusChange(e.target.value as Task["status"])}
          >
            <DropdownItem value="TO-DO">To-Do</DropdownItem>
            <DropdownItem value="IN-PROGRESS">In Progress</DropdownItem>
            <DropdownItem value="COMPLETED">Completed</DropdownItem>
          </Select>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
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
