export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string[]; // Updated to an array
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED"; // Explicit types
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachment?: File | undefined  ;
}
