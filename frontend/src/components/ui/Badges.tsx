import { Priority, Status } from "../../types/task";

export const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const colors = {
        [Priority.LOW]: "bg-emerald-50 text-emerald-700 border-emerald-100",
        [Priority.MEDIUM]: "bg-sky-50 text-sky-700 border-sky-100",
        [Priority.HIGH]: "bg-amber-50 text-amber-700 border-amber-100",
        [Priority.URGENT]: "bg-rose-50 text-rose-700 border-rose-100",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[priority]}`}>
            {priority}
        </span>
    );
};

export const StatusBadge = ({ status }: { status: Status }) => {
    const colors = {
        [Status.TODO]: "bg-slate-100 text-slate-700 border-slate-200",
        [Status.IN_PROGRESS]: "bg-indigo-50 text-indigo-700 border-indigo-100",
        [Status.REVIEW]: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
        [Status.COMPLETED]: "bg-green-50 text-green-700 border-green-100",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status]}`}>
            {status.replace("_", " ")}
        </span>
    );
};
