import { registerUser, loginUser } from "../src/services/auth.service";
import prisma from "../src/utils/prisma";

describe("Auth Service", () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should register a new user", async () => {
    const result = await registerUser({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
    expect(result.status).toBe(201);
    expect(result.data.user.email).toBe("test@example.com");
  });

  it("should login an existing user", async () => {
    const result = await loginUser({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.status).toBe(200);
    expect(result.data).toHaveProperty("token");
    expect(result.data.user?.email).toBe("test@example.com");
  });

  it("should fail login with wrong password", async () => {
    const result = await loginUser({
      email: "test@example.com",
      password: "wrong-pass",
    });
    expect(result.status).toBe(401);
  });
});