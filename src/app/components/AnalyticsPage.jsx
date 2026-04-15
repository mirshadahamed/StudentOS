"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Activity,
  Brain,
  Sun,
  Moon,
  Cloud,
  Zap,
  Smile,
  Frown,
  Meh,
  Angry,
  Heart,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertCircle,
  Award,
  Flame,
  Clock,
  CalendarDays,
  LineChart,
  Sparkles,
  ArrowLeft,
  BookOpen,
  BookMarked,
  Eye,
  Home,
  Menu,
  X,
  Loader2,
  BarChart3,
  Users,
  Utensils,
  Briefcase,
  Car,
  Dumbbell,
  Wind,
  Coffee,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Mood Definitions with soft tones ──────────────────────────────────────
const moodDefinitions = {
  happy: {
    name: "Happy",
    icon: Smile,
    color: "text-[#4ADE80]",
    bg: "bg-[#4ADE80]/10",
    gradient: "from-[#4ADE80] to-[#22C55E]",
    emoji: "😊",
    value: 5,
    hue: "142"
  },
  calm: {
    name: "Calm",
    icon: Sun,
    color: "text-[#34D399]",
    bg: "bg-[#34D399]/10",
    gradient: "from-[#34D399] to-[#10B981]",
    emoji: "😌",
    value: 4,
    hue: "160"
  },
  neutral: {
    name: "Neutral",
    icon: Meh,
    color: "text-[#9CA3AF]",
    bg: "bg-[#9CA3AF]/10",
    gradient: "from-[#9CA3AF] to-[#6B7280]",
    emoji: "😐",
    value: 3,
    hue: "220"
  },
  anxious: {
    name: "Anxious",
    icon: Cloud,
    color: "text-[#38BDF8]",
    bg: "bg-[#38BDF8]/10",
    gradient: "from-[#38BDF8] to-[#0EA5E9]",
    emoji: "😰",
    value: 2,
    hue: "199"
  },
  sad: {
    name: "Sad",
    icon: Frown,
    color: "text-[#60A5FA]",
    bg: "bg-[#60A5FA]/10",
    gradient: "from-[#60A5FA] to-[#3B82F6]",
    emoji: "😢",
    value: 1,
    hue: "215"
  },
  angry: {
    name: "Angry",
    icon: Angry,
    color: "text-[#F87171]",
    bg: "bg-[#F87171]/10",
    gradient: "from-[#F87171] to-[#EF4444]",
    emoji: "😠",
    value: 1,
    hue: "0"
  },
  energetic: {
    name: "Energetic",
    icon: Zap,
    color: "text-[#F97316]",
    bg: "bg-[#F97316]/10",
    gradient: "from-[#F97316] to-[#EA580C]",
    emoji: "⚡",
    value: 5,
    hue: "25"
  },
  tired: {
    name: "Tired",
    icon: Moon,
    color: "text-[#A78BFA]",
    bg: "bg-[#A78BFA]/10",
    gradient: "from-[#A78BFA] to-[#8B5CF6]",
    emoji: "😴",
    value: 2,
    hue: "265"
  }
};

// ─── Glassmorphism Card Component ──────────────────────────────────────────
const GlassCard = ({
  children,
  className = "",
  glow = false,
}) => (
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

// ─── Ambient Background ────────────────────────────────────────────────────
const AmbientBackground = ({ mood }) => {
  const hue = mood ? (moodDefinitions[mood]?.hue ?? "142") : "142";
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
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060d17_100%)]" />
    </div>
  );
};

