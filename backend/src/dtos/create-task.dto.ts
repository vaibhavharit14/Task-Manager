export type CreateTaskDTO = {
  title: string;
  description: string;
  dueDate: Date;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "To Do" | "In Progress" | "Review" | "Completed";
  assignedTo?: string;
};