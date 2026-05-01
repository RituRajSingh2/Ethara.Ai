import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-surface-card/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ethara.Ai
            </h1>
            <div className="flex gap-1">
              <NavLink to="/dashboard" className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`
              }>Dashboard</NavLink>
              <NavLink to="/projects" className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition ${isActive ? "bg-primary/15 text-primary" : "text-text-muted hover:text-text"}`
              }>Projects</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-text-muted">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-sm text-text-muted hover:text-danger border border-white/10 rounded-lg hover:border-danger/30 transition cursor-pointer">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
