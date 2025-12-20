import { createTask, getTasks, updateTask, deleteTask } from "../src/services/task.service";
import prisma from "../src/utils/prisma";

describe("Task Service", () => {
  let testUserId: string;

  beforeAll(async () => {
    await prisma.$connect();

    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@test.com",
        password: "hashedpassword",
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a new task", async () => {
    const result = await createTask(
      {
        title: "Test Task",
        description: "Testing task creation",
        dueDate: new Date(),
        priority: "HIGH",
        status: "TODO",
      },
      testUserId
    );

    expect(result.status).toBe(201);
    expect(result.data!.title).toBe("Test Task");
    expect(result.data!.creatorId).toBe(testUserId);
  });

  it("should fetch tasks", async () => {
    const result = await getTasks(testUserId);

    expect(result.status).toBe(200);
    expect(Array.isArray(result.data)).toBe(true);
  });

  it("should update a task", async () => {
    const created = await createTask(
      {
        title: "Update Me",
        description: "Before update",
        dueDate: new Date(),
        priority: "MEDIUM",
        status: "IN_PROGRESS",
      },
      testUserId
    );

    const result = await updateTask(created.data!.id, { status: "COMPLETED" }, testUserId);

    expect(result.status).toBe(200);
    expect(result.data!.status).toBe("COMPLETED");
    expect(result.message).toBe("Task updated");
  });

  it("should delete a task", async () => {
    const created = await createTask(
      {
        title: "Delete Me",
        description: "Will be deleted",
        dueDate: new Date(),
        priority: "LOW",
        status: "REVIEW",
      },
      testUserId
    );

    const result = await deleteTask(created.data!.id, testUserId);

    expect(result.status).toBe(200);
    expect(result.message).toBe("Task deleted");
  });
});