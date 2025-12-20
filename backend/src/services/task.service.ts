import prisma from "../utils/prisma";
import { getIO } from "../utils/socket";
import { Priority, Status } from "@prisma/client";

// Generic response type
export type ServiceResponse<T> = {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
};

// ✅ Create Task
export async function createTask(
  data: { title: string; description: string; dueDate?: Date; priority?: Priority; status?: Status; assigneeId?: string },
  creatorId: string
): Promise<ServiceResponse<any>> {
  try {
    const task = await prisma.task.create({
      data: {
        ...data,
        creatorId,
        priority: data.priority || Priority.MEDIUM,
        status: data.status || Status.TODO,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    // 🔴 BROADCAST: Notify everyone about the new task
    try {
      getIO().emit("taskCreated", task);
    } catch (e) { console.error("Socket emit failed", e) }

    // 🔴 NOTIFICATION: Notify assignee if exists
    if (data.assigneeId) {
      try {
        getIO().emit(`notification:${data.assigneeId}`, {
          type: "ASSIGNMENT",
          message: `You have been assigned to task: ${task.title}`,
          taskId: task.id
        });
      } catch (e) { console.error("Socket notification failed", e) }
    }

    return { success: true, status: 201, message: "Task created successfully", data: task };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Server error", data: null };
  }
}

// ✅ Get All Tasks
export async function getTasks(userId: string): Promise<ServiceResponse<any[]>> {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, status: 200, message: "Tasks fetched", data: tasks };
  } catch (err) {
    return { success: false, status: 500, message: "Server error", data: null };
  }
}

// ✅ Update Task
export async function updateTask(
  id: string,
  data: Partial<{ title: string; description: string; dueDate: Date; priority: Priority; status: Status; assigneeId?: string | null }>,
  userId: string
): Promise<ServiceResponse<any>> {
  try {
    // Check if task exists first
    const existingTask = await prisma.task.findUnique({ where: { id } });
    if (!existingTask) return { success: false, status: 404, message: "Task not found", data: null };

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
      },
      include: {
        creator: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true } },
      },
    });

    // 🔴 BROADCAST: Notify everyone about the update
    try {
      getIO().emit("taskUpdated", task);
    } catch (e) { }

    return { success: true, status: 200, message: "Task updated", data: task };
  } catch (err) {
    console.error(err);
    return { success: false, status: 500, message: "Server error", data: null };
  }
}

// ✅ Delete Task
export async function deleteTask(id: string, userId: string): Promise<ServiceResponse<any>> {
  try {
    await prisma.task.delete({ where: { id } });

    // 🔴 BROADCAST: Notify everyone
    try {
      getIO().emit("taskDeleted", { id });
    } catch (e) { }

    return { success: true, status: 200, message: "Task deleted", data: null };
  } catch (err) {
    return { success: false, status: 500, message: "Server error", data: null };
  }
}

// ✅ Dashboard Tasks
export async function getDashboardTasks(userId: string): Promise<ServiceResponse<any[]>> {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { assigneeId: userId }
        ]
      },
      include: {
        assignee: { select: { name: true } }
      },
      orderBy: { dueDate: "asc" },
      take: 5,
    });
    return { success: true, status: 200, message: "Dashboard tasks fetched", data: tasks };
  } catch (err) {
    return { success: false, status: 500, message: "Server error", data: null };
  }
}