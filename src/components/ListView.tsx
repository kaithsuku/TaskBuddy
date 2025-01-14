import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // Use this icon for expand/collapse
import { Task } from "../types/task";

const ListView = ({ tasks }: { tasks: Task[] | undefined }) => {
  const groupedTasks = {
    "To-Do": tasks?.filter((task) => task.status === "To-Do"),
    "In Progress": tasks?.filter((task) => task.status === "In Progress"),
    Completed: tasks?.filter((task) => task.status === "Completed"),
  };
  return (
    <Box>
      {/* Table Header */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(5, 1fr)"
        alignItems="center"
        textAlign="left"
        mb={2}
        px={2}
        py={1}
        sx={{ fontFamily: "Mulish, sans-serif", fontWeight: "bold" }}
      >
        <Typography>Task Name</Typography>
        <Typography>Due On</Typography>
        <Typography>Task Status</Typography>
        <Typography>Task Category</Typography>
        <Typography>Actions</Typography>
      </Box>
      {/* Task Sections */}
      {Object.entries(groupedTasks).map(([section, tasks]) => (
        <Accordion key={section} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor:
                section === "To-Do"
                  ? "#FAC3FF"
                  : section === "In Progress"
                  ? "#85D9F1"
                  : "#CEFFCC",
              fontWeight: "bold",
              padding: 2,
            }}
          >
            <Typography sx={{ fontWeight: "bold" }}>
              {section} ({tasks?.length})
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {tasks?.length === 0 ? (
              <Typography>No Tasks in {section}</Typography>
            ) : (
              tasks?.map((task) => (
                <Box key={task.id}
                display="grid"
                gridTemplateColumns="40px 1fr 1fr 1fr 40px"
                alignItems="center"
                py={1}
                px={2}>
                  <Typography>{task.title}</Typography>
                  <Typography>{task.dueDate}</Typography>
                  <Typography>{task.status}</Typography>
                  <Typography>{task.category}</Typography>
                </Box>
              ))
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ListView;
