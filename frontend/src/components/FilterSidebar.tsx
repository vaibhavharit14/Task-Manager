type FilterProps = {
  onFilterChange: (filter: { status?: string; priority?: string }) => void;
};

export default function FilterSidebar({ onFilterChange }: FilterProps) {
  return (
    <div className="border-r p-4 w-64">
      <h2 className="font-bold mb-4">Filters</h2>
      <div className="space-y-2">
        <select
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Status</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Completed">Completed</option>
        </select>
        <select
          onChange={(e) => onFilterChange({ priority: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </div>
    </div>
  );
}