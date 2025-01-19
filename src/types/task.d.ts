export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string[]; 
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachment?: File | undefined  ;
}
