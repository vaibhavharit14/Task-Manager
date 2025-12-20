import { useForm } from "react-hook-form";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Lock, UserPlus, ListTodo } from "lucide-react";

type RegisterForm = { name: string; email: string; password: string };

export default function Register() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<RegisterForm>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setServerError(null);
      await registerUser(data.name, data.email, data.password);
      reset();
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setServerError(err?.response?.data?.message || err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-6">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex p-3 sm:p-4 bg-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-sm border border-white/20 mb-4 shadow-2xl">
            <ListTodo size={40} className="text-white sm:w-12 sm:h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tighter uppercase">Task Manager</h1>
          <p className="text-indigo-100 font-medium opacity-80 mt-1 italic text-sm sm:text-base px-4">Join the next generation of productivity.</p>
        </div>

        {/* Form Container with gradient background */}
        <div className="rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 shadow-2xl border border-indigo-500/30">
          <h2 className="text-xl sm:text-2xl font-black text-white mb-6 sm:mb-8 flex items-center gap-2">
            <UserPlus className="text-indigo-200" size={20} />
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-black text-indigo-100 uppercase tracking-widest px-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="John Doe"
                  className="w-full pl-12 h-14 rounded-xl bg-indigo-900/40 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {errors.name && <p className="text-rose-400 text-[10px] mt-1 font-bold italic px-2">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-indigo-100 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="john@example.com"
                  className="w-full pl-12 h-14 rounded-xl bg-indigo-900/40 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {errors.email && <p className="text-rose-400 text-[10px] mt-1 font-bold italic px-2">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-indigo-100 uppercase tracking-widest px-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200" size={18} />
                <input
                  {...register("password", { required: "Password is required" })}
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 h-14 rounded-xl bg-indigo-900/40 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              {errors.password && <p className="text-rose-400 text-[10px] mt-1 font-bold italic px-2">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-rose-500/20 text-rose-200 text-xs p-3 rounded-xl border border-rose-500/30 font-bold">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-base font-bold rounded-xl bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition mt-2"
            >
              {loading ? "Creating Account..." : "Join Now"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-indigo-400/30 text-center">
            <p className="text-indigo-100 font-medium">
              Already a member?{" "}
              <Link to="/login" className="text-white font-black hover:underline underline-offset-4 decoration-2">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
