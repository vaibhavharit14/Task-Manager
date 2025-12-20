import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import type { Task } from "../types/task";
import { Status } from "../types/task";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import { Plus, Filter, SortDesc, Search, LayoutGrid } from "lucide-react";

export default function Tasks() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  useSocket();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const [sort, setSort] = useState<"date-asc" | "date-desc" | "">("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: tasks, isLoading, isError } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await apiClient.get("/tasks");
      return res.data.data;
    },
    enabled: !!user,
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      return apiClient.put(`/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    }
  });

  const handleStatusToggle = (id: string, currentStatus: Status) => {
    const newStatus = currentStatus === Status.COMPLETED ? Status.TODO : Status.COMPLETED;
    updateTaskMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    let result = [...tasks];

    // Search
    if (searchTerm) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter
    if (filter.status) {
      result = result.filter(t => t.status === filter.status);
    }
    if (filter.priority) {
      result = result.filter(t => t.priority === filter.priority);
    }

    // Sort
    if (sort === "date-asc") {
      result.sort((a, b) => (new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()));
    } else if (sort === "date-desc") {
      result.sort((a, b) => (new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime()));
    }

    return result;
  }, [tasks, filter, sort, searchTerm]);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium">Crunching your tasks...</p>
    </div>
  );

  if (isError) return (
    <div className="text-center mt-20">
      <div className="bg-rose-50 text-rose-600 p-4 rounded-xl inline-block border border-rose-100 font-bold">
        Oops! Something went wrong while loading tasks.
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <LayoutGrid className="text-indigo-600" size={32} />
            Task Board
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">Manage, track and dominate your daily goals.</p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 px-6"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar / Controls */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-modern w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
          <div className="flex-grow sm:flex-grow-0 flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
            <Filter size={16} className="text-slate-500 ml-2" />
            <select
              className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none pr-4 w-full sm:w-auto"
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Status</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>

            <select
              className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none pr-4 w-full sm:w-auto"
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="">Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="flex-grow sm:flex-grow-0 flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 px-3">
            <SortDesc size={16} className="text-slate-500" />
            <select
              className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none w-full sm:w-auto"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="">Sort</option>
              <option value="date-asc">Due Date (Earliest)</option>
              <option value="date-desc">Due Date (Latest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              onStatusToggle={handleStatusToggle}
              onEdit={setEditingTask}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center border-2 border-dashed border-slate-100 rounded-3xl">
            <p className="text-slate-400 font-bold text-xl mb-2">No tasks found</p>
            <p className="text-slate-300 text-sm italic mb-6">Create one to get started on your productivity journey!</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-slate-50 hover:bg-slate-100 text-indigo-600 px-6 py-2 rounded-xl font-black text-sm transition-colors border-2 border-indigo-100"
            >
              + Add My First Task
            </button>
          </div>
        )}
      </div>

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />

      <EditTaskModal
        isOpen={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
