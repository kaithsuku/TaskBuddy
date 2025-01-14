import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  Chip,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Task } from "../types/task";

interface TaskDetailsDialogProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: string, updatedFields: Partial<Task>) => void;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({ open, task, onClose, onUpdateTask }) => {
  const [updatedTask, setUpdatedTask] = React.useState<Partial<Task>>(task || {});

  React.useEffect(() => {
    if (task) setUpdatedTask(task);
  }, [task]);

  const handleFieldChange = (key: keyof Task, value: any) => {
    setUpdatedTask((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdate = () => {
    if (task && updatedTask) {
      onUpdateTask(task.id, updatedTask);
      onClose();
    }
  };

  if (!task) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Edit Task
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Title */}
          <TextField
            label="Title"
            value={updatedTask.title || ""}
            onChange={(e) => handleFieldChange("title", e.target.value)}
            fullWidth
          />

          {/* Description */}
          <TextField
            label="Description"
            multiline
            rows={4}
            value={updatedTask.description || ""}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            fullWidth
          />

          {/* Categories */}
          <Box display="flex" gap={2}>
            <Typography>Task Category:</Typography>
            {["Work", "Personal", "Documentation"].map((category) => (
              <Chip
                key={category}
                label={category}
                color={updatedTask.category?.includes(category) ? "primary" : "default"}
                onClick={() =>
                  handleFieldChange("category", [category])
                }
              />
            ))}
          </Box>

          {/* Due Date */}
          <TextField
            label="Due Date"
            type="date"
            value={updatedTask.dueDate || ""}
            onChange={(e) => handleFieldChange("dueDate", e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          {/* Status */}
          <Select
            label="Status"
            value={updatedTask.status || "TO-DO"}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            fullWidth
          >
            <MenuItem value="TO-DO">TO-DO</MenuItem>
            <MenuItem value="IN-PROGRESS">IN-PROGRESS</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
          </Select>

          {/* Attachment */}
          <Typography>Attachment</Typography>
          <Button variant="outlined" component="label">
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => handleFieldChange("attachment", e.target.files?.[0])}
            />
          </Button>

          {/* Activity Log */}
          <Divider />
          <Typography variant="h6">Activity Log</Typography>
          <Box sx={{ backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}>
            {[
              `You created this task on ${new Date(task.createdAt).toLocaleString()}`,
              ...(task.updatedAt !== task.createdAt
              ? [`You last updated this task on ${new Date(task.updatedAt).toLocaleString()}`]
              : []),
              ...(task.attachment ? ["You uploaded a file."] : []),
            ].map((log, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              {log}
              </Typography>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleUpdate} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;