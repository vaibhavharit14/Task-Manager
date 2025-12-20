import { useQuery } from "@tanstack/react-query";
import apiClient from "../utils/apiClient";
import type { Task } from "../types/task";
import { Priority, Status } from "../types/task";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { PriorityBadge, StatusBadge } from "../components/ui/Badges";
import { Clock, AlertCircle, LayoutDashboard, History, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  useSocket();

  const { data: tasks, isLoading: tasksLoading } = useQuery<Task[]>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await apiClient.get("/tasks/dashboard");
      return res.data.data;
    },
    enabled: !!user,
  });

  if (authLoading || tasksLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium italic">Preparing your command center...</p>
      </div>
    );
  }

  if (!user) return <p className="text-center mt-10">Please login.</p>;

  // Basic Stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === Status.COMPLETED).length || 0;
  const highPriorityTasks = tasks?.filter(t => t.priority === Priority.URGENT || t.priority === Priority.HIGH).length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-8 sm:space-y-10">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
          <LayoutDashboard className="text-indigo-600 shrink-0" size={28} />
          <span className="truncate">Welcome back, {user.name}!</span>
        </h2>
        <p className="text-slate-500 mt-1 font-medium italic text-sm sm:text-base">Here's a quick look at your current productivity state.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <History size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800">{totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">Completed</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-600">{completedTasks}</p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider">High Priority</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-600">{highPriorityTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Clock className="text-indigo-400" size={20} />
          Recent Activity
        </h3>

        {tasks?.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 card-hover flex flex-col h-full ring-1 ring-slate-200/5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <PriorityBadge priority={task.priority} />
                    <StatusBadge status={task.status} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{task.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-6 flex-grow">{task.description}</p>

                <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-auto border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-indigo-400" />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"}</span>
                  </div>
                  <span className="bg-slate-50 px-2 py-0.5 rounded text-indigo-600 border border-slate-100 italic">
                    {task.assignee ? task.assignee.name : "Unassigned"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100 flex flex-col items-center">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <LayoutDashboard size={40} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold text-lg">Your activity stream is quiet.</p>
            <p className="text-slate-300 text-sm italic mb-6">Time to conquer some tasks!</p>
          </div>
        )}
      </div>
    </div>
  );
}
