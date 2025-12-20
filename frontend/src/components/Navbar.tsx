import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, ListTodo, LogOut, User as UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white px-8 py-4 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
            <ListTodo size={24} className="text-white" />
          </div>
          <h1 className="font-black text-2xl tracking-tighter uppercase text-white">Task <span className="text-indigo-200">Manager</span></h1>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
              >
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                to="/tasks"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
              >
                <ListTodo size={18} />
                <span className="hidden sm:inline">Tasks</span>
              </Link>

              <div className="w-px h-6 bg-white/20 mx-2"></div>

              <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center gap-2 text-indigo-100 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                  <UserIcon size={14} />
                  <span className="text-xs font-black">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-rose-500/80 hover:bg-rose-500 transition-all shadow-md hover:shadow-rose-500/20"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="px-6 py-2 rounded-xl font-bold text-sm hover:bg-white/10 transition-all underline-offset-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-900/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}