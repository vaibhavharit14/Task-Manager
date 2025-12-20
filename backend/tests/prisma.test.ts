import prisma from "../src/utils/prisma";

describe("Prisma Client", () => {
  let testUserId: string;

  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should connect to the database", async () => {
    await expect(prisma.$connect()).resolves.not.toThrow();
  });

  it("should create a user", async () => {
    const user = await prisma.user.create({
      data: {
        name: "Prisma Test",
        email: "prisma@test.com",
        password: "hashedpassword",
      },
    });
    testUserId = user.id;
    expect(user.email).toBe("prisma@test.com");
  });

  it("should create a task linked to user", async () => {
    const task = await prisma.task.create({
      data: {
        title: "Prisma Task",
        description: "Testing Prisma task",
        dueDate: new Date(),
        priority: "HIGH",
        status: "TODO",
        creator: {
          connect: { id: testUserId },
        },
      },
    });
    expect(task.title).toBe("Prisma Task");
    expect(task.creatorId).toBe(testUserId);
  });
});