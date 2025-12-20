import prisma from "../utils/prisma";

export async function getUserRepo(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function updateUserRepo(id: string, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export async function createUserRepo(data: any) {
  return prisma.user.create({ data });
}

export async function findUserByEmailRepo(email: string) {
  return prisma.user.findUnique({ where: { email } });
}