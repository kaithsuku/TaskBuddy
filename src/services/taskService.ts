import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Task } from "../types/task";
import { Timestamp } from "firebase/firestore";

// 🔎 Fetch tasks
export const fetchTasks = async (userId: string): Promise<Task[]> => {
  try {
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("createdBy", "==", userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Task[];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    // toast.error("Failed to load tasks. Please try again.");
    return [];
  }
};

// ✅ Add Task (Fixed)
export const addTask = async (
  task: Omit<Task, "id" | "createdAt" | "updatedAt">
): Promise<Task | null> => {
  try {
    const tasksRef = collection(db, "tasks");

    // Filter out undefined fields
    const filteredTask = Object.fromEntries(
      Object.entries(task).filter(([_, value]) => value !== undefined)
    );

    const newTask = {
      ...filteredTask,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    console.log("Adding task:", newTask);

    // 🔥 Let Firestore generate the document ID
    const docRef = await addDoc(tasksRef, newTask);

    // ✅ Return the task with Firestore's document ID
    return {
      ...task,
      id: docRef.id, // Correct ID from Firestore
      createdAt: newTask.createdAt ? (newTask.createdAt as Timestamp).toDate().toISOString() : "",
      updatedAt: newTask.updatedAt ? (newTask.updatedAt as Timestamp).toDate().toISOString() : "",
    };
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};


// ✅ Update Task (Fixed)
export const updateTask = async (
  taskId: string,
  updatedFields: Partial<Task>
) => {
  try {
    const validFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, value]) => value !== undefined)
    );

    // Ensure attachment is handled
    if ("attachment" in updatedFields && updatedFields.attachment === undefined) {
      validFields.attachment = "";
    }

    // 🔥 Use Firestore's generated document ID, not the task's `id` field
    const taskDoc = doc(db, "tasks", taskId);

    await updateDoc(taskDoc, {
      ...validFields,
      updatedAt: serverTimestamp(),
    });

    console.log("Task updated successfully:", validFields);
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};


// ❌ Delete a task
export const deleteTask = async (taskId: string) => {
  try {
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);
    console.log("Task deleted successfully");
  } catch (error) {
    console.error("Error deleting task:", error);
    // toast.error("Failed to delete task. Please try again.");
    throw error;
  }
};
