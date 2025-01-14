import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks, updateTask, deleteTask } from "../services/taskService";
import { Task } from "../types/task";

// Fetch tasks for the current user
export const useTasks = (userId: string) => {
  return useQuery<Task[]>({
    queryKey: ["tasks", userId], // Query key identifies this query
    queryFn: () => getTasks(userId), // Function to fetch tasks
    staleTime: 60000, // Cache data for 1 minute
  });
};

// Add a new task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<string, Error, Task>({
    mutationFn: createTask, // Function to create a task
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks
    },
  });
};

// Update a task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { taskId: string; updatedTask: Partial<Task> }>({
    mutationFn: ({ taskId, updatedTask }) => updateTask(taskId, updatedTask), // Function to update a task
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks
    },
  });
};

// Delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTask, // Function to delete a task
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); // Refetch tasks
    },
  });
};
