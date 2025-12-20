import prisma from "../utils/prisma";

export async function createTaskRepo(data: any) {
  return prisma.task.create({ data });
}

export async function getTasksRepo() {
  return prisma.task.findMany();
}

export async function updateTaskRepo(id: string, data: any) {
  return prisma.task.update({ where: { id }, data });
}

export async function deleteTaskRepo(id: string) {
  return prisma.task.delete({ where: { id } });
}

export async function getDashboardTasksRepo() {
  return prisma.task.findMany({
    orderBy: { dueDate: "asc" },
    take: 5,
  });
}