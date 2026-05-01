"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Heart, Activity, BarChart3, Home, ArrowLeft,
  Menu, X, Check, Loader2, ChevronRight, AlertTriangle,
  Eye, EyeOff, Coffee, Briefcase, Utensils, Car, Users,
  BookOpen, Dumbbell, Wind, Moon as MoonIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarfieldBackground from "./StarfieldBackground";

// ─── Types ──────────────────────────────────────────────────────────────────
interface MoodEntry {
  id: string; mood: string; intensity: number;
  timestamp: Date; note?: string; factors?: string[];
  source: "emoji" | "voice" | "camera" | "text";
}
interface SentimentAnalysis {
  score: number; label: "positive" | "neutral" | "negative";
  confidence: number; mood?: string;
}
interface UserData { name: string; email: string; profileImage?: string; }

// ─── Data ────────────────────────────────────────────────────────────────────
const moodEmojis = [
  { id: "happy",   emoji: "😊", label: "Happy",   value: 5, hue: "142", color: "#22c55e" },
  { id: "excited", emoji: "🎉", label: "Excited",  value: 5, hue: "25",  color: "#f97316" },
  { id: "calm",    emoji: "😌", label: "Calm",     value: 4, hue: "160", color: "#10b981" },
  { id: "neutral", emoji: "😐", label: "Neutral",  value: 3, hue: "220", color: "#64748b" },
  { id: "tired",   emoji: "😴", label: "Tired",    value: 2, hue: "265", color: "#a78bfa" },
  { id: "anxious", emoji: "😰", label: "Anxious",  value: 2, hue: "199", color: "#38bdf8" },
  { id: "sad",     emoji: "😢", label: "Sad",      value: 1, hue: "215", color: "#60a5fa" },
  { id: "angry",   emoji: "😠", label: "Angry",    value: 1, hue: "0",   color: "#f87171" },
];

const moodActivities: Record<string, string[]> = {
  happy:   ["Dance to upbeat music 🎵", "Share joy with someone 🤝", "Start a creative project 🎨"],
  excited: ["Channel energy into exercise 💪", "Plan something fun 🗓", "Learn something new 📚"],
  calm:    ["Practice mindfulness 🧘", "Read a book 📖", "Enjoy nature 🌿"],
  neutral: ["Try something new ✨", "Listen to music 🎶", "Connect with a friend 💬"],
  tired:   ["Take a power nap 😴", "Drink water 💧", "Gentle stretching 🤸"],
  anxious: ["Deep breathing 🌬", "Grounding exercise 🌱", "Talk to someone 💙"],
  sad:     ["Watch a comfort movie 🎬", "Write in journal ✍️", "Call a loved one 📞"],
  angry:   ["Physical exercise 🏃", "Count to ten 🔢", "Write down feelings 📝"],
};

const moodFactors = [
  { id: "work",     label: "Work",     icon: Briefcase, color: "#38bdf8" },
  { id: "food",     label: "Food",     icon: Utensils,  color: "#f97316" },
  { id: "travel",   label: "Travel",   icon: Car,       color: "#22c55e" },
  { id: "social",   label: "Social",   icon: Users,     color: "#a78bfa" },
  { id: "study",    label: "Study",    icon: BookOpen,  color: "#38bdf8" },
  { id: "exercise", label: "Exercise", icon: Dumbbell,  color: "#f87171" },
  { id: "weather",  label: "Weather",  icon: Wind,      color: "#86efac" },
  { id: "sleep",    label: "Sleep",    icon: MoonIcon,  color: "#94a3b8" },
  { id: "health",   label: "Health",   icon: Heart,     color: "#f87171" },
  { id: "family",   label: "Family",   icon: Users,     color: "#22c55e" },
];

const bannedWords = ["kill", "suicide", "die", "death", "kill myself", "hurt myself", "self harm", "end it"];

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Glassmorphism card */
const GlassCard = ({
  children, className = "", glow = false,
}: { children: React.ReactNode; className?: string; glow?: boolean }) => (
  <div
    className={`
      relative rounded-3xl overflow-hidden
      bg-white/[0.04] backdrop-blur-xl
      border border-white/[0.08]
      ${glow ? "shadow-[0_0_60px_-10px_rgba(34,197,94,0.25)]" : "shadow-[0_8px_32px_rgba(0,0,0,0.3)]"}
      ${className}
    `}
  >
    {children}
  </div>
);

