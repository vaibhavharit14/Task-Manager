import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import apiClient from "../utils/apiClient";
import { useQueryClient } from "@tanstack/react-query";
import { Priority, Status } from "../types/task";
import { X } from "lucide-react";

const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    description: z.string().min(1, "Description is required"),
    dueDate: z.string().optional(),
    priority: z.nativeEnum(Priority),
    status: z.nativeEnum(Status),
});

type CreateTaskForm = z.infer<typeof createTaskSchema>;

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function CreateTaskModal({ isOpen, onClose }: Props) {
    const queryClient = useQueryClient();
    const [error, setError] = useState("");

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateTaskForm>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            priority: Priority.MEDIUM,
            status: Status.TODO,
        }
    });

    const onSubmit = async (data: CreateTaskForm) => {
        try {
            setError("");
            await apiClient.post("/tasks", data);
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["dashboard"] });
            reset();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create task");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h2 className="text-xl font-bold">Create New Task</h2>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && (
                        <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-lg mb-4 border border-rose-100 flex items-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Title</label>
                            <input
                                {...register("title")}
                                className="input-modern w-full"
                                placeholder="What needs to be done?"
                            />
                            {errors.title && <p className="text-rose-500 text-[10px] mt-1 font-bold italic">{errors.title.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                            <textarea
                                {...register("description")}
                                className="input-modern w-full min-h-[100px] resize-none"
                                placeholder="Add some details..."
                            />
                            {errors.description && <p className="text-rose-500 text-[10px] mt-1 font-bold italic">{errors.description.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
                            <input type="date" {...register("dueDate")} className="input-modern w-full" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
                                <select {...register("priority")} className="input-modern w-full appearance-none">
                                    {Object.values(Priority).map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                                <select {...register("status")} className="input-modern w-full appearance-none">
                                    {Object.values(Status).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-slate-500 font-semibold hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                            >
                                {isSubmitting ? "Creating..." : "Create Task"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
