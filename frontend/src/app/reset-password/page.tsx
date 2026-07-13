"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { apiRequest } from "@/utils/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Reset token is missing in the URL.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("Token is missing or invalid.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiRequest<{ message: string }>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });

      setSuccess(response?.message || "Password has been reset successfully. Redirecting to login...");
      setPassword("");
      setConfirmPassword("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. The link may have expired or is invalid.");
    } finally {
      setSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.12 + i * 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <div className="w-full space-y-7">
      {/* Header Block */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="space-y-1.5"
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Reset Password
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Please enter your new password below.
        </p>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Container */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl border border-red-100 bg-red-50/50 text-[13px] text-red-600 flex items-start gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Success Container */}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 text-[13px] text-emerald-600 flex items-start gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
            <span>{success}</span>
          </motion.div>
        )}

        {/* New Password Field */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="relative"
        >
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            className="peer block w-full h-[54px] pl-4 pr-12 pt-5 pb-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all text-[15px] placeholder-transparent"
            required
            aria-label="New Password"
          />
          <label
            htmlFor="password"
            className="absolute left-4 top-4 text-slate-400 text-[15px] transition-all duration-200 pointer-events-none origin-left 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] 
            peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-black 
            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
          >
            New Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-lg transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </motion.div>

        {/* Confirm Password Field */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="relative"
        >
          <input
            id="confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder=" "
            className="peer block w-full h-[54px] pl-4 pr-12 pt-5 pb-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all text-[15px] placeholder-transparent"
            required
            aria-label="Confirm Password"
          />
          <label
            htmlFor="confirm-password"
            className="absolute left-4 top-4 text-slate-400 text-[15px] transition-all duration-200 pointer-events-none origin-left 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] 
            peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-black 
            peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            onMouseDown={(e) => e.preventDefault()}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-lg transition-colors"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="pt-2"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={submitting || !token}
            className="w-full h-[54px] bg-black text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Resetting password...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </motion.button>
        </motion.div>
      </form>

      {/* Back to Login Link */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="text-center pt-1"
      >
        <p className="text-[13px] font-medium text-slate-500">
          Remember your password?{" "}
          <Link
            href="/auth/login"
            className="font-bold text-black hover:underline inline-block relative focus:outline-none group pb-0.5"
          >
            Log In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Corner soft blurred circles (Premium SaaS aesthetic background) */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-50/20 to-indigo-50/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-50/20 to-pink-50/10 blur-[140px] pointer-events-none" />

      {/* Reset Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_24px_60px_rgba(17,24,39,0.06)] border border-slate-100/80 p-8 md:p-10 flex flex-col justify-center relative z-10"
      >
        {/* Logo at the top right */}
        <div className="absolute top-8 right-8">
          <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L4 7v6c0 5.25 3.42 10.16 8 11 4.58-.84 8-5.75 8-11V7l-8-5z" fill="currentColor"/>
            <path d="M12 6l5 3.75v3.25c0 3.32-2.14 6.43-5 6.96-2.86-.53-5-3.64-5-6.96V9.75L12 6z" fill="white"/>
            <path d="M12 8.5L9.5 11h5L12 8.5z" fill="currentColor"/>
          </svg>
        </div>

        <Suspense fallback={<div className="text-slate-500 text-sm">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
