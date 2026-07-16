"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Save, Download, Sparkles, User, Briefcase,
  BookOpen, Code, Award, CheckCircle, Sliders, Plus, Trash2, Eye, AlertCircle, Globe
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "../../../context/AuthContext";
import {
  apiRequest,
  getLocalResumes,
  saveLocalResumes,
  LocalResume
} from "../../../utils/api";

// Dynamically load PDF components to prevent Next.js SSR errors
const ResumePDFViewer = dynamic(
  () => import("../../../components/ResumePDFViewer"),
  { ssr: false, loading: () => <div className="flex h-full items-center justify-center text-zinc-400 bg-zinc-900/50 rounded-2xl border border-zinc-800">Loading Preview Panel...</div> }
);

export default function BuilderPage() {
  const { id } = useParams() as { id: string };
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const [resume, setResume] = useState<any>(null);
  const [debouncedResume, setDebouncedResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [activeTab, setActiveTab] = useState<"personal" | "summary" | "experience" | "projects" | "education" | "skills" | "certifications" | "languages" | "formatting">("personal");
  const [error, setError] = useState<string | null>(null);

  // Debounced auto-save timer ref
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchResume();
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [id, isAuthenticated]);

  // Debounce resume changes for PDF rendering updates to avoid blinking/refreshing on every keystroke
  useEffect(() => {
    if (!resume) return;
    const handler = setTimeout(() => {
      setDebouncedResume(resume);
    }, 800); // 800ms delay

    return () => {
      clearTimeout(handler);
    };
  }, [resume]);

  const fetchResume = async () => {
    setLoading(true);
    setError(null);
    try {
      if (id.startsWith("local_")) {
        // Local Guest Mode
        const localResumes = getLocalResumes();
        const found = localResumes.find(r => r.id === id);
        if (found) {
          setResume(found);
          setDebouncedResume(found);
        } else {
          setError("Local resume not found");
        }
      } else {
        // Cloud Auth Mode
        if (!isAuthenticated) {
          router.push("/auth/login");
          return;
        }
        const data = await apiRequest<any>(`/resumes/${id}`);
        setResume(data);
        setDebouncedResume(data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load resume details");
    } finally {
      setLoading(false);
    }
  };

  // Trigger auto-save whenever resume state changes
  const triggerAutoSave = (updatedResume: any) => {
    setSaveStatus("unsaved");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(async () => {
      setSaveStatus("saving");
      try {
        if (id.startsWith("local_")) {
          // Save locally
          const localResumes = getLocalResumes();
          const idx = localResumes.findIndex(r => r.id === id);
          if (idx !== -1) {
            localResumes[idx] = {
              ...updatedResume,
              updatedAt: new Date().toISOString(),
            };
            saveLocalResumes(localResumes);
          }
        } else {
          // Save in Cloud
          await apiRequest(`/resumes/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedResume),
          });
        }
        setSaveStatus("saved");
      } catch (e) {
        console.error("Auto-save failed:", e);
        setSaveStatus("unsaved");
      }
    }, 1500); // Wait 1.5 seconds after user stops typing
  };

  const handleUpdateResume = (updater: (prev: any) => any) => {
    setResume((prev: any) => {
      const next = updater(prev);
      triggerAutoSave(next);
      return next;
    });
  };

  const handleDownload = async () => {
    if (!resume) return;
    try {
      const { pdf } = await import("@react-pdf/renderer");
      const ResumePDF = (await import("../../../components/ResumePDF")).default;

      const blob = await pdf(<ResumePDF data={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.title || "resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // Helper change handlers
  const handlePersonalDetailsChange = (field: string, val: any) => {
    handleUpdateResume(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: val
      }
    }));
  };

  const handleListChange = (section: string, index: number, field: string, val: any) => {
    handleUpdateResume(prev => {
      const listCopy = [...(prev[section] || [])];
      listCopy[index] = {
        ...listCopy[index],
        [field]: val
      };
      return {
        ...prev,
        [section]: listCopy
      };
    });
  };

  const handleAddListItem = (section: string, defaultObj: any) => {
    handleUpdateResume(prev => {
      const listCopy = [...(prev[section] || [])];
      const listOrder = listCopy.length;
      listCopy.push({
        ...defaultObj,
        listOrder
      });
      return {
        ...prev,
        [section]: listCopy
      };
    });
  };

  const handleRemoveListItem = (section: string, index: number) => {
    handleUpdateResume(prev => {
      const listCopy = (prev[section] || []).filter((_: any, idx: number) => idx !== index);
      // Re-assign listOrder indexes sequentially
      const reordered = listCopy.map((item: any, idx: number) => ({
        ...item,
        listOrder: idx
      }));
      return {
        ...prev,
        [section]: reordered
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center gap-3">
        <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Loading Resume Builder Workspace...</span>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Workspace Error</h2>
        <p className="text-zinc-400 mb-6">{error || "Could not retrieve resume data."}</p>
        <Link href="/dashboard" className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg font-medium text-white transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col h-screen overflow-hidden">
      {/* Header bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="font-bold text-sm text-white">{resume.title}</h1>
            <div className="flex items-center gap-1.5 text-xs mt-0.5">
              <span className="text-zinc-500">{resume.targetJobRole || "Software Engineer"}</span>
              <span className="text-zinc-700">•</span>
              {saveStatus === "saved" && <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Saved</span>}
              {saveStatus === "saving" && <span className="text-indigo-400 animate-pulse flex items-center gap-1"><Save className="h-3 w-3" /> Auto-saving...</span>}
              {saveStatus === "unsaved" && <span className="text-amber-400 flex items-center gap-1">Unsaved changes</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 px-3.5 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:text-white transition-colors">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
             AI Review 
          </button> */}

          {/* Download triggers client side render and download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-zinc-950 px-4 py-2 rounded-lg shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all duration-200"
          >
            <Download className="h-3.5 w-3.5 text-zinc-950" />
            Download PDF
          </button>
        </div>
      </header>

      {/* Main Workspace split panel */}
      <div className="flex-grow flex h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Side: Form Editor */}
        <div className="w-1/2 flex flex-col border-r border-zinc-900 bg-zinc-950/20 h-full overflow-hidden">
          {/* Section Tabs */}
          <div className="flex border-b border-zinc-900 bg-zinc-900/30 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: "personal", label: "Contact", icon: User },
              { id: "summary", label: "Summary", icon: Sparkles },
              { id: "experience", label: "Experience", icon: Briefcase },
              { id: "projects", label: "Projects", icon: Code },
              { id: "education", label: "Education", icon: BookOpen },
              { id: "skills", label: "Skills", icon: Sliders },
              { id: "certifications", label: "Certs", icon: Award },
              { id: "languages", label: "Languages", icon: Globe },
              { id: "formatting", label: "Formatting", icon: Sliders },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400 bg-indigo-500/5"
                    : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/20"
                  }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content panel */}
          <div className="flex-grow p-6 overflow-y-auto space-y-6 max-w-2xl mx-auto w-full pb-20">

            {/* 1. Personal Tab */}
            {activeTab === "personal" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Contact Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">First Name</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.firstName || ""}
                      onChange={e => handlePersonalDetailsChange("firstName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.lastName || ""}
                      onChange={e => handlePersonalDetailsChange("lastName", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalDetails?.email || ""}
                      onChange={e => handlePersonalDetailsChange("email", e.target.value)}
                      className={`w-full rounded-lg border bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:outline-none text-xs transition-colors ${resume.personalDetails?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalDetails.email)
                          ? "border-red-500/80 focus:border-red-500"
                          : "border-zinc-800 focus:border-indigo-500"
                        }`}
                      placeholder="@example.com"
                    />
                    {resume.personalDetails?.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personalDetails.email) && (
                      <p className="text-[10px] text-red-400 mt-1">Please enter a valid email address.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.phone || ""}
                      onChange={e => handlePersonalDetailsChange("phone", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="+123456789"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={resume.personalDetails?.professionalTitle || ""}
                    onChange={e => handlePersonalDetailsChange("professionalTitle", e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                    placeholder="Senior Full Stack Engineer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.linkedin || ""}
                      onChange={e => handlePersonalDetailsChange("linkedin", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.github || ""}
                      onChange={e => handlePersonalDetailsChange("github", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="github.com/username"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Profile Photo URL</label>
                    <input
                      type="text"
                      value={resume.personalDetails?.photoUrl || ""}
                      onChange={e => handlePersonalDetailsChange("photoUrl", e.target.value)}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="showPhoto"
                      checked={resume.showPhoto !== false}
                      onChange={e => handleUpdateResume(prev => ({ ...prev, showPhoto: e.target.checked }))}
                      className="rounded border-zinc-800 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <label htmlFor="showPhoto" className="text-xs font-medium text-zinc-400">Show photo on resume</label>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Summary Tab */}
            {activeTab === "summary" && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Professional Summary</h3>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-zinc-500">Summary Text</label>
                    <button className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={
                      resume.summary !== undefined && resume.summary !== null
                        ? resume.summary
                        : (resume.targetJobRole ? `Experienced professional specializing in ${resume.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "")
                    }
                    onChange={(e) => handleUpdateResume(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-white placeholder-zinc-600 focus:border-indigo-500 focus:outline-none text-xs"
                    placeholder="Enter summary..."
                  />

                </div>
              </div>
            )}

            {/* 3. Work Experience Tab */}
            {activeTab === "experience" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Work Experience</h3>
                  <button
                    onClick={() => handleAddListItem("experiences", {
                      jobTitle: "",
                      company: "",
                      workMode: "REMOTE",
                      isCurrentJob: false,
                      responsibilities: "[]"
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Job
                  </button>
                </div>

                {(resume.experiences || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No experiences listed. Add a job history to begin.</p>
                ) : (
                  (resume.experiences || []).map((exp: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("experiences", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4 w-11/12">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Job Title</label>
                          <input
                            type="text"
                            value={exp.jobTitle || ""}
                            onChange={e => handleListChange("experiences", index, "jobTitle", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Software Engineer"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company || ""}
                            onChange={e => handleListChange("experiences", index, "company", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Google"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Location</label>
                          <input
                            type="text"
                            value={exp.location || ""}
                            onChange={e => handleListChange("experiences", index, "location", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Work Mode</label>
                          <select
                            value={exp.workMode || "REMOTE"}
                            onChange={e => handleListChange("experiences", index, "workMode", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-white text-xs focus:outline-none"
                          >
                            <option value="REMOTE">Remote</option>
                            <option value="HYBRID">Hybrid</option>
                            <option value="ONSITE">Onsite</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Start Date</label>
                          <input
                            type="date"
                            value={exp.startDate || ""}
                            onChange={e => handleListChange("experiences", index, "startDate", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">End Date</label>
                          <input
                            type="date"
                            disabled={exp.isCurrentJob}
                            value={exp.isCurrentJob ? "" : exp.endDate || ""}
                            onChange={e => handleListChange("experiences", index, "endDate", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none disabled:opacity-30"
                          />
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id={`current-job-${index}`}
                          type="checkbox"
                          checked={exp.isCurrentJob || false}
                          onChange={e => handleListChange("experiences", index, "isCurrentJob", e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-zinc-700 bg-zinc-800 text-indigo-600"
                        />
                        <label htmlFor={`current-job-${index}`} className="ml-2 block text-xs text-zinc-400">
                          I currently work here
                        </label>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-[10px] font-medium text-zinc-500">Responsibilities (Bullet Points)</label>
                          <button className="flex items-center gap-1 text-[9px] font-semibold text-indigo-400 hover:text-indigo-300">
                            <Sparkles className="h-2.5 w-2.5" /> Optimize Bullets
                          </button>
                        </div>
                        <textarea
                          rows={3}
                          value={exp.responsibilities || ""}
                          onChange={e => handleListChange("experiences", index, "responsibilities", e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none placeholder-zinc-700 font-mono"
                          placeholder='e.g. ["Developed backend API services", "Managed database schemas"]'
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 4. Projects Tab */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Projects</h3>
                  <button
                    onClick={() => handleAddListItem("projects", {
                      name: "",
                      techStack: "",
                      githubUrl: "",
                      liveDemoUrl: "",
                      duration: "",
                      detailedDescription: ""
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Project
                  </button>
                </div>

                {(resume.projects || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No projects listed. Add projects to highlight your key builds.</p>
                ) : (
                  (resume.projects || []).map((proj: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("projects", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4 w-11/12">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Project Name</label>
                          <input
                            type="text"
                            value={proj.name || ""}
                            onChange={e => handleListChange("projects", index, "name", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. ResumeAI Platform"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Tech Stack</label>
                          <input
                            type="text"
                            value={proj.techStack || ""}
                            onChange={e => handleListChange("projects", index, "techStack", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Next.js, Spring Boot, Postgres"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">GitHub URL</label>
                          <input
                            type="text"
                            value={proj.githubUrl || ""}
                            onChange={e => handleListChange("projects", index, "githubUrl", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. github.com/username/repo"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Project URL (Live Demo)</label>
                          <input
                            type="text"
                            value={proj.liveDemoUrl || ""}
                            onChange={e => handleListChange("projects", index, "liveDemoUrl", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. myproject.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Duration</label>
                          <input
                            type="text"
                            value={proj.duration || ""}
                            onChange={e => handleListChange("projects", index, "duration", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. 3 Months"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-zinc-500 mb-1">Short Description</label>
                        <textarea
                          rows={2}
                          value={proj.detailedDescription || ""}
                          onChange={e => handleListChange("projects", index, "detailedDescription", e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none placeholder-zinc-700"
                          placeholder="Describe what you built and achieved in this project..."
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 5. Education Tab */}
            {activeTab === "education" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Education</h3>
                  <button
                    onClick={() => handleAddListItem("educations", {
                      degree: "",
                      course: "",
                      college: "",
                      startYear: 2020,
                      endYear: 2024,
                      cgpa: 0
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Education
                  </button>
                </div>

                {(resume.educations || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No education listings yet. Add details of your colleges and degrees.</p>
                ) : (
                  (resume.educations || []).map((edu: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("educations", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4 w-11/12">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree || ""}
                            onChange={e => handleListChange("educations", index, "degree", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Bachelor of Engineering"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Course/Field</label>
                          <input
                            type="text"
                            value={edu.course || ""}
                            onChange={e => handleListChange("educations", index, "course", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-zinc-500 mb-1">College/University</label>
                        <input
                          type="text"
                          value={edu.college || ""}
                          onChange={e => handleListChange("educations", index, "college", e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                          placeholder="e.g. Stanford University"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Start Year</label>
                          <input
                            type="number"
                            value={edu.startYear || ""}
                            onChange={e => handleListChange("educations", index, "startYear", parseInt(e.target.value) || 0)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="2020"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">End Year</label>
                          <input
                            type="number"
                            value={edu.endYear || ""}
                            onChange={e => handleListChange("educations", index, "endYear", parseInt(e.target.value) || 0)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="2024"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">CGPA / Grade</label>
                          <input
                            type="text"
                            value={edu.cgpa || ""}
                            onChange={e => handleListChange("educations", index, "cgpa", parseFloat(e.target.value) || 0)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="9.2"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 6. Skills Tab */}
            {activeTab === "skills" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Skills</h3>
                  <button
                    onClick={() => handleAddListItem("skills", {
                      category: "",
                      items: ""
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Skill Category
                  </button>
                </div>

                {(resume.skills || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No skill categories configured. Add categorized tags to map your tech stack.</p>
                ) : (
                  (resume.skills || []).map((skill: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("skills", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="w-11/12">
                        <label className="block text-[10px] font-medium text-zinc-500 mb-1">Category</label>
                        <input
                          type="text"
                          value={skill.category || ""}
                          onChange={e => handleListChange("skills", index, "category", e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                          placeholder="e.g. Programming Languages, Frameworks"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-medium text-zinc-500 mb-1">Skill Items (Comma-separated)</label>
                        <input
                          type="text"
                          value={skill.items || ""}
                          onChange={e => handleListChange("skills", index, "items", e.target.value)}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                          placeholder="e.g. Java, Python, C++, Go"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 7. Certifications Tab */}
            {activeTab === "certifications" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Certifications</h3>
                  <button
                    onClick={() => handleAddListItem("certifications", {
                      name: "",
                      issuer: "",
                      issueDate: ""
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Certification
                  </button>
                </div>

                {(resume.certifications || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No certifications listed. Add credentials to increase authority.</p>
                ) : (
                  (resume.certifications || []).map((cert: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("certifications", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4 w-11/12">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Certification Name</label>
                          <input
                            type="text"
                            value={cert.name || ""}
                            onChange={e => handleListChange("certifications", index, "name", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. AWS Solutions Architect"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Issuer</label>
                          <input
                            type="text"
                            value={cert.issuer || ""}
                            onChange={e => handleListChange("certifications", index, "issuer", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. Amazon Web Services"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Issue Date</label>
                          <input
                            type="date"
                            value={cert.issueDate || ""}
                            onChange={e => handleListChange("certifications", index, "issueDate", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 8. Languages Tab */}
            {activeTab === "languages" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-white">Languages</h3>
                  <button
                    onClick={() => handleAddListItem("languages", {
                      name: "",
                      proficiency: "Native"
                    })}
                    className="flex items-center gap-1 text-xs font-semibold bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 px-3.5 py-1.5 rounded-lg transition-colors border border-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Language
                  </button>
                </div>

                {(resume.languages || []).length === 0 ? (
                  <p className="text-xs text-zinc-500">No languages listed. Add languages you speak to enhance your profile.</p>
                ) : (
                  (resume.languages || []).map((lang: any, index: number) => (
                    <div key={index} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 space-y-4 relative">
                      <button
                        onClick={() => handleRemoveListItem("languages", index)}
                        className="absolute top-4 right-4 p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-4 w-11/12">
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Language Name</label>
                          <input
                            type="text"
                            value={lang.name || ""}
                            onChange={e => handleListChange("languages", index, "name", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-1.5 text-white text-xs focus:outline-none"
                            placeholder="e.g. English, Spanish"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-zinc-500 mb-1">Proficiency</label>
                          <select
                            value={lang.proficiency || "Native"}
                            onChange={e => handleListChange("languages", index, "proficiency", e.target.value)}
                            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-white text-xs focus:outline-none"
                          >
                            <option value="Native">Native / Bilingual</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional Working">Professional Working</option>
                            <option value="Conversational">Conversational</option>
                            <option value="Elementary">Elementary</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 9. Formatting Tab */}
            {activeTab === "formatting" && (
              <div className="space-y-6">
                <h3 className="text-base font-bold text-white mb-2">Resume Formatting</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Font Family</label>
                    <select
                      value={resume.font || "Arial"}
                      onChange={e => handleUpdateResume(prev => ({ ...prev, font: e.target.value }))}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white text-xs focus:outline-none"
                    >
                      <option value="Arial">Sans-Serif (Arial)</option>
                      <option value="Times New Roman">Serif (Times New Roman)</option>
                      <option value="Courier">Monospace (Courier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Font Size</label>
                    <select
                      value={resume.fontSize || "11pt"}
                      onChange={e => handleUpdateResume(prev => ({ ...prev, fontSize: e.target.value }))}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white text-xs focus:outline-none"
                    >
                      <option value="9pt">Small (9pt)</option>
                      <option value="10pt">Standard (10pt)</option>
                      <option value="11pt">Medium (11pt)</option>
                      <option value="12pt">Large (12pt)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Line Spacing</label>
                    <select
                      value={resume.lineSpacing || 1.15}
                      onChange={e => handleUpdateResume(prev => ({ ...prev, lineSpacing: parseFloat(e.target.value) }))}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-white text-xs focus:outline-none"
                    >
                      <option value="1.0">Compact (1.0)</option>
                      <option value="1.15">Standard (1.15)</option>
                      <option value="1.3">Comfortable (1.3)</option>
                      <option value="1.5">Loose (1.5)</option>
                    </select>
                  </div>

                  {/* <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={resume.accentColor || "#000000"}
                        onChange={e => handleUpdateResume(prev => ({ ...prev, accentColor: e.target.value }))}
                        className="h-8 w-12 rounded border border-zinc-800 bg-zinc-900 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-400 font-mono uppercase">{resume.accentColor}</span>
                    </div>
                  </div> */}
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-2">Resume Template</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "executive-classic", label: "Executive Classic" },
                      { id: "elegant-minimal", label: "Elegant Minimal" },
                      { id: "neo-gradient", label: "Neo Gradient" },
                      { id: "professional-timeline", label: "Professional Timeline" },
                    ].map(tpl => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => handleUpdateResume(prev => ({ ...prev, templateId: tpl.id }))}
                        className={`py-3 text-xs font-medium rounded-lg border text-center transition-all ${resume.templateId === tpl.id
                            ? "border-indigo-500 bg-indigo-500/5 text-indigo-400 font-semibold"
                            : "border-zinc-800 bg-zinc-900/10 text-zinc-400 hover:text-white"
                          }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-zinc-900 pt-6">
                  <label className="block text-xs font-medium text-zinc-500 mb-2">Section Reordering</label>
                  <div className="space-y-2">
                    {(resume.sectionOrder || "personal,summary,experience,projects,education,skills,certifications,languages")
                      .split(",")
                      .map((sec: string, idx: number, arr: string[]) => {
                        const label = sec === "personal" ? "Contact Details" : sec.charAt(0).toUpperCase() + sec.slice(1);
                        return (
                          <div key={sec} className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-900/20 text-xs text-zinc-300">
                            <span className="font-medium">{label}</span>
                            <div className="flex gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const newArr = [...arr];
                                  const temp = newArr[idx];
                                  newArr[idx] = newArr[idx - 1];
                                  newArr[idx - 1] = temp;
                                  handleUpdateResume(prev => ({ ...prev, sectionOrder: newArr.join(",") }));
                                }}
                                className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 text-zinc-400 hover:text-white"
                              >
                                ▲
                              </button>
                              <button
                                type="button"
                                disabled={idx === arr.length - 1}
                                onClick={() => {
                                  const newArr = [...arr];
                                  const temp = newArr[idx];
                                  newArr[idx] = newArr[idx + 1];
                                  newArr[idx + 1] = temp;
                                  handleUpdateResume(prev => ({ ...prev, sectionOrder: newArr.join(",") }));
                                }}
                                className="p-1 hover:bg-zinc-800 rounded disabled:opacity-30 text-zinc-400 hover:text-white"
                              >
                                ▼
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Real-time Live PDF Preview */}
        <div className="w-1/2 bg-zinc-900 p-6 flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="font-semibold text-xs tracking-wider uppercase text-zinc-500 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-indigo-400" />
              Real-time select-text preview
            </h3>

            <span className="text-[10px] text-zinc-500 italic">
              PDF matches exact printer dimensions
            </span>
          </div>

          <div className="flex-grow w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
            {debouncedResume && <ResumePDFViewer data={debouncedResume} />}
          </div>
        </div>
      </div>
    </div>
  );
}
