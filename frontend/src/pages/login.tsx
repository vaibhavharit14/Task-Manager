import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ListTodo } from "lucide-react";

type LoginForm = { email: string; password: string };

export default function Login() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<LoginForm>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      reset();
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      alert(err?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo + Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 mb-4 shadow-2xl">
            <ListTodo size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Task Manager</h1>
          <p className="text-indigo-100 font-medium opacity-80 mt-1 italic">
            Conquer your day, one task at a time.
          </p>
        </div>

        {/* Form Container with gradient background */}
        <div className="rounded-[2.5rem] p-10 bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 shadow-2xl border border-indigo-500/30">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-2">
            <LogIn className="text-indigo-200" size={24} />
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-indigo-100 uppercase tracking-widest px-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-12 h-14 rounded-xl bg-indigo-900/40 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-indigo-100 uppercase tracking-widest px-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 h-14 rounded-xl bg-indigo-900/40 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-base font-bold rounded-xl bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition"
            >
              {isSubmitting ? "Authenticating..." : "Sign In Now"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-indigo-400/30 text-center">
            <p className="text-indigo-100 font-medium">
              New here?{" "}
              <Link
                to="/register"
                className="text-white font-black hover:underline underline-offset-4 decoration-2"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}