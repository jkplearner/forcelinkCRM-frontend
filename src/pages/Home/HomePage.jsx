import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import DotGrid from "../../components/ui/DotGrid";

export default function HomePage() {
    useEffect(() => {
        const pingBackend = async () => {
            try {
                await fetch(import.meta.env.VITE_BACKEND_URL);
            } catch (error) {
                // Silent fail or log if needed, user just wants to trigger it
                console.error("Wake-up ping failed", error);
            }
        };
        pingBackend();
    }, []);

    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans overflow-x-hidden selection:bg-indigo-500/30">

            {/* Background Layer */}
            <div className="fixed inset-0 z-0 opacity-20">
                <DotGrid />
            </div>

            {/* Navbar - Fixed Top with explicit width and spacing */}
            <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 md:px-12">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20"></div>
                        <span className="text-xl font-bold tracking-tight text-white hidden sm:block">ForceLink CRM</span>
                        <span className="text-xl font-bold tracking-tight text-white sm:hidden">ForceLink</span>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-6 shrink-0">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1"
                        >
                            Log In
                        </Link>
                        <Link to="/signup">
                            <button className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-white/10 transition-all hover:bg-slate-100 hover:scale-105 active:scale-95">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Main Content Area - Relative Z-10 to sit ABOVE background */}
            <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-16 text-center md:pt-36">
                <div className="mx-auto w-full max-w-4xl space-y-10 md:space-y-14">

                    {/* Badge */}
                    <div className="animate-fade-in-up mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Powered by Gemini AI & Salesforce
                    </div>

                    {/* Headline */}
                    <h1 className="animate-fade-in-up mx-auto text-5xl font-extrabold tracking-tight text-white md:text-7xl leading-[1.15]">
                        Simplify Salesforce.<br />
                        <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent bg-300% animate-gradient">
                            Amplify Productivity.
                        </span>
                    </h1>

                    {/* Subheadline - Stakeholder Focused */}
                    <p className="animate-fade-in-up delay-100 mx-auto max-w-2xl text-lg text-slate-400 md:text-xl leading-relaxed">
                        ForceLink CRM bridges the gap between Salesforce complexity and user efficiency.
                        Our lightweight dashboard empowers your team to track leads, view insights,
                        and make decisions faster—powered by Gemini AI.
                    </p>

                    {/* Quote / Feature Card */}
                    <div className="animate-fade-in-up delay-200 mx-auto max-w-3xl transform rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:bg-white/10">
                        <h3 className="text-lg font-semibold text-white mb-3 flex items-center justify-center gap-2">
                            Why ForceLink?
                        </h3>
                        <p className="text-base text-slate-300 italic leading-relaxed">
                            "Employees often find Salesforce overwhelming. ForceLink simplifies this,
                            giving you a clean, focused interface. With Gemini AI, you get automatic
                            insights, task summaries, and natural-language assistance—turning data into action."
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6 mt-8">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <button className="w-full rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-500 hover:-translate-y-1 active:translate-y-0 sm:min-w-[200px]">
                                Get Started Free
                            </button>
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto">
                            <button className="w-full rounded-full border border-slate-700 bg-black/40 px-8 py-4 text-base font-medium text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:-translate-y-1 active:translate-y-0 sm:min-w-[200px]">
                                Live Demo
                            </button>
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
