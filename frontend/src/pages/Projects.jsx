import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import Tasks from "./Tasks";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", memberEmails: "" });
  const [error, setError] = useState("");

  const fetchProjects = () => {
    API.get("/projects").then((r) => {
      setProjects(r.data);
      if (r.data.length > 0 && !selected) setSelected(r.data[0]);
    }).catch(() => {});
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const emails = form.memberEmails
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const { data } = await API.post("/projects", { name: form.name, memberEmails: emails });
      setProjects((prev) => [...prev, data]);
      setSelected(data);
      setShowForm(false);
      setForm({ name: "", memberEmails: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Sidebar */}
      <div className="lg:w-72 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Projects</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-9 h-9 flex items-center justify-center bg-primary rounded-lg hover:bg-primary-dark transition text-white text-xl cursor-pointer"
          >
            +
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mb-4 p-4 bg-surface-card rounded-xl border border-white/5 space-y-3">
            {error && <p className="text-danger text-sm">{error}</p>}
            <input
              type="text"
              required
              placeholder="Project name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Member emails (comma separated)"
              value={form.memberEmails}
              onChange={(e) => setForm({ ...form, memberEmails: e.target.value })}
              className="w-full px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="w-full py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition cursor-pointer"
            >
              Create
            </button>
          </form>
        )}

        <div className="space-y-2">
          {projects.map((p) => (
            <button
              key={p._id}
              onClick={() => setSelected(p)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all cursor-pointer ${
                selected?._id === p._id
                  ? "bg-primary/15 border border-primary/30 text-white"
                  : "bg-surface-card border border-white/5 text-text-muted hover:border-white/10"
              }`}
            >
              <p className="font-semibold text-sm">{p.name}</p>
              <p className="text-xs mt-0.5 opacity-60">
                {p.admin?.name === user?.name ? "Admin" : "Member"} · {p.members?.length || 0} members
              </p>
            </button>
          ))}
          {projects.length === 0 && !showForm && (
            <p className="text-text-muted text-sm text-center py-8">No projects yet. Create one!</p>
          )}
        </div>
      </div>

      {/* Tasks */}
      <div className="flex-1 min-w-0">
        {selected ? (
          <Tasks project={selected} />
        ) : (
          <div className="flex items-center justify-center h-64 text-text-muted">
            Select or create a project
          </div>
        )}
      </div>
    </div>
  );
}
