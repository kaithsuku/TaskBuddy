import  { useState, useEffect } from "react";
import Header from "../components/Header";
import Tabs from "../components/Tabs";
import Toolbar from "../components/Toolbar";
import AddTaskModal from "../components/AddtaskModal";
import TaskDetailsDialog from "../components/TaskDetailsDialog";
import { fetchTasks, addTask, updateTask, deleteTask } from "../services/taskService";
import { Task } from "../types/task";
import TaskManager from "../components/TaskManager";
import BoardView from "../components/BoardView";

const Home = () => {
  const [activeTab, setActiveTab] = useState<"list" | "board">("list");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<{ category: string; startDate: Date | null; endDate: Date | null }>({
    category: "",
    startDate: null,
    endDate: null,
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };
  

  const user = {
    name: localStorage.getItem("user_name") || "",
    photo: localStorage.getItem("user_photo") || "",
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(user.name);
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, [user.name]);

  const handleAddTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newTask = await addTask(taskData);
      if (newTask) {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        applyFilters(updatedTasks, filters, searchQuery);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  const handleUpdateTask = async (taskId: string, updatedFields: Partial<Task>) => {
    try {
      await updateTask(taskId, updatedFields);
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, ...updatedFields, updatedAt: new Date().toISOString() } : task
      );
      setTasks(updatedTasks);
      applyFilters(updatedTasks, filters, searchQuery);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
      applyFilters(updatedTasks, filters, searchQuery);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(tasks, filters, query);
  };

  const handleFilterChange = (updatedFilters: {
    category: string;
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setFilters(updatedFilters);
    applyFilters(tasks, updatedFilters, searchQuery);
  };
  
  const applyFilters = (allTasks: Task[], appliedFilters: typeof filters, searchQuery: string) => {
    let filtered = [...allTasks];
  
    // Filter by category
    if (appliedFilters.category) {
      filtered = filtered.filter((task) => task.category.includes(appliedFilters.category));
    }
  
    // Filter by date range
    if (appliedFilters.startDate && appliedFilters.endDate) {
      const start = new Date(appliedFilters.startDate).setHours(0, 0, 0, 0);
      const end = new Date(appliedFilters.endDate).setHours(23, 59, 59, 999);
      filtered = filtered.filter((task) => {
        const taskDueDate = new Date(task.dueDate).getTime();
        return taskDueDate >= start && taskDueDate <= end;
      });
    }
  
    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    setFilteredTasks(filtered);
  };
  
  


  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main className="p-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <Toolbar
          onAddTask={() => setIsModalOpen(true)}
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />
        <div className="p-5">
          {activeTab === "list" ? (
            <TaskManager
            tasks={filteredTasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onAddTask={handleAddTask}
            setTasks={setTasks}
            onTaskClick={handleTaskClick} 
          />
          
          ) : (
            <BoardView
              tasks={filteredTasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              setTasks={setTasks}
            />
          )}
        </div>
      </main>

      {isModalOpen && (
        <AddTaskModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}

      {selectedTask && (
        <TaskDetailsDialog
          open={isDialogOpen}
          task={selectedTask}
          onClose={() => setIsDialogOpen(false)}
          onUpdateTask={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default Home;
