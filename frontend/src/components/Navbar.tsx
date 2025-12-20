import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { LayoutDashboard, ListTodo, LogOut, User as UserIcon, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-600 text-white px-4 sm:px-8 py-4 sticky top-0 z-50 shadow-lg backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-white/20 p-2 rounded-xl group-hover:bg-white/30 transition-colors">
            <ListTodo size={20} className="text-white sm:w-6 sm:h-6" />
          </div>
          <h1 className="font-black text-xl sm:text-2xl tracking-tighter uppercase text-white">
            Task <span className="text-indigo-200">Manager</span>
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/tasks"
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/10 transition-all font-bold text-sm"
              >
                <ListTodo size={18} />
                <span>Tasks</span>
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Sidebar/Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] bg-indigo-900/95 backdrop-blur-xl z-50 animate-in slide-in-from-right duration-300">
          <div className="flex flex-col p-6 gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/10 mb-2">
                  <div className="bg-indigo-500 p-2 rounded-xl">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Logged in as</p>
                    <p className="font-black text-lg">{user.name}</p>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-lg"
                >
                  <LayoutDashboard size={24} className="text-indigo-300" />
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all font-bold text-lg"
                >
                  <ListTodo size={24} className="text-indigo-300" />
                  Tasks
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-all font-bold text-lg mt-4 border border-rose-500/20"
                >
                  <LogOut size={24} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 pt-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 rounded-2xl font-bold text-lg bg-white/5 text-center hover:bg-white/10 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 rounded-2xl font-black text-lg bg-white text-indigo-600 text-center hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-900/40"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
