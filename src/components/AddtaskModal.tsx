import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
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
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" p={3}>
          <Typography variant="h5" fontWeight="semi-bold" fontFamily={'mulish'}>
            Create Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box px={3}>
          {/* Task Title */}
          <TextField
            placeholder="Task title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            InputProps={{ style: { fontFamily: 'mulish' } }}
          
          />

          {/* Description */}
          <TextField
            placeholder="Description"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            helperText={`${description.length}/300 characters`}
            InputProps={{ style: { fontFamily: 'mulish' } }}
          />

          <Box display="flex" gap={2} mt={2}>
            {/* Task Category */}
            <Box flex={1}>
              <Typography variant="subtitle2" fontWeight="bold" fontFamily={'mulish'}>
                Task Category*
              </Typography>
              <Box display="flex" gap={1}>
                {['Work', 'Personal'].map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => handleCategoryChange(category)}
                    color={categories.includes(category) ? 'primary' : 'default'}
                    variant={categories.includes(category) ? 'filled' : 'outlined'}
                    style={{fontFamily: 'mulish'}}
                  />
                ))}
              </Box>
            </Box>

            {/* Due Date */}
            <TextField
              type="date"
              variant="outlined"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* Task Status */}
            <FormControl fullWidth>
              <Select
                displayEmpty
                value={status}
                onChange={(e) => setStatus(e.target.value as "TO-DO" | "IN-PROGRESS" | "COMPLETED")}
              >
                <MenuItem value="TO-DO">To-Do</MenuItem>
                <MenuItem value="IN-PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* File Upload */}
          <Box mt={3} p={2} border="2px dashed #ccc" borderRadius={2} textAlign="center" sx={{ cursor: 'pointer' }}>
            <input type="file" hidden onChange={handleFileUpload} id="file-upload" />
            <label htmlFor="file-upload">
              <Typography variant="body2" color="textSecondary">
                {attachment ? attachment.name : "Drop your files here or Click to Upload"}
              </Typography>
            </label>
          </Box>
        </Box>

        {/* Footer Buttons */}
        <Box display="flex" justifyContent="flex-end" p={3} bgcolor="#F1F1F1" className="mt-4">
          <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 5, mr: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!title || !dueDate || categories.length === 0}
            sx={{ borderRadius: 5 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddTaskModal;
