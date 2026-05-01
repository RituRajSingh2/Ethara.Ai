import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = [
  { value: "todo", label: "To Do", color: "bg-amber-500" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-500" },
  { value: "done", label: "Done", color: "bg-emerald-500" },
];

const PRIORITY_COLORS = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-red-400",
};

export default function Tasks({ project }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", dueDate: "", priority: "medium", assignedTo: "" });

  const isAdmin = project.admin?._id === user?.id || project.admin === user?.id;

  const fetchTasks = () => {
    API.get(`/tasks?project=${project._id}`).then((r) => setTasks(r.data)).catch(() => {});
  };

  useEffect(() => { fetchTasks(); }, [project._id]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // Find member by email for assignment
      const assignedMember = project.members?.find((m) => m.email === form.assignedTo);
      await API.post("/tasks", {
        ...form,
        project: project._id,
        assignedTo: assignedMember?._id || undefined,
      });
      setShowForm(false);
      setForm({ title: "", description: "", dueDate: "", priority: "medium", assignedTo: "" });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/tasks/${taskId}`, { status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">{project.name}</h2>
          <p className="text-text-muted text-sm">{tasks.length} tasks</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition cursor-pointer"
          >
            + Add Task
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-5 bg-surface-card rounded-xl border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            required
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="sm:col-span-2 px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="sm:col-span-2 px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary resize-none h-20"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
          />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <select
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            className="px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
          >
            <option value="">Assign to...</option>
            {project.members?.map((m) => (
              <option key={m._id} value={m.email}>{m.name} ({m.email})</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition cursor-pointer"
          >
            Create Task
          </button>
        </form>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <p className="text-text-muted text-center py-12">No tasks yet{isAdmin ? ". Click '+ Add Task' to create one." : "."}</p>
        )}
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-surface-card border border-white/5 rounded-xl p-4 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm truncate">{task.title}</h3>
                  <span className={`text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p className="text-text-muted text-xs mb-2 line-clamp-2">{task.description}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                  {task.dueDate && (
                    <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task._id, e.target.value)}
                className="px-3 py-1.5 bg-surface-light border border-white/10 rounded-lg text-xs font-medium text-text focus:outline-none focus:border-primary cursor-pointer"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
