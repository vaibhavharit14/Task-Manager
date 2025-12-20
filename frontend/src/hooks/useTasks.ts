import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import type { Task } from "../types/task";

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/tasks");
      return res.data.data;
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: Task) => {
      const res = await apiClient.post("/tasks", task);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const updateTask = useMutation({
    mutationFn: async (task: Task) => {
      const res = await apiClient.put(`/tasks/${task.id}`, task);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return { tasks, isLoading, createTask, updateTask };
}