"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface HealthStatus {
  status: string;
  message: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from Spring Boot backend health check
    fetch("http://localhost:8080/api/health")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: HealthStatus) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to connect to backend:", err);
        setError("Could not connect to backend server");
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              R
            </div>
            <span className="font-semibold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32">
          {/* Background mesh */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900/15),theme(colors.zinc.950))]" />
          <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />
          <div className="absolute bottom-10 left-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/5 blur-[120px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-xs font-medium text-indigo-400 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
              Powered by Advanced AI Copilot
            </div>
            
            <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              Create an{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ATS-Optimized
              </span>{" "}
              Resume in Minutes
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
              Write stronger resume bullet points, analyze keywords, match job descriptions, and download selectable, professional PDFs designed to pass any applicant tracking system.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/dashboard" className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-xl shadow-indigo-500/25 hover:bg-indigo-500 hover:shadow-indigo-500/30 transition-all duration-200">
                Build Your Resume
              </Link>
              <Link href="/dashboard" className="rounded-full border border-zinc-700 bg-zinc-900/50 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-200">
                View Templates
              </Link>
            </div>

            {/* Live Connection Checker Card */}
            <div className="mx-auto mt-16 max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                API Service Verification
              </h3>
              {loading ? (
                <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
                  <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Connecting to Spring Boot backend...
                </div>
              ) : error ? (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Offline / Connection Failed
                  </div>
                  <p className="text-xs text-zinc-500 mt-2">
                    Make sure the Spring Boot backend server is running on port 8080.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Connected to Backend Successfully
                  </div>
                  <div className="text-xs text-zinc-400 text-center">
                    <p className="font-mono bg-zinc-950 py-1.5 px-3 rounded border border-zinc-800 mt-1">
                      Status: {health?.status} | Message: {health?.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-zinc-500">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
