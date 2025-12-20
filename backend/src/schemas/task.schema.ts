import { z } from "zod";

export const PriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const StatusEnum = z.enum(["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"]);

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined), // Allow string input for date
    priority: PriorityEnum.optional().default("MEDIUM"),
    status: StatusEnum.optional().default("TODO"),
    assigneeId: z.string().uuid().optional(),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().min(1).optional(),
    dueDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    priority: PriorityEnum.optional(),
    status: StatusEnum.optional(),
    assigneeId: z.string().uuid().optional().nullable(), // Allow unassigning
});
