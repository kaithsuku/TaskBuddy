import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddTaskModal = ({
  open,
  onClose,
  onAddTask,
}: {
  open: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    dueDate: string;
    category: string[];
    status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
    createdBy: string;
    attachment?: File | undefined;
  }) => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<"TO-DO" | "IN-PROGRESS" | "COMPLETED">("TO-DO");
  const [attachment, setAttachment] = useState<File | undefined>(undefined);

  const handleCategoryChange = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (title && dueDate && categories.length > 0) {
      onAddTask({
        title,
        description,
        dueDate,
        category: categories,
        status,
        createdBy: localStorage.getItem("user_name") || "",
        attachment: attachment || undefined,
      });
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        {/* Modal Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Create Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Task Title */}
        <TextField
          label="Task Title"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
        />

        {/* Description */}
        <TextField
          label="Description"
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          helperText={`${description.length}/300 characters`}
        />

        {/* Task Category */}
        <Box display="flex" flexDirection="column" mt={2}>
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Task Category*
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            {["Work", "Personal"].map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryChange(category)}
                color={categories.includes(category) ? "primary" : "default"}
                variant={categories.includes(category) ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>

        {/* Due Date */}
        <TextField
          label="Due On*"
          type="date"
          fullWidth
          variant="outlined"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />

        {/* Task Status */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Task Status</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value as "TO-DO" | "IN-PROGRESS" | "COMPLETED")}>
            <MenuItem value="TO-DO">To-Do</MenuItem>
            <MenuItem value="IN-PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>

        {/* File Upload */}
        <Box mt={2}>
          <Typography variant="subtitle1" fontWeight="bold">
            Attachment
          </Typography>
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ mt: 1 }}
          >
            {attachment ? attachment.name : "Drop your files here or Update"}
            <input type="file" hidden onChange={handleFileUpload} />
          </Button>
        </Box>

        {/* Footer Buttons */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!title || !dueDate || categories.length === 0}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTaskModal;
