export type User = {
  id: string;
  name: string;
  email: string;
};

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export const Priority = {
  LOW: "LOW" as Priority,
  MEDIUM: "MEDIUM" as Priority,
  HIGH: "HIGH" as Priority,
  URGENT: "URGENT" as Priority,
};

export type Status = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
export const Status = {
  TODO: "TODO" as Status,
  IN_PROGRESS: "IN_PROGRESS" as Status,
  REVIEW: "REVIEW" as Status,
  COMPLETED: "COMPLETED" as Status,
};

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: Priority;
  status: Status;
  creatorId: string;
  creator?: User;
  assigneeId?: string;
  assignee?: User;
  createdAt: string;
  updatedAt: string;
};