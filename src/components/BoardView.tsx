import React from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { Task } from "../types/task";

const BoardView = ({
  tasks,
  onUpdateTask,
  onDeleteTask,
  setTasks,  // <-- Add this prop to update tasks locally
}: {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedFields: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;  // <-- Type for setTasks
}) => {
  const groupedTasks: { [key in 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED']: Task[] } = {
    "TO-DO": tasks.filter((task) => task.status === "TO-DO"),
    "IN-PROGRESS": tasks.filter((task) => task.status === "IN-PROGRESS"),
    "COMPLETED": tasks.filter((task) => task.status === "COMPLETED"),
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
  
    const { source, destination } = result;
  
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
  
    // Find the moved task
    const movedTask = groupedTasks[source.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED'][source.index];
    const originalStatus = movedTask.status;  // Save original status for rollback
  
    // Optimistically update the UI
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === movedTask.id ? { ...task, status: destination.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED' } : task
      )
    );
  
    try {
      // Update the task in Firestore
      await onUpdateTask(movedTask.id, { status: destination.droppableId as 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED' });
    } catch (error) {
      // ❌ Rollback if update fails
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === movedTask.id ? { ...task, status: originalStatus } : task
        )
      );
      // toast.error("Failed to move the task. Please try again.");  // 🔔 Show error
    }
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap={4}>
        {Object.entries(groupedTasks).map(([status, tasks]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                bgcolor='#F1F1F1'
                p={2}
                borderRadius={4}
                minHeight='500px'
              >
                <div
                  className="flex items-center justify-between w-1/2 p-2 mb-2 rounded-md "
                  style={{ backgroundColor: getBackgroundColor(status) }}
                >
                  <Typography fontWeight="bold" fontFamily={'"Mulish", sans-serif'}>
                    {status}
                  </Typography>
                </div>
                {tasks.map((task, index) => (
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
                        display="flex"
                        flexDirection="column"
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                            {task.status === "COMPLETED" ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <RadioButtonUncheckedIcon color="disabled" />
                            )}
                            <Typography fontWeight="bold">{task.title}</Typography>
                          </Box>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {task.category.join(", ")}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {task.dueDate}
                        </Typography>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        ))}
      </Box>
    </DragDropContext>
  );
};

export default BoardView;