// ─── Helper Functions ──────────────────────────────────────────────────────
const calculateStats = (data) => {
  if (!data.length) {
    return {
      total: 0,
      average: 0,
      dominant: "neutral",
      streak: 0,
      consistency: 0
    };
  }

  const moodCounts = {};
  let totalIntensity = 0;

  data.forEach(entry => {
    moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    totalIntensity += entry.intensity;
  });

  const dominant = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  const average = totalIntensity / data.length;

  // Calculate current streak
  let streak = 0;
  const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0) {
      streak = 1;
    } else {
      const prevDate = new Date(sorted[i - 1].date);
      const currDate = new Date(sorted[i].date);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Calculate consistency
  if (sorted.length === 0) return { total: 0, average: 0, dominant: "neutral", streak: 0, consistency: 0 };
  const firstDate = new Date(sorted[sorted.length - 1].date);
  const lastDate = new Date(sorted[0].date);
  const totalDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const consistency = totalDays > 0 ? (data.length / totalDays) * 100 : 0;

  return {
    total: data.length,
    average,
    dominant,
    streak,
    consistency
  };
};

const generateInsights = (data) => {
  const insights = [];

  if (!data.length) return insights;

  // Check weekend pattern
  const weekendMoods = data.filter(entry => {
    const day = new Date(entry.date).getDay();
    return day === 0 || day === 6;
  });

  if (weekendMoods.length > 0) {
    const weekendAvg = weekendMoods.reduce((sum, e) => sum + e.intensity, 0) / weekendMoods.length;
    const overallAvg = data.reduce((sum, e) => sum + e.intensity, 0) / data.length;

    if (weekendAvg > overallAvg + 0.5) {
      insights.push({
        id: "weekend",
        type: "pattern",
        title: "Weekend Warrior",
        description: "Your mood tends to be significantly better on weekends. Consider planning relaxing activities during the week.",
        icon: Sun,
        color: "text-[#4ADE80]"
      });
    }
  }

  // Check most common factor correlations
  const factorMoods = {};
  data.forEach(entry => {
    if (entry.factors && entry.factors.length > 0) {
      entry.factors.forEach(factor => {
        if (!factorMoods[factor]) factorMoods[factor] = [];
        factorMoods[factor].push(entry.intensity);
      });
    }
  });

  let bestFactor = "";
  let bestAvg = 0;

  Object.entries(factorMoods).forEach(([factor, intensities]) => {
    const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    if (avg > bestAvg && intensities.length > 3) {
      bestAvg = avg;
      bestFactor = factor;
    }
  });

  if (bestFactor) {
    insights.push({
      id: "factor",
      type: "correlation",
      title: "Positive Correlation",
      description: `Your mood tends to be better on days when you log "${bestFactor}". Keep up this habit!`,
      icon: TrendingUp,
      color: "text-[#22C55E]"
    });
  }

  // Streak achievement
  const stats = calculateStats(data);
  if (stats.streak >= 7) {
    insights.push({
      id: "streak",
      type: "achievement",
      title: `${stats.streak} Day Streak!`,
      description: `You've logged your mood for ${stats.streak} days in a row. Consistency is key to understanding your mental health.`,
      icon: Flame,
      color: "text-[#F97316]"
    });
  }

  // Tip based on dominant mood
  if (stats.dominant === "anxious" || stats.dominant === "sad") {
    insights.push({
      id: "tip",
      type: "tip",
      title: "Self-Care Reminder",
      description: "Remember to take time for yourself today. Even 5 minutes of deep breathing can help.",
      icon: Heart,
      color: "text-[#F87171]"
    });
  }

  return insights;
};

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function MoodHistoryPage() {
  const router = useRouter();
  const [moodData, setMoodData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("calendar");
  const [selectedMood, setSelectedMood] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);

  const stats = useMemo(() => calculateStats(moodData), [moodData]);
  const insights = useMemo(() => generateInsights(moodData), [moodData]);

  // Load mood data
  useEffect(() => {
    const loadMoodData = async () => {
      setIsLoading(true);
      try {
        const userId = localStorage.getItem("student_user_id");

        if (!userId) {
          console.warn("No user ID found in localStorage");
          setIsLoading(false);
          return;
        }

        const res = await fetch(`/api/mood-history?userId=${userId}`);

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        const formatted = data.map((item) => ({
          id: item._id,
          date: new Date(item.createdAt).toISOString().split("T")[0],
          mood: item.mood,
          intensity: item.intensity || item.score || 3,
          factors: item.factors || [],
          notes: item.text,
          timestamp: new Date(item.createdAt).getTime()
        }));

        setMoodData(formatted);
      } catch (err) {
        console.error("Mood history load error:", err);
        setErrorMessage("Failed to load mood history");
        setShowError(true);
        setTimeout(() => setShowError(false), 4000);
      } finally {
        setIsLoading(false);
      }
    };

    loadMoodData();
  }, []);

  // Filter data based on selections
  const filteredData = useMemo(() => {
    let filtered = [...moodData];

    if (selectedMood !== "all") {
      filtered = filtered.filter(entry => entry.mood === selectedMood);
    }

    filtered = filtered.filter(entry => {
      const date = new Date(entry.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });

    return filtered;
  }, [moodData, selectedMood, selectedMonth, selectedYear]);

  // Calendar generation
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getMoodForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodData.find(entry => entry.date === dateStr);
  };

  const prevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  // Mood distribution
  const moodDistribution = Object.entries(moodDefinitions).map(([key, def]) => {
    const count = filteredData.filter(e => e.mood === key).length;
    return {
      mood: key,
      ...def,
      count,
      percentage: filteredData.length ? (count / filteredData.length) * 100 : 0
    };
  }).sort((a, b) => b.count - a.count);

  const toggleExpand = (id) => {
    setExpandedEntry(expandedEntry === id ? null : id);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu-container"))
        setIsMobileMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <div className="relative min-h-screen font-[system-ui] text-white">
      <AmbientBackground mood={stats.dominant} />

      {/* Error Toast */}
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

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="mx-4 mt-4 rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center justify-between px-4 h-14">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/MoodLogin")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium text-white/80 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            {/* Logo pill */}
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 hidden sm:inline">Analytics</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/dashboard", icon: Home, label: "Home" },
                { href: "/Analytics_Page", icon: BarChart3, label: "Analytics", active: true },
                { href: "/ActivityPage", icon: Activity, label: "Activities" },
              ].map(({ href, icon: Icon, label, active }) => (
                <Link
                  key={href}
                  href={href}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="mobile-menu-container fixed right-0 top-0 bottom-0 w-64 bg-[#0a1628]/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl z-50 md:hidden"
            >
              <div className="p-5 border-b border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
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
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
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

      {/* Main Content */}
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {getGreeting()}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              {stats.dominant && moodDefinitions[stats.dominant]?.emoji} Mood Analytics
            </span>
          </h1>
          <p className="text-white/40 text-sm">
            {months[selectedMonth]} {selectedYear} • {stats.total} entries
          </p>

          {/* Streak pill */}
          {stats.streak > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
            >
              <Flame className="w-3 h-3 text-orange-400" />
              {stats.streak} day streak • {stats.consistency.toFixed(0)}% consistent
            </motion.div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
          {[
            {
              label: "Wellness Score",
              value: (stats.average * 20).toFixed(0),
              unit: "/100",
              icon: Brain,
              color: "#22c55e",
              progress: stats.average * 20
            },
            {
              label: "Current Streak",
              value: stats.streak,
              unit: "days",
              icon: Flame,
              color: "#f97316",
              progress: Math.min(stats.streak * 10, 100)
            },
            {
              label: "Total Entries",
              value: stats.total,
              unit: "logs",
              icon: Activity,
              color: "#4ade80",
              progress: Math.min(stats.total * 5, 100)
            },
            {
              label: "Dominant Mood",
              value: stats.dominant,
              unit: "",
              icon: moodDefinitions[stats.dominant]?.icon || Smile,
              color: moodDefinitions[stats.dominant]?.color?.replace("text", "") || "#22c55e",
              progress: 0
            }
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <GlassCard className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl" style={{ background: `${card.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: card.color }} />
                    </div>
                    <span className="text-xs text-white/30">{card.label}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {typeof card.value === 'number' ? card.value : card.value.charAt(0).toUpperCase() + card.value.slice(1)}
                    </span>
                    {card.unit && <span className="text-xs text-white/30">{card.unit}</span>}
                  </div>
                  {card.progress > 0 && (
                    <div className="mt-3 h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${card.progress}%` }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}80)` }}
                      />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Insights & Recommendations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <GlassCard className="p-4 hover:border-emerald-500/20 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white/[0.04]">
                          <Icon className={`w-5 h-5 ${insight.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white/80 text-sm mb-1">{insight.title}</h3>
                          <p className="text-xs text-white/40 leading-relaxed">{insight.description}</p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* View Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/[0.08] pb-1">
          {[
            { id: "calendar", label: "Calendar View", icon: CalendarDays },
            { id: "diary", label: "Diary View", icon: BookOpen }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setViewType(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-t-xl ${
                  viewType === tab.id
                    ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-72 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <GlassCard className="p-5 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-white/80 text-sm">Filters</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-white/40 hover:text-white/60"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Month/Year Selector */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-white/40 mb-2">Time Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:border-emerald-500/50 outline-none transition-all"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:border-emerald-500/50 outline-none transition-all"
                  >
                    {[2026, 2025, 2024].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mood Filter */}
              <div className="mb-5">
                <label className="block text-xs font-medium text-white/40 mb-2">Mood</label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:border-emerald-500/50 outline-none transition-all"
                >
                  <option value="all">All Moods</option>
                  {Object.entries(moodDefinitions).map(([key, def]) => (
                    <option key={key} value={key}>{def.name}</option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="pt-4 border-t border-white/[0.06]">
                <h3 className="text-xs font-medium text-white/60 mb-3">Mood Distribution</h3>
                <div className="space-y-2">
                  {moodDistribution.slice(0, 5).map((item) => (
                    <div key={item.mood} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.emoji}</span>
                        <span className="text-white/50">{item.name}</span>
                      </div>
                      <span className="text-white/40">{item.count}</span>
                    </div>
                  ))}
                </div>
                {moodDistribution.length > 5 && (
                  <p className="text-xs text-white/25 mt-2 text-center">+{moodDistribution.length - 5} more</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              </div>
            ) : (
              <>
                {/* Calendar View */}
                {viewType === "calendar" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="lg:hidden flex justify-end mb-4"
                  >
                    <button
                      onClick={() => setShowFilters(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                  </motion.div>
                )}

                {viewType === "calendar" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <GlassCard className="p-5">
                      {/* Calendar Header */}
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-white/80">
                          {months[selectedMonth]} {selectedYear}
                        </h2>
                        <div className="flex gap-1">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={prevMonth}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4 text-white/60" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={nextMonth}
                            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
                          >
                            <ChevronRight className="w-4 h-4 text-white/60" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                          <div key={idx} className="py-2 text-center text-xs font-medium text-white/30">
                            {day}
                          </div>
                        ))}

                        {days.map((day, index) => {
                          const moodEntry = day ? getMoodForDate(selectedYear, selectedMonth, day) : null;
                          const moodDef = moodEntry ? moodDefinitions[moodEntry.mood] : null;

                          return (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              className={`
                                flex flex-col items-center justify-center rounded-xl p-2 min-h-[56px]
                                ${day ? 'cursor-pointer transition-all' : ''}
                                ${moodDef ? moodDef.bg : 'bg-white/[0.02]'}
                              `}
                            >
                              {day && (
                                <>
                                  <span className="text-sm font-medium text-white/70">{day}</span>
                                  {moodDef && (
                                    <span className="text-lg mt-0.5">{moodDef.emoji}</span>
                                  )}
                                </>
                              )}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-white/[0.06]">
                        {Object.entries(moodDefinitions).slice(0, 6).map(([key, def]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <span className="text-sm">{def.emoji}</span>
                            <span className="text-[10px] text-white/40">{def.name}</span>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Diary View */}
                {viewType === "diary" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookMarked className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-white/50">{filteredData.length} entries</span>
                      </div>
                      <button
                        onClick={() => setShowFilters(true)}
                        className="lg:hidden flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-sm text-white/60"
                      >
                        <Filter className="w-4 h-4" />
                        Filters
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                      {filteredData.sort((a, b) => b.timestamp - a.timestamp).map((entry, index) => {
                        const mood = moodDefinitions[entry.mood];
                        if (!mood) return null;

                        const isExpanded = expandedEntry === entry.id;

                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden transition-all duration-300 hover:border-emerald-500/20 ${
                              isExpanded ? 'shadow-[0_0_20px_rgba(34,197,94,0.1)]' : ''
                            }`}
                          >
                            <div
                              className="p-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                              onClick={() => toggleExpand(entry.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-xl ${mood.bg}`}>
                                    <span className="text-xl">{mood.emoji}</span>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`text-sm font-semibold ${mood.color}`}>{mood.name}</span>
                                      <span className="text-xs text-white/30">•</span>
                                      <span className="text-xs text-white/40">
                                        {new Date(entry.date).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric'
                                        })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                          <div
                                            key={i}
                                            className={`w-1.5 h-1.5 rounded-full ${
                                              i <= entry.intensity ? mood.color.replace('text', 'bg') : 'bg-white/[0.08]'
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      {entry.factors && entry.factors.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                          {entry.factors.slice(0, 2).map((factor, i) => (
                                            <span key={i} className="text-[9px] text-white/30 bg-white/[0.04] px-1.5 py-0.5 rounded">
                                              {factor}
                                            </span>
                                          ))}
                                          {entry.factors.length > 2 && (
                                            <span className="text-[9px] text-white/30">+{entry.factors.length - 2}</span>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="text-white/30"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </motion.div>
                              </div>

                              {entry.notes && !isExpanded && (
                                <p className="mt-2 text-xs text-white/40 line-clamp-1 pl-14">
                                  {entry.notes}
                                </p>
                              )}
                            </div>

                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="border-t border-white/[0.06]"
                                >
                                  <div className="p-4 bg-white/[0.02]">
                                    {entry.notes ? (
                                      <div className="mb-4">
                                        <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                          <BookOpen className="w-3 h-3" />
                                          Journal Entry
                                        </h4>
                                        <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                                          {entry.notes}
                                        </p>
                                      </div>
                                    ) : (
                                      <div className="mb-4 text-center py-3">
                                        <p className="text-white/30 text-xs italic">No written entry for this day</p>
                                      </div>
                                    )}

                                    {entry.factors && entry.factors.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                          <Activity className="w-3 h-3" />
                                          Contributing Factors
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                          {entry.factors.map((factor, i) => (
                                            <span
                                              key={i}
                                              className="px-2 py-1 bg-white/[0.04] text-white/50 text-xs rounded-full border border-white/[0.06]"
                                            >
                                              {factor}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    <div>
                                      <h4 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-1">
                                        <Activity className="w-3 h-3" />
                                        Intensity Level
                                      </h4>
                                      <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-white/[0.08] rounded-full h-1.5">
                                          <div
                                            className={`bg-gradient-to-r ${mood.gradient} rounded-full h-1.5`}
                                            style={{ width: `${(entry.intensity / 5) * 100}%` }}
                                          />
                                        </div>
                                        <span className="text-xs text-white/60 font-medium">
                                          {entry.intensity}/5
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}

                      {filteredData.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-12 bg-white/[0.02] rounded-2xl border border-white/[0.06]"
                        >
                          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                          <p className="text-white/40 text-sm">No diary entries for this period</p>
                          <p className="text-xs text-white/25 mt-1">Start writing about your days to see them here</p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Navigation Cards */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {[
            { href: "/dashboard", icon: Home, label: "Dashboard", sub: "Log your mood", color: "#22c55e" },
            { href: "/ActivityPage", icon: Activity, label: "Activities", sub: "Wellness ideas", color: "#a78bfa" },
          ].map(({ href, icon: Icon, label, sub, color }) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
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
