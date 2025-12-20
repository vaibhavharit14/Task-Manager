import { useQuery } from "@tanstack/react-query";

type Task = {
  id: string;
  title: string;
  dueDate: string;
  status: string;
  priority: string;
};

export default function Dashboard() {
  const { data: tasks, isLoading, error } = useQuery<Task[]>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch("http://localhost:5001/tasks/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ token header
        },
      });
      const result = await res.json();
      return result.data; // ✅ सिर्फ tasks array return करो
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading tasks</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">My Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {tasks?.map((task) => (
          <div
            key={task.id}
            className="border p-4 rounded shadow bg-white hover:scale-105 transition-transform"
          >
            <h3 className="font-semibold text-indigo-700">{task.title}</h3>
            <p className="text-sm text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              Priority:{" "}
              <span
                className={`px-2 py-1 rounded ${task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
              >
                {task.priority}
              </span>
            </p>
            <p className="text-sm">
              Status:{" "}
              <span
                className={`px-2 py-1 rounded ${task.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {task.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}