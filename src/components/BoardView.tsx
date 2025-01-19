import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Task } from "../types/task";
import TaskDetailsDialog from "./TaskDetailsDialog";

const BoardView = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  setTasks,
}: {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const groupedTasks: { [key in 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED']: Task[] } = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    "COMPLETED": tasks.filter((task) => task.status === "COMPLETED"),
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const movedTask = groupedTasks[source.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED'][source.index];
    const originalStatus = movedTask.status;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === movedTask.id ? { ...task, status: destination.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED' } : task
      )
    );

    try {
      await onUpdateTask(movedTask.id, { status: destination.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED' });
    } catch (error) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === movedTask.id ? { ...task, status: originalStatus } : task))
      );
    }
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditTask = () => {
    // setIsEditMode(true);
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      onDeleteTask(selectedTask.id);
      handleMenuClose();
    }
  };

  const handleOpenDetails = (task: Task) => {
    setSelectedTask(task);
    // setIsEditMode(false);
    setIsModalOpen(true);
  };

  const getBackgroundColor = (section: string) => {
    switch (section) {
      case "TO-DO": return "#FAC3FF";
      case "IN-PROGRESS": return "#85D9F1";
      case "COMPLETED": return "#CEFFCC";
      default: return "white";
    }
  };

  return (
    <Box width="100%" display="flex" justifyContent="flex-start">
      <Box
        width={isMobile ? "100%" : "70%"}
        display="grid"
        gridTemplateColumns={isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)"}
        gap={3}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <Box
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  bgcolor="#F1F1F1"
                  p={3}
                  borderRadius={4}
                  minHeight={isMobile ? "none" : "60vh"}
                  maxHeight={isMobile ? "none" : "80vh"}
                >
                  <Typography fontWeight="bold" bgcolor={getBackgroundColor(status)} p={1} borderRadius={2} mb={2}>
                    {status}
                  </Typography>
                  {tasks.length === 0 ? (
                    <Typography align="center" color="textSecondary">No Tasks in {status}</Typography>
                  ) : (
                tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          bgcolor="#fff"
                          p={2}
                          mb={2}
                          borderRadius={3}
                          boxShadow={1}
                          onClick={() => handleOpenDetails(task)}
                          minHeight={isMobile ? "none" : "150px"}
                          display="flex"
                          flexDirection="column"
                          justifyContent="space-between"
                          position='relative'
                        >
                          <IconButton
                              size="small"
                              sx={{ position: "absolute", top: 8, right: 8 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                                setSelectedTask(task);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          <Typography fontWeight="bold" sx={{ textDecoration: task.status === "COMPLETED" ? "line-through" : "none" }}>{task.title}</Typography>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">{task.category.join(", ")}</Typography>
                            <Typography variant="caption" color="textSecondary">{task.dueDate}</Typography>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))
                  )}    
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditTask}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteTask}>Delete</MenuItem>
      </Menu>

      {isModalOpen && selectedTask && (
        <TaskDetailsDialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={selectedTask}
          onUpdateTask={onUpdateTask}
        />
      )}
    </Box>
  );
};

export default BoardView;
