import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

export async function registerUser(data: any) {
  const { name, email, password } = data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return { status: 201, data: { user } };
}

export async function loginUser(data: any) {
  const { email, password } = data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return { status: 404, data: { message: "User not found" } };

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return { status: 401, data: { message: "Invalid credentials" } };

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return { status: 200, data: { user, token } };
}