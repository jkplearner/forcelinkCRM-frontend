import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Home } from "lucide-react";
import DotGrid from "../../components/ui/DotGrid";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setLoading(false);
                setError(data.error || "Login failed");
                return;
            }

            // Store token
            localStorage.setItem("token", data.token);
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Alert Success
            alert("Login successful!");

            // Redirect to dashboard/home
            navigate("/dashboard");

        } catch (err) {
            console.error(err);
            setError("Server is waking up... try again in 5 seconds.");
        }

        setLoading(false);
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white selection:bg-indigo-500/30">
            {/* Background */}
            <div className="fixed inset-0 z-0">
                <DotGrid />
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
                {/* Back to Home Link */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-2xl p-3 pr-4 flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-900/80 transition-all group"
                >
                    <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-all">
                        <Home size={20} />
                    </div>
                    <span className="font-medium">Back to Home</span>
                </Link>

                <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            ForceLink CRM
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">Welcome back! Please log in.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-indigo-400 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 group"
                        >
                            {loading ? "Logging in..." : "Log In"}
                            {!loading && (
                                <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-xs text-slate-500">
                        Don't have an account?
                        <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 ml-1 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
