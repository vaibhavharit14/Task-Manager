import { Calendar, User as UserIcon, CheckCircle, Edit, Trash2 } from "lucide-react";
import type { Task } from "../types/task";
import { Status } from "../types/task";
import { PriorityBadge, StatusBadge } from "./ui/Badges";

interface TaskCardProps extends Task {
  onStatusToggle: (id: string, currentStatus: Status) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard(props: TaskCardProps) {
  const { id, title, description, dueDate, priority, status, assignee, onStatusToggle, onEdit, onDelete } = props;
  const dateLabel = dueDate ? new Date(dueDate).toLocaleDateString() : "No due date";
  const isCompleted = status === Status.COMPLETED;

  return (
    <div className={`group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="p-5 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex gap-2">
            <PriorityBadge priority={priority} />
            <StatusBadge status={status} />
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(props)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Edit Task"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-grow cursor-pointer" onClick={() => onEdit(props)}>
          <h3 className={`font-bold text-lg text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors ${isCompleted ? 'line-through text-slate-400' : ''}`}>
            {title}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {description || "No description provided."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-50 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-indigo-400" />
              <span>{dateLabel}</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon size={12} className="text-indigo-400" />
              <span>{assignee ? assignee.name : "Unassigned"}</span>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onStatusToggle(id, status);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all transform active:scale-95 ${isCompleted
                ? 'bg-green-50 text-green-600 hover:bg-green-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }`}
          >
            <CheckCircle size={14} />
            {isCompleted ? "Completed" : "Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}