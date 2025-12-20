import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface ServiceResponse {
  success: boolean;
  status: number;
  message: string;
  data: any;
}

export async function getUserProfile(id: string): Promise<ServiceResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, status: 404, message: "User not found", data: null };
    }
    return { success: true, status: 200, message: "User profile fetched", data: user };
  } catch (err) {
    return { success: false, status: 500, message: "Server error", data: null };
  }
}

export async function updateUserProfile(id: string, payload: any): Promise<ServiceResponse> {
  try {
    const user = await prisma.user.update({ where: { id }, data: payload });
    return { success: true, status: 200, message: "User profile updated", data: user };
  } catch (err) {
    return { success: false, status: 500, message: "Update failed", data: null };
  }
}