/** Ambient orb background  */
const AmbientBackground = ({ mood }: { mood: string | null }) => {
  const hue = mood ? (moodEmojis.find(m => m.id === mood)?.hue ?? "142") : "142";
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060d17]">
      {/* deep base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#060d17] via-[#0a1628] to-[#04080f]" />

      {/* mood-reactive ambient orb */}
      <motion.div
        key={hue}
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(${hue} 80% 55% / 0.35) 0%, transparent 70%)`,
          transition: "background 1.2s ease",
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(215 80% 55% / 0.2) 0%, transparent 70%)" }}
      />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <StarfieldBackground />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060d17_100%)]" />
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSentiment, setShowSentiment] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [step, setStep] = useState<"mood" | "details" | "note">("mood");

  const noteRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedMoodRef = useRef<string | null>(null);
  const moodNoteRef = useRef("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { selectedMoodRef.current = selectedMood; }, [selectedMood]);
  useEffect(() => { moodNoteRef.current = moodNote; }, [moodNote]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMobileMenuOpen && !(e.target as HTMLElement).closest(".mobile-menu-container"))
        setIsMobileMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const showErrorMsg = (msg: string) => {
    setErrorMessage(msg); setShowError(true);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      setShowError(false);
      setTimeout(() => setErrorMessage(null), 300);
    }, 4000);
  };

  const validateText = (text: string): boolean => {
    const t = text.trim();
    if (!t.length) { showErrorMsg("Please write something before saving."); return false; }
    if (t.length < 5) { showErrorMsg("Please write at least 5 characters."); return false; }
    if (t.length > 500) { showErrorMsg("Maximum 500 characters allowed."); return false; }
    if (bannedWords.some(w => t.toLowerCase().includes(w))) {
      showErrorMsg("⚠️ Sensitive content detected. Support is available. Please reach out to someone you trust.");
      return false;
    }
    const bad = [/^[a-z]{1,3}$/i, /^(ok|okay|hmm|meh|idk|k)$/i, /^(.)\1{5,}$/, /^[\s\-_~]*$/];
    if (bad.some(p => p.test(t))) { showErrorMsg("Please write a more meaningful message."); return false; }
    return true;
  };

  useEffect(() => {
    (async () => {
      try {
        const userId = localStorage.getItem("student_user_id");
        if (!userId) return;
        const res = await fetch(`/api/user/${userId}`);
        if (res.ok) setUserData(await res.json());
      } catch {}
      finally { setIsLoadingUser(false); }
    })();
  }, []);

  const analyzeSentiment = async (text: string) => {
    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/analyze-mood", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) return;
      setSentiment({ score: data.score, label: data.label, confidence: data.score, mood: data.mood });
      if (!selectedMoodRef.current && data.mood) setSelectedMood(data.mood);
    } catch {} finally { setIsAnalyzing(false); }
  };

  const toggleFactor = (id: string) =>
    setSelectedFactors(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const saveMoodEntry = async () => {
    const mood = selectedMoodRef.current;
    const note = moodNoteRef.current.trim();
    if (!mood && !note) { showErrorMsg("Please select a mood or write about your day."); return; }
    if (note && !validateText(note)) return;
    try {
      const userId = localStorage.getItem("student_user_id");
      if (!userId) { showErrorMsg("Please login first."); return; }
      let moodToSave = mood ?? (sentiment?.label === "negative" ? "sad" : sentiment?.label === "positive" ? "happy" : "neutral");
      const saveRes = await fetch("/api/save-mood", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: note, mood: moodToSave, score: sentiment?.score || 0, intensity: moodIntensity, factors: selectedFactors }),
      });
      if (!saveRes.ok) throw new Error();
      if (moodToSave === "sad") {
        const riskRes = await fetch("/api/check-risk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
        const riskData = await riskRes.json();
        if (riskData.danger) {
          const notifyRes = await fetch("/api/notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, message: riskData.message || "User emotional risk detected" }) });
          const notifyData = await notifyRes.json();
          alert(notifyRes.ok && notifyData.success ? "⚠️ Your trusted person has been notified." : `⚠️ Risk detected, notification failed: ${notifyData.error}`);
        }
      }
      const saved = await saveRes.json();
      const newEntry: MoodEntry = {
        id: saved._id || Date.now().toString(),
        mood: moodToSave!,
        intensity: moodIntensity,
        timestamp: new Date(),
        note,
        factors: selectedFactors.length ? selectedFactors : undefined,
        source: mood ? "emoji" : "text",
      };
      setRecentEntries((p) => [newEntry, ...p].slice(0, 10));
      setSelectedMood(null); setMoodNote(""); setSentiment(null); setSelectedFactors([]); setMoodIntensity(3); setStep("mood");
      alert(`✅ Mood saved as "${moodToSave}" (intensity ${moodIntensity}/5)`);
    } catch { showErrorMsg("❌ Failed to save mood. Please try again."); }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  const activeMoodData = moodEmojis.find(m => m.id === selectedMood);

  useEffect(() => () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen font-[system-ui] text-white">
      <AmbientBackground mood={selectedMood} />

      {/* ── Error Toast ── */}
      <AnimatePresence>
        {showError && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -80, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -80, x: "-50%" }}
            className="fixed left-1/2 top-5 z-[60] w-[calc(100%-2rem)] max-w-sm"
          >
            <div className="flex items-start gap-3 bg-red-950/90 backdrop-blur-xl border border-red-700/50 rounded-2xl px-4 py-3 shadow-2xl">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200 flex-1 leading-snug">{errorMessage}</p>
              <button onClick={() => setShowError(false)} className="text-red-400 hover:text-red-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-4 mt-4 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between px-4 h-14">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium text-white/80 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            {/* Logo pill */}
            {/* <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 hidden sm:inline">MoodTracker</span>
            </div> */}

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/dashboard", icon: Home, label: "Home", active: true },
                { href: "/Analytics_Page", icon: BarChart3, label: "Analytics" },
                { href: "/ActivityPage", icon: Activity, label: "Activities" },
              ].map(({ href, icon: Icon, label, active }) => (
                <Link
                  key={href} href={href}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="mobile-menu-container fixed right-0 top-0 bottom-0 w-64 bg-[#0a1628]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl z-50 md:hidden"
            >
              <div className="p-5 border-b border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-300">Menu</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {[
                  { href: "/dashboard", icon: Home, label: "Home", sub: "Your mood dashboard" },
                  { href: "/Analytics_Page", icon: BarChart3, label: "Analytics", sub: "Track mood patterns" },
                  { href: "/ActivityPage", icon: Activity, label: "Activities", sub: "Wellness activities" },
                ].map(({ href, icon: Icon, label, sub }) => (
                  <Link key={href} href={href} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.06] transition-all group"
                  >
                    <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-emerald-500/20 group-hover:text-emerald-300 text-white/50 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">{label}</p>
                      <p className="text-xs text-white/40">{sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─────────────── MAIN ─────────────── */}
      <div className="pt-24 pb-12 px-4 max-w-2xl mx-auto">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          {isLoadingUser ? (
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
              <span className="text-lg text-white/50">Loading…</span>
            </div>
          ) : (
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
              {getGreeting()}
              {userData?.name && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  {`, ${userData.name.split(" ")[0]}`}
                </span>
              )}{" "}
              <span>👋</span>
            </h1>
          )}
          <p className="text-white/40 text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>

          {/* Streak / entry pill */}
          {recentEntries.length > 0 && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {recentEntries.length} {recentEntries.length === 1 ? "entry" : "entries"} today
            </motion.div>
          )}
        </motion.div>

        {/* ── Mood Card ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GlassCard glow={!!selectedMood}>
            {/* Card Top strip */}
            <div className="relative overflow-hidden">
              <div
                className="h-1.5 w-full transition-all duration-700"
                style={{
                  background: activeMoodData
                    ? `linear-gradient(90deg, ${activeMoodData.color}, transparent)`
                    : "linear-gradient(90deg, #22c55e, transparent)",
                }}
              />
            </div>

            <div className="p-6 sm:p-8">
              {/* ── STEP: Mood Selection ── */}
              <AnimatePresence mode="wait">
                {step === "mood" && (
                  <motion.div key="mood" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/20">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <h2 className="text-base font-semibold text-white">How are you feeling?</h2>
                        <p className="text-xs text-white/40">Tap a mood to get started</p>
                      </div>
                    </div>

                    {/* Emoji grid */}
                    <div className="grid grid-cols-4 gap-3">
                      {moodEmojis.map((mood, i) => (
                        <motion.button
                          key={mood.id}
                          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          whileHover={{ scale: 1.07, y: -4 }}
                          whileTap={{ scale: 0.93 }}
                          onClick={() => { setSelectedMood(mood.id); setStep("details"); }}
                          className={`
                            relative flex flex-col items-center py-4 px-2 rounded-2xl
                            border transition-all duration-200 group
                            ${selectedMood === mood.id
                              ? "border-white/30 bg-white/10"
                              : "border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/15"
                            }
                          `}
                          style={
                            selectedMood === mood.id
                              ? {
                                  boxShadow: `0 0 0 2px ${mood.color}, 0 0 30px ${mood.color}22`,
                                }
                              : undefined
                          }
                        >
                          <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform duration-200 inline-block">
                            {mood.emoji}
                          </span>
                          <span className="text-[11px] font-medium text-white/60">{mood.label}</span>
                          {selectedMood === mood.id && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                              style={{ background: mood.color }}
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* Or write */}
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/[0.06]" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-transparent px-3 text-xs text-white/30">or just write</span>
                      </div>
                    </div>

                    <div className="relative">
                      <textarea
                        ref={noteRef} value={moodNote}
                        onChange={e => {
                          setMoodNote(e.target.value);
                          if (debounceTimer.current) clearTimeout(debounceTimer.current);
                          debounceTimer.current = setTimeout(() => {
                            if (e.target.value.trim().length > 15) analyzeSentiment(e.target.value);
                          }, 500);
                        }}
                        placeholder="What's on your mind today? (min. 5 characters)"
                        rows={3}
                        maxLength={500}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                      />
                      <div className="flex items-center justify-between mt-1.5 px-1">
                        <AnimatePresence>
                          {isAnalyzing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                              className="flex items-center gap-1.5 text-xs text-white/40"
                            >
                              <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                              Analyzing…
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <span className={`text-xs ml-auto ${moodNote.length > 480 ? "text-red-400" : "text-white/25"}`}>
                          {moodNote.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Sentiment badge */}
                    <AnimatePresence>
                      {sentiment && showSentiment && moodNote.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                          className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-emerald-300 font-medium">AI detected:
                              <span className="ml-1 capitalize">{sentiment.mood || sentiment.label}</span>
                            </p>
                            <div className="h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(sentiment.score + 1) * 50}%` }}
                                className="h-full bg-emerald-400 rounded-full"
                              />
                            </div>
                          </div>
                          <button onClick={() => setShowSentiment(false)} className="text-white/30 hover:text-white/60 shrink-0">
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* CTA */}
                    {(selectedMood || moodNote) && (
                      <motion.button
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => selectedMood ? setStep("details") : saveMoodEntry()}
                        className="mt-5 w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 group"
                      >
                        <Heart className="w-4 h-4" />
                        {selectedMood ? "Continue" : "Log Mood"}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    )}

                    {/* Tip */}
                    {!selectedMood && !moodNote && (
                      <p className="mt-5 text-center text-xs text-white/25 leading-relaxed">
                        Select a mood above or write about your day — our AI will help you reflect 🌱
                      </p>
                    )}
                  </motion.div>
                )}

                {/* ── STEP: Details (intensity + factors) ── */}
                {step === "details" && (
                  <motion.div key="details" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    {/* Selected mood recap */}
                    {activeMoodData && (
                      <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                        <span className="text-3xl">{activeMoodData.emoji}</span>
                        <div>
                          <p className="text-xs text-white/40">You&apos;re feeling</p>
                          <p className="text-base font-semibold" style={{ color: activeMoodData.color }}>{activeMoodData.label}</p>
                        </div>
                        <button onClick={() => { setSelectedMood(null); setStep("mood"); }} className="ml-auto text-white/30 hover:text-white/60 text-xs">
                          Change
                        </button>
                      </div>
                    )}

                    {/* Intensity slider */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-white/70">Intensity</p>
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{
                            background: `${activeMoodData?.color}20`,
                            color: activeMoodData?.color ?? "#22c55e",
                          }}
                        >
                          {["", "Mild", "Low", "Moderate", "High", "Intense"][moodIntensity]}
                        </span>
                      </div>
                      <input
                        type="range" min="1" max="5" step="1" value={moodIntensity}
                        onChange={e => setMoodIntensity(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(90deg, ${activeMoodData?.color ?? "#22c55e"} 0%, ${activeMoodData?.color ?? "#22c55e"} ${(moodIntensity - 1) * 25}%, rgba(255,255,255,0.08) ${(moodIntensity - 1) * 25}%, rgba(255,255,255,0.08) 100%)`,
                          accentColor: activeMoodData?.color ?? "#22c55e",
                        }}
                      />
                      <div className="flex justify-between text-[10px] text-white/25 mt-1.5 px-0.5">
                        {["😌", "😐", "😑", "😣", "😫"].map((e, i) => (
                          <span key={i}>{e}</span>
                        ))}
                      </div>
                    </div>

                    {/* Factors */}
                    <div className="mb-6">
                      <p className="text-sm font-medium text-white/70 mb-3">What&apos;s influencing you?
                        <span className="text-xs text-white/30 ml-2">optional</span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {moodFactors.map(f => {
                          const Icon = f.icon;
                          const on = selectedFactors.includes(f.id);
                          return (
                            <motion.button
                              key={f.id} whileTap={{ scale: 0.94 }}
                              onClick={() => toggleFactor(f.id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                                on ? "border-white/20 text-white" : "border-white/[0.07] text-white/40 hover:border-white/15 hover:text-white/60"
                              }`}
                              style={on ? { background: `${f.color}20`, borderColor: `${f.color}40`, color: f.color } : {}}
                            >
                              <Icon className="w-3 h-3" />
                              {f.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Activity suggestions */}
                    {selectedMood && (
                      <div className="mb-6">
                        <p className="text-xs text-white/30 mb-2 flex items-center gap-1.5">
                          <Coffee className="w-3 h-3" /> Suggested for you
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(moodActivities[selectedMood] ?? []).map((s, i) => (
                            <button
                              key={i}
                              onClick={() => { setMoodNote(s); setStep("note"); }}
                              className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.07] text-white/50 hover:bg-white/[0.08] hover:text-white/70 hover:border-white/15 transition-all"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Nav buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep("mood")}
                        className="px-4 py-2.5 rounded-xl text-sm text-white/40 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all"
                      >
                        ← Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setStep("note")}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                      >
                        Next →
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* ── STEP: Note + Save ── */}
                {step === "note" && (
                  <motion.div key="note" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                    {/* Recap pill */}
                    {activeMoodData && (
                      <div className="flex items-center gap-2 mb-5 flex-wrap">
                        <span className="text-lg">{activeMoodData.emoji}</span>
                        <span className="text-sm font-medium" style={{ color: activeMoodData.color }}>{activeMoodData.label}</span>
                        <span className="text-xs text-white/30">·</span>
                        <span className="text-xs text-white/40">Intensity {moodIntensity}/5</span>
                        {selectedFactors.length > 0 && (
                          <>
                            <span className="text-xs text-white/30">·</span>
                            <span className="text-xs text-white/40">{selectedFactors.length} factor{selectedFactors.length > 1 ? "s" : ""}</span>
                          </>
                        )}
                      </div>
                    )}

                    <p className="text-sm font-medium text-white/70 mb-3">Add a note
                      <span className="text-xs text-white/30 ml-2">optional</span>
                    </p>
                    <div className="relative">
                      <textarea
                        ref={noteRef} value={moodNote}
                        onChange={e => {
                          setMoodNote(e.target.value);
                          if (debounceTimer.current) clearTimeout(debounceTimer.current);
                          debounceTimer.current = setTimeout(() => {
                            if (e.target.value.trim().length > 15) analyzeSentiment(e.target.value);
                          }, 500);
                        }}
                        placeholder="Anything else on your mind? (optional, min. 5 chars if writing)"
                        rows={4} maxLength={500}
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/25 resize-none outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                      />
                      <div className="flex justify-end mt-1 px-1">
                        <span className={`text-xs ${moodNote.length > 480 ? "text-red-400" : "text-white/25"}`}>
                          {moodNote.length}/500
                        </span>
                      </div>
                    </div>

                    {/* Sentiment */}
                    <AnimatePresence>
                      {sentiment && moodNote.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                          className="mt-3 flex items-center gap-2 text-xs text-emerald-300/80"
                        >
                          <Sparkles className="w-3 h-3" />
                          AI: <span className="capitalize font-medium">{sentiment.mood || sentiment.label}</span>
                          <span className="text-white/25">({Math.round(sentiment.confidence * 100)}% confidence)</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => setStep("details")}
                        className="px-4 py-3 rounded-xl text-sm text-white/40 bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-all"
                      >
                        ← Back
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={saveMoodEntry}
                        className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.3)] flex items-center justify-center gap-2 group"
                      >
                        <Heart className="w-4 h-4" />
                        Save Mood
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </motion.button>
                    </div>

                    {/* cancel */}
                    <button
                      onClick={() => { setSelectedMood(null); setMoodNote(""); setSentiment(null); setSelectedFactors([]); setMoodIntensity(3); setStep("mood"); }}
                      className="mt-3 w-full text-xs text-white/25 hover:text-white/50 transition-colors"
                    >
                      Cancel and start over
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step indicator dots */}
            <div className="flex items-center justify-center gap-1.5 pb-5">
              {(["mood", "details", "note"] as const).map(s => (
                <motion.div
                  key={s}
                  animate={{ width: step === s ? 20 : 6, opacity: step === s ? 1 : 0.3 }}
                  className="h-1.5 rounded-full bg-emerald-400"
                />
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* ── Recent entries ── */}
        <AnimatePresence>
          {recentEntries.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }} className="mt-6">
              <GlassCard>
                <div className="p-5">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-4">Recent entries today</p>
                  <div className="space-y-2.5">
                    {recentEntries.slice(0, 4).map(entry => {
                      const m = moodEmojis.find(x => x.id === entry.mood);
                      return (
                        <div key={entry.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <span className="text-xl">{m?.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: m?.color }}>{m?.label}</p>
                            {entry.note && <p className="text-xs text-white/35 truncate">{entry.note}</p>}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-white/30">
                              {new Date(entry.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                            <p className="text-xs text-white/20">Int. {entry.intensity}/5</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Nav cards ── */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { href: "/Analytics_Page", icon: BarChart3, label: "Analytics", sub: "See your patterns", color: "#38bdf8" },
            { href: "/ActivityPage", icon: Activity, label: "Activities", sub: "Wellness ideas", color: "#a78bfa" },
          ].map(({ href, icon: Icon, label, sub, color }) => (
            <motion.div key={href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            >
              <Link href={href}>
                <GlassCard className="p-4 cursor-pointer hover:border-white/15 transition-all group">
                  <div className="p-2 rounded-xl w-fit mb-3" style={{ background: `${color}18` }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-white/80">{label}</p>
                  <p className="text-xs text-white/35 mt-0.5">{sub}</p>
                  <ChevronRight className="w-3.5 h-3.5 text-white/25 mt-2 group-hover:translate-x-0.5 transition-transform" />
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
