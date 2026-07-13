"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { InteractiveBlobs } from "@/components/InteractiveBlobs";

export default function RegisterPage() {
  const { register, isAuthenticated, error, clearError } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<"fullName" | "email" | "password" | "confirmPassword" | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      router.push("/dashboard");
    }
    // Clear errors on mount
    clearError();
  }, [isAuthenticated, router, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[RegisterPage] Form submitted. Email:", email);
    setValidationError(null);
    clearError();

    if (!fullName || !email || !password || !confirmPassword) {
      console.warn("[RegisterPage] Form validation failed: fields are empty");
      setValidationError("All fields are required");
      return;
    }

    if (!agreeTerms) {
      console.warn("[RegisterPage] Form validation failed: terms not accepted");
      setValidationError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }

    if (password.length < 6) {
      console.warn("[RegisterPage] Form validation failed: password is too short");
      setValidationError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      console.warn("[RegisterPage] Form validation failed: passwords do not match");
      setValidationError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    console.log("[RegisterPage] Invoking AuthContext register function...");
    try {
      await register(fullName, email, password);
      console.log("[RegisterPage] AuthContext register completed. Redirecting to /dashboard...");
      router.push("/dashboard");
    } catch (err: any) {
      console.error("[RegisterPage] Caught registration exception:", err);
      // Error is already captured by AuthContext
    } finally {
      setSubmitting(false);
      console.log("[RegisterPage] Form submission finished.");
    }
  };

  // Staggered child item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.12 + i * 0.07,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
      },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {/* Corner soft blurred circles */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-blue-50/20 to-indigo-50/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-indigo-50/20 to-pink-50/10 blur-[140px] pointer-events-none" />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_24px_60px_rgba(17,24,39,0.06)] border border-slate-100/80 overflow-hidden flex flex-col md:flex-row relative z-10 h-auto md:h-[680px]"
      >
        {/* LEFT SECTION - Character Canvas */}
        <div className="w-full md:w-1/2 h-[320px] md:h-full order-1 md:order-1 relative shrink-0 overflow-hidden">
          <InteractiveBlobs 
            focusedField={focusedField === "confirmPassword" ? "password" : (focusedField === "fullName" ? "email" : focusedField)}
            isPasswordVisible={showPassword || showConfirmPassword}
            hasValidationError={!!(validationError || error)}
          />
        </div>

        {/* RIGHT SECTION - Register Form */}
        <div className="w-full md:w-1/2 h-full order-2 md:order-2 p-8 md:p-10 lg:p-12 flex flex-col justify-center relative bg-white border-t border-slate-100 md:border-t-0 md:border-l">
          {/* Logo at the top right */}
          <div className="absolute top-8 right-8">
            <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4 7v6c0 5.25 3.42 10.16 8 11 4.58-.84 8-5.75 8-11V7l-8-5z" fill="currentColor"/>
              <path d="M12 6l5 3.75v3.25c0 3.32-2.14 6.43-5 6.96-2.86-.53-5-3.64-5-6.96V9.75L12 6z" fill="white"/>
              <path d="M12 8.5L9.5 11h5L12 8.5z" fill="currentColor"/>
            </svg>
          </div>

          <div className="w-full max-w-sm mx-auto space-y-7">
            {/* Header Block */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={itemVariants}
              className="space-y-1.5"
            >
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Create account
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Or{" "}
                <Link
                  href="/auth/login"
                  className="font-bold text-black hover:underline"
                >
                  sign in to your existing account
                </Link>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Errors container */}
              {(validationError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 rounded-xl border border-red-100 bg-red-50/50 text-[13px] text-red-600 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{validationError || error}</span>
                </motion.div>
              )}

              {/* Full Name Input Field */}
              <motion.div
                custom={1}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="relative"
              >
                <input
                  id="full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="peer block w-full h-[54px] px-4 pt-5 pb-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all text-[15px] placeholder-transparent"
                  required
                  aria-label="Full name"
                />
                <label
                  htmlFor="full-name"
                  className="absolute left-4 top-4 text-slate-400 text-[15px] transition-all duration-200 pointer-events-none origin-left 
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] 
                  peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-black 
                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Full Name
                </label>
              </motion.div>

              {/* Email Input Field */}
              <motion.div
                custom={2}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="relative"
              >
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="peer block w-full h-[54px] px-4 pt-5 pb-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all text-[15px] placeholder-transparent"
                  required
                  aria-label="Email address"
                />
                <label
                  htmlFor="email-address"
                  className="absolute left-4 top-4 text-slate-400 text-[15px] transition-all duration-200 pointer-events-none origin-left 
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] 
                  peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-black 
                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Email Address
                </label>
              </motion.div>

              {/* Password Input Field */}
              <motion.div
                custom={3}
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
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder=" "
                  className="peer block w-full h-[54px] pl-4 pr-12 pt-5 pb-1.5 bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-black focus:ring-2 focus:ring-black transition-all text-[15px] placeholder-transparent"
                  required
                  aria-label="Password"
                />
                <label
                  htmlFor="password"
                  className="absolute left-4 top-4 text-slate-400 text-[15px] transition-all duration-200 pointer-events-none origin-left 
                  peer-placeholder-shown:top-4 peer-placeholder-shown:text-[15px] 
                  peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-black 
                  peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px]"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-black transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </motion.div>

              {/* Confirm Password Input Field */}
              <motion.div
                custom={4}
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
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1.5 rounded-lg focus-visible:ring-2 focus-visible:ring-black transition-colors"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </motion.div>

              {/* Agree Terms Checkbox */}
             {/*} <motion.div
                custom={5}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="flex items-start pt-1"
              >
                <input
                  id="terms-conditions"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 mt-0.5 rounded border-slate-300 text-black focus:ring-black/20 focus:ring-offset-0 focus:outline-none transition-colors accent-black cursor-pointer"
                />
                <label htmlFor="terms-conditions" className="ml-2 block text-[13px] text-slate-600 font-medium cursor-pointer select-none">
                  I agree to the{" "}
                  <a href="#" className="font-semibold text-black hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-black hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>

              {/* Sign Up Button */}
              <motion.div
                custom={6}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                className="pt-2"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.985 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full h-[54px] bg-black text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>
              </motion.div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
