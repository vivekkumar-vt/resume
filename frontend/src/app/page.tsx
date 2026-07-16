"use client";

import React, { useState } from "react";
import Link from "next/link";

const renderTemplateThumbnail = (id: string) => {
  const fallbackId = [
    "executive-classic",
    "modern-corporate",
    "elegant-minimal",
    "neo-gradient",
    "professional-timeline",
    "premium-blocks",
    "classic",
    "modern",
    "minimal",
    "professional",
    "compact"
  ].includes(id) ? id : "classic";

  return (
    <div className="w-full h-36 bg-zinc-950 rounded-lg border border-zinc-800 mb-3 overflow-hidden flex items-center justify-center p-2 group-hover:border-indigo-500/40 transition-colors">
      <img 
        src={`/templates/${fallbackId}.svg`} 
        alt={`${id} Preview`} 
        className="max-w-full max-h-full object-contain rounded"
      />
    </div>
  );
};

export default function Home() {
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const templatesList = [
    { id: "executive-classic", label: "Executive Classic", tag: "ATS Friendly", desc: "Centered formal design for senior positions." },
    { id: "elegant-minimal", label: "Elegant Minimal", tag: "Minimalist", desc: "Clean serif/sans-serif monochromatic aesthetic." },
    { id: "neo-gradient", label: "Neo Gradient", tag: "Creative", desc: "Creative layout featuring a profile photo and contact details grid." },
    { id: "professional-timeline", label: "Professional Timeline", tag: "ATS Friendly", desc: "Elegant serif font design with full-width horizontal divider lines." },
  ];

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
            <Link href="/auth/register" className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 px-4 py-2 text-sm font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all duration-200">
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
              <button 
                onClick={() => setShowTemplatesModal(true)}
                className="rounded-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 px-6 py-3 font-bold text-zinc-950 shadow-xl shadow-emerald-500/25 transition-all duration-200"
              >
                Build Your Resume
              </button>
              <button 
                onClick={() => setShowTemplatesModal(true)}
                className="rounded-full border border-zinc-700 bg-zinc-900/50 px-6 py-3 font-semibold text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors duration-200"
              >
                Choose a Template
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Templates Modal */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800">
              <div>
                <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
                <p className="text-zinc-400 text-sm mt-1">Select an original design to start building your resume</p>
              </div>
              <button 
                onClick={() => setShowTemplatesModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
              {templatesList.map(tpl => (
                <Link
                  key={tpl.id}
                  href={`/dashboard?templateId=${tpl.id}`}
                  className="group flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    {renderTemplateThumbnail(tpl.id)}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {tpl.label}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-400 border border-indigo-500/30 bg-indigo-500/5 px-2 py-0.5 rounded-full uppercase">
                        {tpl.tag}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-xs leading-relaxed">{tpl.desc}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-end text-xs font-semibold text-indigo-400 group-hover:underline">
                    Use Template &rarr;
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} ResumeAI. All rights reserved. <span> Created By KUMAR Groups</span>
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
