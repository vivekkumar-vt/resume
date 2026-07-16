"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Trash2, Copy, Edit3, FileText, LogOut,
  User, ExternalLink, Clock, Sparkles, AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  apiRequest,
  getLocalResumes,
  saveLocalResumes,
  LocalResume
} from "../../utils/api";

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states for creating a new resume
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTargetJob, setNewTargetJob] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("executive-classic");
  const [createStep, setCreateStep] = useState<"template" | "details">("template");
  const [showProfileModal, setShowProfileModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchResumes();
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tpl = params.get("templateId");
      if (tpl) {
        setSelectedTemplateId(tpl);
        setCreateStep("details");
        setShowCreateModal(true);
        // Clean up url query param so it doesn't open modal on refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        // Fetch from Cloud
        const data = await apiRequest<any[]>("/resumes");
        setResumes(data);
      } else {
        // Fetch from Local Storage
        const local = getLocalResumes();
        setResumes(local);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const initialResume = {
        title: newTitle.trim(),
        targetJobRole: newTargetJob.trim() || "Software Engineer",
        templateId: selectedTemplateId || "executive-classic",
        font: "Arial",
        fontSize: "11pt",
        lineSpacing: 1.15,
        margins: 1.0,
        paperSize: "A4",
        accentColor: "#000000",
        showIcons: true,
        showPhoto: false,
        sectionOrder: "personal,summary,experience,projects,education,skills,certifications",
        personalDetails: {
          firstName: "",
          lastName: "",
          email: user?.email || "",
          phone: "",
        },
        experiences: [],
        projects: [],
        educations: [],
        skills: [],
        certifications: []
      };

      if (isAuthenticated) {
        // Create in Cloud
        const created = await apiRequest<any>("/resumes", {
          method: "POST",
          body: JSON.stringify(initialResume),
        });
        router.push(`/builder/${created.id}`);
      } else {
        // Create in Local Storage
        const localId = `local_${Math.random().toString(36).substring(2, 11)}`;
        const localResume: LocalResume = {
          id: localId,
          ...initialResume,
          updatedAt: new Date().toISOString(),
        };
        const localResumes = getLocalResumes();
        localResumes.push(localResume);
        saveLocalResumes(localResumes);
        router.push(`/builder/${localId}`);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create resume");
    } finally {
      setCreating(false);
      setShowCreateModal(false);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const original = resumes.find(r => (r.id || r.localId) === id);
      if (!original) return;

      const duplicatedTitle = `${original.title} (Copy)`;

      if (isAuthenticated) {
        // Duplicate in Cloud: fetch details, copy, post
        const details = await apiRequest<any>(`/resumes/${id}`);
        const { id: _, ...copyData } = details;
        copyData.title = duplicatedTitle;
        await apiRequest("/resumes", {
          method: "POST",
          body: JSON.stringify(copyData),
        });
        fetchResumes();
      } else {
        // Duplicate in Local Storage
        const newLocalId = `local_${Math.random().toString(36).substring(2, 11)}`;
        const copy: LocalResume = {
          ...original,
          id: newLocalId,
          title: duplicatedTitle,
          updatedAt: new Date().toISOString(),
        };
        const localResumes = getLocalResumes();
        localResumes.push(copy);
        saveLocalResumes(localResumes);
        fetchResumes();
      }
    } catch (err: any) {
      setError(err.message || "Failed to duplicate resume");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      if (isAuthenticated) {
        // Delete in Cloud
        await apiRequest(`/resumes/${id}`, {
          method: "DELETE",
        });
      } else {
        // Delete in Local Storage
        const localResumes = getLocalResumes().filter(r => r.id !== id);
        saveLocalResumes(localResumes);
      }
      fetchResumes();
    } catch (err: any) {
      setError(err.message || "Failed to delete resume");
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              R
            </Link>
            <span className="font-semibold text-xl tracking-tight text-white">
              ResumeAI Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (isAuthenticated) {
                  setShowProfileModal(true);
                } else {
                  router.push("/auth/login");
                }
              }}
              className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-indigo-400" />
              <span>{isAuthenticated ? user?.email : "Guest Mode (Sign In)"}</span>
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 px-4 rounded-full shadow transition-all duration-200"
              >
                {/* Sign In to Cloud */}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-grow mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-zinc-900">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              Welcome back {isAuthenticated ? "" : "Guest"}!
            </h1>
            <p className="text-zinc-400 mt-1">
              {isAuthenticated
                ? "Manage your cloud-synchronized resumes and track their analytics."
                : "Your resumes are saved locally. Sign in to sync them to the cloud."
              }
            </p>
          </div>

          <button 
            onClick={() => {
              setNewTitle("");
              setNewTargetJob("");
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 font-bold py-2.5 px-5 rounded-lg shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-200"
          >
            <Plus className="h-5 w-5 text-zinc-950" />
            Create Resume
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3 text-red-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* Resumes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 animate-pulse flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="h-6 bg-zinc-800 rounded w-2/3" />
                  <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
                <div className="h-8 bg-zinc-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/10">
            <FileText className="mx-auto h-12 w-12 text-zinc-600 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-300">No resumes yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mt-2">
              Click the &quot;Create Resume&quot; button above to build your first professional ATS-optimized resume.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => {
              const resumeId = resume.id;
              return (
                <div
                  key={resumeId}
                  onClick={() => router.push(`/builder/${resumeId}`)}
                  className="group relative flex flex-col justify-between h-48 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-200 cursor-pointer shadow-md"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {resume.title}
                      </h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleDuplicate(resumeId, e)}
                          title="Duplicate"
                          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-zinc-800"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(resumeId, e)}
                          title="Delete"
                          className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-zinc-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-1">
                      {resume.targetJobRole || "Software Engineer"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-900 pt-4 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {resume.updatedAt
                          ? new Date(resume.updatedAt).toLocaleDateString()
                          : "Recently updated"
                        }
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-indigo-400 font-medium group-hover:underline">
                      Edit
                      <Edit3 className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`bg-zinc-900 border border-zinc-800 rounded-2xl w-full p-6 shadow-2xl relative transition-all duration-300 ${createStep === "template" ? "max-w-4xl" : "max-w-md"}`}>
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 font-bold"
            >
              ✕
            </button>

            {createStep === "template" ? (
              <div>
                <h2 className="text-xl font-bold text-white mb-2">
                  Choose a Template
                </h2>
                <p className="text-sm text-zinc-400 mb-6">
                  Select one of our four premium templates to begin creating your resume.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { id: "executive-classic", label: "Executive Classic", desc: "Centered design for senior roles.", tag: "ATS Friendly" },
                    { id: "elegant-minimal", label: "Elegant Minimal", desc: "Clean monochromatic serif look.", tag: "Minimalist" },
                    { id: "neo-gradient", label: "Neo Gradient", desc: "Features photo and contact grid.", tag: "Creative" },
                    { id: "professional-timeline", label: "Professional Timeline", desc: "Elegant serif with divider lines.", tag: "ATS Friendly" }
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        setCreateStep("details");
                      }}
                      className="group flex flex-col p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/40 hover:border-zinc-700 transition-all duration-200 text-left hover:-translate-y-0.5"
                    >
                      <div className="w-full h-28 bg-zinc-950 rounded-lg border border-zinc-800 mb-3 overflow-hidden flex items-center justify-center p-2 group-hover:border-indigo-500/40 transition-colors">
                        <img
                          src={`/templates/${tpl.id}.svg`}
                          alt={`${tpl.label} Preview`}
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors">
                          {tpl.label}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-[10px] uppercase font-semibold mb-1.5">{tpl.tag}</p>
                      <p className="text-zinc-400 text-[11px] leading-snug">{tpl.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setCreateStep("template")}
                    className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    &larr; Back to Templates
                  </button>
                </div>

                <h2 className="text-xl font-bold text-white mb-1">
                  Create New Resume
                </h2>
                <p className="text-xs text-zinc-400 mb-4">
                  Selected Template: <span className="text-indigo-400 font-semibold">{selectedTemplateId === "executive-classic" ? "Executive Classic" : selectedTemplateId === "elegant-minimal" ? "Elegant Minimal" : selectedTemplateId === "neo-gradient" ? "Neo Gradient" : "Professional Timeline"}</span>
                </p>

                <form onSubmit={handleCreateResume} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Resume Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">
                      Target Job Role
                    </label>
                    <input
                      type="text"
                      value={newTargetJob}
                      onChange={(e) => setNewTargetJob(e.target.value)}
                      className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm"
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating || !newTitle.trim()}
                      className="rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 px-4 py-2 text-sm font-bold shadow hover:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      {creating && (
                        <svg className="animate-spin h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      )}
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => {
                setShowProfileModal(false);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-800 font-bold"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-800 mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-2xl mb-3 shadow-inner uppercase">
                {user?.email ? user.email.charAt(0) : "U"}
              </div>
              <h2 className="text-xl font-bold text-white">User Profile</h2>
              <p className="text-xs text-zinc-500 mt-1">Manage your account details and security</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="w-full bg-zinc-800/40 border border-zinc-800 px-3 py-2 rounded-lg text-sm text-zinc-300">
                  {user?.email}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  User Account ID
                </label>
                <div className="w-full bg-zinc-800/40 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-zinc-400 font-mono flex items-center justify-between">
                  <span className="truncate mr-2">{user?.userId}</span>
                  <button
                    onClick={() => {
                      if (user?.userId) {
                        navigator.clipboard.writeText(user.userId);
                      }
                    }}
                    className="text-[10px] text-indigo-400 hover:underline shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                  Access Level / Role
                </label>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                    {user?.role || "REGISTERED"}
                  </span>
                </div>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-zinc-800">
              <button 
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-red-950/20 bg-red-950/10 text-red-400 hover:bg-red-950/30 px-4 py-2 text-xs font-semibold transition-colors"
              >
                Sign Out
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowProfileModal(false);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
