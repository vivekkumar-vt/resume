"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

interface InteractiveBlobsProps {
  focusedField: "email" | "password" | null;
  isPasswordVisible: boolean;
  hasValidationError: boolean;
}

// Reusable Eye Component
interface EyeProps {
  pupilX: MotionValue<number> | number;
  pupilY: MotionValue<number> | number;
  isBlinking: boolean;
  expression: "normal" | "sad" | "nervous" | "peeking";
  isClosed?: boolean;
}

const Eye: React.FC<EyeProps> = ({ pupilX, pupilY, isBlinking, expression, isClosed = false }) => {
  const activeClosed = isClosed || isBlinking;
  return (
    <motion.div
      animate={{ scaleY: activeClosed ? 0.08 : 1 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-inner relative overflow-hidden shrink-0"
      style={{
        boxShadow: "inset 1px 1px 3px rgba(0,0,0,0.2)"
      }}
    >
      {expression === "sad" ? (
        // Sad droopy eyes (downward arc)
        <svg className="w-3.5 h-3.5 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round">
          <path d="M4 14c2-4 6-4 8 0" />
        </svg>
      ) : expression === "nervous" ? (
        // Shy/nervous squinting pupils
        <motion.div
          style={{ x: typeof pupilX === "number" ? pupilX * 0.4 : useTransform(pupilX, (v) => v * 0.4), y: typeof pupilY === "number" ? pupilY * 0.4 : useTransform(pupilY, (v) => v * 0.4) }}
          className="w-3 h-1 bg-slate-900 rounded-full absolute"
        />
      ) : (
        // Normal or curious peeking pupil
        <motion.div
          style={{ x: pupilX, y: pupilY }}
          className="w-3.5 h-3.5 rounded-full bg-slate-900 absolute flex items-center justify-center"
        >
          {/* Eye highlight reflection */}
          <div className="w-1 h-1 rounded-full bg-white absolute top-0.5 left-0.5" />
        </motion.div>
      )}
      {/* Glossy reflection overlay on the white of the eye */}
      <div className="w-1 h-1 rounded-full bg-white absolute top-0.5 left-0.5 opacity-80 pointer-events-none" />
    </motion.div>
  );
};

// Reusable Mouth Component
interface MouthProps {
  type: "smile" | "open" | "curious" | "squiggle" | "frown" | "flat" | "dot";
}

const Mouth: React.FC<MouthProps> = ({ type }) => {
  if (type === "smile") {
    return <div className="w-4 h-2 border-b-[2.5px] border-slate-900 rounded-b-full mt-1.5" />;
  }
  if (type === "open" || type === "curious") {
    return <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-inner mt-1" />;
  }
  if (type === "dot") {
    return <div className="w-2.5 h-2.5 rounded-full bg-slate-900 shadow-inner mt-1" />;
  }
  if (type === "flat") {
    return <div className="w-3.5 h-0.5 bg-slate-900 rounded mt-2" />;
  }
  if (type === "frown") {
    return <div className="w-4 h-2 border-t-[2.5px] border-slate-900 rounded-t-full mt-2" />;
  }
  if (type === "squiggle") {
    return (
      <svg className="w-6 h-3 text-slate-900 mt-1" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M2 6c2-3 4-3 6 0s4 3 6 0 4-3 6 0" />
      </svg>
    );
  }
  return null;
};

// 3D-styled tactile wrapper
interface TactileBlobProps {
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  className?: string;
  children: React.ReactNode;
}

const TactileBlob: React.FC<TactileBlobProps> = ({
  gradientFrom,
  gradientTo,
  glowColor,
  className = "",
  children,
}) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center relative ${className}`}
      style={{
        background: `radial-gradient(circle at 35% 35%, ${gradientFrom} 0%, ${gradientTo} 100%)`,
        boxShadow: `
          inset 8px 8px 16px rgba(255, 255, 255, 0.45),
          inset -8px -8px 16px rgba(0, 0, 0, 0.22)
        `,
        filter: `drop-shadow(0 15px 25px ${glowColor})`,
      }}
    >
      {children}
    </div>
  );
};

export const InteractiveBlobs: React.FC<InteractiveBlobsProps> = ({
  focusedField,
  isPasswordVisible,
  hasValidationError,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  // States for intro sequence steps
  // 0: Initial Delay (0 - 500ms)
  // 1: Worm peeking & look around (500ms - 2700ms)
  // 2: Main characters slide/pop up (2700ms+)
  const [introStep, setIntroStep] = useState(0);
  const [wormState, setWormState] = useState<"hidden" | "peek" | "lookLeft" | "lookRight" | "exit">("hidden");

  // Local state blink hooks for each character
  const [isWormBlinking, setIsWormBlinking] = useState(false);
  const [isOrangeBlinking, setIsOrangeBlinking] = useState(false);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isPinkBlinking, setIsPinkBlinking] = useState(false);
  const [isYellowBlinking, setIsYellowBlinking] = useState(false);

  // Email Focus Custom Cursor position trackers
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springCursorX = useSpring(cursorX, { stiffness: 450, damping: 28 });
  const springCursorY = useSpring(cursorY, { stiffness: 450, damping: 28 });

  // Normalized mouse coords (0 to 1) inside canvas for pupil looking
  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);
  const springNormX = useSpring(normX, { stiffness: 100, damping: 16 });
  const springNormY = useSpring(normY, { stiffness: 100, damping: 16 });

  // Intro Sequence Timeline
  useEffect(() => {
    const t0 = setTimeout(() => {
      setIntroStep(1);
      setWormState("peek");
    }, 500);

    const t1 = setTimeout(() => setWormState("lookLeft"), 1100);
    const t2 = setTimeout(() => setWormState("lookRight"), 1700);
    const t3 = setTimeout(() => setWormState("exit"), 2300);

    const t4 = setTimeout(() => {
      setIntroStep(2);
    }, 2800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Set up random blinking intervals for characters
  const setupBlinking = (setBlink: React.Dispatch<React.SetStateAction<boolean>>) => {
    let timeoutId: NodeJS.Timeout;
    const trigger = () => {
      setBlink(true);
      timeoutId = setTimeout(() => setBlink(false), 140);
    };
    const cycle = () => {
      const delay = 2500 + Math.random() * 3500;
      timeoutId = setTimeout(() => {
        trigger();
        cycle();
      }, delay);
    };
    cycle();
    return () => clearTimeout(timeoutId);
  };

  useEffect(() => {
    const cW = setupBlinking(setIsWormBlinking);
    const cO = setupBlinking(setIsOrangeBlinking);
    const cP = setupBlinking(setIsPurpleBlinking);
    const cPi = setupBlinking(setIsPinkBlinking);
    const cY = setupBlinking(setIsYellowBlinking);
    return () => {
      cW();
      cO();
      cP();
      cPi();
      cY();
    };
  }, []);

  // Track Mouse Movements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    cursorX.set(x);
    cursorY.set(y);

    normX.set(x / rect.width);
    normY.set(y / rect.height);
  };

  const handleMouseLeave = () => {
    // Return eye looking back to center
    normX.set(0.5);
    normY.set(0.5);
  };

  // Pupil helper for tracking normalized coordinates relative to blob center
const createPupilTracker = (cx: number, cy: number) => {
  const pX = useTransform(
    [springNormX, springNormY] as const,
    (values) => {
      const [mx, my] = values as unknown as readonly [number, number];

      if (focusedField !== "email") return 0;

      const dx = mx - cx;
      const dy = my - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = Math.min(dist * 4, 1);

      return Math.cos(angle) * 6 * factor;
    }
  );

  const pY = useTransform(
    [springNormX, springNormY] as const,
    (values) => {
      const [mx, my] = values as unknown as readonly [number, number];

      if (focusedField !== "email") return 0;

      const dx = mx - cx;
      const dy = my - cy;
      const angle = Math.atan2(dy, dx);
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = Math.min(dist * 4, 1);

      return Math.sin(angle) * 6 * factor;
    }
  );

  return { pupilX: pX, pupilY: pY };
};

  // Individual Pupil Offset trackers based on character locations
  const orangePupils = createPupilTracker(0.22, 0.85);
  const purplePupils = createPupilTracker(0.44, 0.65);
  const pinkPupils = createPupilTracker(0.68, 0.75);
  const yellowPupils = createPupilTracker(0.88, 0.70);

  // Check if password reveal is active (triggers all characters to close eyes)
  const allEyesClosed = isPasswordVisible;

  // States & Layout variables for character states (State C, D, E)
  // Purple capsule layout mappings
  let purpleY = 0;
  let purpleScaleY = 1.0;
  let purpleRotate = 0;
  let purpleX = 0;
  let purpleSkewX = 0;
  let purpleExpression: "normal" | "sad" | "nervous" | "peeking" = "normal";
  let purpleMouth: MouthProps["type"] = "smile";

  if (hasValidationError) {
    purpleY = 35;
    purpleScaleY = 0.8;
    purpleRotate = -6;
    purpleX = 0;
    purpleSkewX = 0;
    purpleExpression = "sad";
    purpleMouth = "frown";
  } else if (isPasswordVisible) {
    // State D: Password Reveal straightens up, curious look (eyes closed animation requested)
    purpleY = 0;
    purpleScaleY = 1.0;
    purpleRotate = 8;
    purpleX = 14;
    purpleSkewX = 0;
    purpleExpression = "normal"; 
    purpleMouth = "curious";
  } else if (focusedField === "password") {
    // State C: Password Focus shy/hide behavior
    purpleY = -28;
    purpleScaleY = 1.25;
    purpleRotate = -22; // slump heavily to left
    purpleX = -20;      // shift left away from form
    purpleSkewX = -8;   // leaning posture
    purpleExpression = "nervous";
    purpleMouth = "squiggle";
  }

  // Expression and physical parameters for other characters under error (State E)
  const orangeExpression = hasValidationError ? "sad" : "normal";
  const orangeMouth = hasValidationError ? "frown" : "open";
  const orangeY = hasValidationError ? 25 : 0;
  const orangeScaleY = hasValidationError ? 0.82 : 1.0;

  const pinkExpression = hasValidationError ? "sad" : "normal";
  const pinkMouth = hasValidationError ? "frown" : "smile";
  const pinkY = hasValidationError ? 28 : 0;
  const pinkScaleY = hasValidationError ? 0.84 : 1.0;

  const yellowExpression = hasValidationError ? "sad" : "normal";
  const yellowMouth = hasValidationError ? "flat" : "dot";
  const yellowY = hasValidationError ? 30 : 0;
  const yellowScaleY = hasValidationError ? 0.82 : 1.0;

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#F0F0F0] select-none ${
        focusedField === "email" ? "cursor-none" : ""
      }`}
      aria-hidden="true"
    >
      {/* Decorative stars / ambient grid details for depth */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Sparks */}
      <motion.div
        animate={{ y: [0, -6, 0], rotate: [0, 45, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[20%] left-[20%] text-yellow-500/30 text-xl font-bold pointer-events-none"
      >
        ✦
      </motion.div>
      <motion.div
        animate={{ y: [0, 5, 0], rotate: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[40%] right-[15%] text-purple-500/20 text-2xl font-bold pointer-events-none"
      >
        ✦
      </motion.div>

      {/* Custom triangle cursor for Email input (State B) */}
      {focusedField === "email" && (
        <motion.div
          style={{
            x: springCursorX,
            y: springCursorY,
            translateX: "-4px",
            translateY: "-4px",
          }}
          className="absolute pointer-events-none z-50 text-black filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
        >
          <svg className="w-6 h-6 fill-black stroke-white stroke-[1.5px]" viewBox="0 0 24 24">
            <path d="M2 2l8 20 4-8 8-4z" />
          </svg>
        </motion.div>
      )}

      {/* State A: Peeking Pink Worm Character */}
      {introStep === 1 && (
        <motion.div
          initial="hidden"
          animate={wormState}
          variants={{
            hidden: { y: -160, transition: { duration: 0.4 } },
            peek: { y: -20, transition: { type: "spring", stiffness: 120, damping: 14 } },
            lookLeft: { y: -20 },
            lookRight: { y: -20 },
            exit: { y: -160, transition: { duration: 0.4, ease: "easeIn" } }
          }}
          className="absolute left-[44%] top-0 w-16 h-36 z-20"
        >
          <TactileBlob gradientFrom="#f472b6" gradientTo="#e11d48" glowColor="rgba(225,29,72,0.22)" className="rounded-b-[40px]">
            <div className="flex flex-col items-center justify-end h-full pb-6 relative">
              <div className="flex gap-2">
                <Eye 
                  pupilX={wormState === "lookLeft" ? -5 : wormState === "lookRight" ? 5 : 0} 
                  pupilY={0} 
                  isBlinking={isWormBlinking} 
                  expression="normal"
                  isClosed={allEyesClosed}
                />
                <Eye 
                  pupilX={wormState === "lookLeft" ? -5 : wormState === "lookRight" ? 5 : 0} 
                  pupilY={0} 
                  isBlinking={isWormBlinking} 
                  expression="normal"
                  isClosed={allEyesClosed}
                />
              </div>
              
              {/* Cheeks */}
              <div className="absolute left-2.5 bottom-12 w-2 h-1.5 rounded-full bg-rose-400/50 blur-[0.5px]" />
              <div className="absolute right-2.5 bottom-12 w-2 h-1.5 rounded-full bg-rose-400/50 blur-[0.5px]" />

              <Mouth type="smile" />
            </div>
          </TactileBlob>
        </motion.div>
      )}

      {/* State A (Entrance) and Core Characters (Orange, Purple, Pink, Yellow) */}
      {introStep >= 2 && (
        <>
          {/* Character 1: Wide Low Orange Dome */}
          <motion.div
            initial={{ y: 250 }}
            animate={{ 
              y: orangeY, 
              scaleY: orangeScaleY 
            }}
            transition={{
              y: { type: "spring", stiffness: 100, damping: 14 },
              scaleY: { duration: 0.15 }
            }}
            className="absolute left-[6%] bottom-0 w-[28%] h-[24%] origin-bottom z-10"
          >
            <TactileBlob gradientFrom="#fb923c" gradientTo="#f43f5e" glowColor="rgba(244,63,94,0.25)" className="rounded-t-[80px]">
              <div className="flex flex-col items-center justify-center pt-2 relative">
                <div className="flex gap-2.5">
                  <Eye 
                    pupilX={orangePupils.pupilX} 
                    pupilY={orangePupils.pupilY} 
                    isBlinking={isOrangeBlinking} 
                    expression={orangeExpression} 
                    isClosed={allEyesClosed}
                  />
                  <Eye 
                    pupilX={orangePupils.pupilX} 
                    pupilY={orangePupils.pupilY} 
                    isBlinking={isOrangeBlinking} 
                    expression={orangeExpression} 
                    isClosed={allEyesClosed}
                  />
                </div>

                {/* Rosy Cheeks */}
                <div className="absolute left-[20%] bottom-3 w-2.5 h-1.5 rounded-full bg-orange-400/40 blur-[0.5px]" />
                <div className="absolute right-[20%] bottom-3 w-2.5 h-1.5 rounded-full bg-orange-400/40 blur-[0.5px]" />

                <Mouth type={orangeMouth} />
              </div>
            </TactileBlob>
          </motion.div>

          {/* Character 2: Tall Purple Capsule (Reactive state character) */}
          <motion.div
            initial={{ y: 350 }}
            animate={{ 
              y: purpleY, 
              scaleY: purpleScaleY, 
              rotate: purpleRotate, 
              x: purpleX,
              skewX: purpleSkewX
            }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 14,
              scaleY: { duration: 0.15 },
              rotate: { duration: 0.25 }
            }}
            className="absolute left-[32%] bottom-0 w-[25%] h-[48%] origin-bottom z-10"
          >
            <TactileBlob gradientFrom="#c084fc" gradientTo="#6366f1" glowColor="rgba(99,102,241,0.3)" className="rounded-t-[70px]">
              <div className="flex flex-col items-center justify-center pt-8 relative">
                <div className="flex gap-3">
                  <Eye 
                    pupilX={focusedField === "password" && isPasswordVisible ? 4 : purplePupils.pupilX} 
                    pupilY={focusedField === "password" && isPasswordVisible ? 0 : purplePupils.pupilY} 
                    isBlinking={isPurpleBlinking} 
                    expression={purpleExpression} 
                    isClosed={allEyesClosed}
                  />
                  <Eye 
                    pupilX={focusedField === "password" && isPasswordVisible ? 4 : purplePupils.pupilX} 
                    pupilY={focusedField === "password" && isPasswordVisible ? 0 : purplePupils.pupilY} 
                    isBlinking={isPurpleBlinking} 
                    expression={purpleExpression} 
                    isClosed={allEyesClosed}
                  />
                </div>

                {/* Rosy Cheeks */}
                <div className="absolute left-[15%] bottom-24 w-2.5 h-1.5 rounded-full bg-pink-400/50 blur-[0.5px]" />
                <div className="absolute right-[15%] bottom-24 w-2.5 h-1.5 rounded-full bg-pink-400/50 blur-[0.5px]" />

                <Mouth type={purpleMouth} />
              </div>
            </TactileBlob>
          </motion.div>

          {/* Character 3: Medium Pink Rounded Rectangle */}
          <motion.div
            initial={{ y: 250 }}
            animate={{ 
              y: pinkY, 
              scaleY: pinkScaleY 
            }}
            transition={{
              y: { type: "spring", stiffness: 100, damping: 14 },
              scaleY: { duration: 0.15 }
            }}
            className="absolute left-[56%] bottom-0 w-[24%] h-[36%] origin-bottom z-10"
          >
            <TactileBlob gradientFrom="#f472b6" gradientTo="#ec4899" glowColor="rgba(236,72,153,0.25)" className="rounded-t-[40px]">
              <div className="flex flex-col items-center justify-center pt-4 relative">
                <div className="flex gap-2.5">
                  <Eye 
                    pupilX={pinkPupils.pupilX} 
                    pupilY={pinkPupils.pupilY} 
                    isBlinking={isPinkBlinking} 
                    expression={pinkExpression} 
                    isClosed={allEyesClosed}
                  />
                  <Eye 
                    pupilX={pinkPupils.pupilX} 
                    pupilY={pinkPupils.pupilY} 
                    isBlinking={isPinkBlinking} 
                    expression={pinkExpression} 
                    isClosed={allEyesClosed}
                  />
                </div>

                {/* Rosy Cheeks */}
                <div className="absolute left-[15%] bottom-10 w-2.5 h-1.5 rounded-full bg-pink-400/40 blur-[0.5px]" />
                <div className="absolute right-[15%] bottom-10 w-2.5 h-1.5 rounded-full bg-pink-400/40 blur-[0.5px]" />

                <Mouth type={pinkMouth} />
              </div>
            </TactileBlob>
          </motion.div>

          {/* Character 4: Slender Yellow Pillar (with fuzzy glow) */}
          <motion.div
            initial={{ y: 300 }}
            animate={{ 
              y: yellowY, 
              scaleY: yellowScaleY 
            }}
            transition={{
              y: { type: "spring", stiffness: 100, damping: 14 },
              scaleY: { duration: 0.15 }
            }}
            className="absolute left-[78%] bottom-0 w-[18%] h-[42%] origin-bottom z-10"
          >
            <TactileBlob 
              gradientFrom="#fde047" 
              gradientTo="#f59e0b" 
              glowColor="rgba(245,158,11,0.6)" 
              className="rounded-t-[50px] filter drop-shadow-[0_0_15px_rgba(245,158,11,0.45)]" 
            >
              <div className="flex flex-col items-center justify-center pt-8 relative">
                <div className="flex gap-1.5">
                  <Eye 
                    pupilX={yellowPupils.pupilX} 
                    pupilY={yellowPupils.pupilY} 
                    isBlinking={isYellowBlinking} 
                    expression={yellowExpression} 
                    isClosed={allEyesClosed}
                  />
                  <Eye 
                    pupilX={yellowPupils.pupilX} 
                    pupilY={yellowPupils.pupilY} 
                    isBlinking={isYellowBlinking} 
                    expression={yellowExpression} 
                    isClosed={allEyesClosed}
                  />
                </div>

                {/* Rosy Cheeks */}
                <div className="absolute left-[15%] bottom-20 w-2 h-1.5 rounded-full bg-amber-400/50 blur-[0.5px]" />
                <div className="absolute right-[15%] bottom-20 w-2 h-1.5 rounded-full bg-amber-400/50 blur-[0.5px]" />

                <Mouth type={yellowMouth} />
              </div>
            </TactileBlob>
          </motion.div>
        </>
      )}
    </div>
  );
};
