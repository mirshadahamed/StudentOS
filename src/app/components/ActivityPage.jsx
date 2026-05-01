"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import StarfieldBackground from "./StarfieldBackground";
import {
  Heart,
  Clock,
  Filter,
  Search,
  Play,
  Pause,
  Wind,
  Moon,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Smile,
  Frown,
  Angry,
  Coffee,
  Music,
  PenTool,
  Users,
  Dumbbell,
  Sparkles,
  Timer,
  ChevronDown,
  X,
  Activity,
  Check,
  Loader2,
  ArrowLeft,
  Award,
  TrendingUp,
  RefreshCw,
  Home,
  Menu,
  BarChart3,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Enhanced Activities Data ──────────────────────────────────────────────
const activitiesData = [
  {
    id: "1",
    title: "5-Minute Breathing Exercise",
    description: "Simple breathing technique to calm your mind and reduce anxiety",
    longDescription: "This guided breathing exercise helps activate your parasympathetic nervous system, reducing stress and promoting relaxation in just 5 minutes.",
    duration: 5,
    category: "mindfulness",
    moodTags: ["anxious", "stressed", "overwhelmed"],
    animation: "breathing",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#38BDF8] to-[#0EA5E9]",
    bgColor: "bg-[#38BDF8]/10",
    benefits: ["Reduces stress", "Lowers heart rate", "Improves focus", "Calms anxiety"],
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes and take a deep breath",
      "Inhale for 4 counts, hold for 4, exhale for 6",
      "Repeat for 5 minutes"
    ],
    phases: [
      { name: "Inhale", duration: 4, color: "bg-[#4ADE80]" },
      { name: "Hold", duration: 4, color: "bg-[#F97316]" },
      { name: "Exhale", duration: 6, color: "bg-[#38BDF8]" }
    ],
    tips: [
      "Try to breathe from your diaphragm, not your chest",
      "If your mind wanders, gently bring it back to your breath",
      "You can do this exercise anywhere, anytime"
    ]
  },
  {
    id: "2",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today",
    longDescription: "Cultivate a positive mindset by focusing on the good things in your life. Research shows gratitude journaling can improve mood and overall well-being.",
    duration: 10,
    category: "creative",
    moodTags: ["sad", "lonely", "low"],
    animation: "writing",
    image: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#F97316] to-[#EA580C]",
    bgColor: "bg-[#F97316]/10",
    benefits: ["Boosts mood", "Increases optimism", "Improves sleep", "Builds resilience"],
    conversationStarters: [
      "What made you smile today?",
      "Who are you grateful to have in your life?",
      "What's something good that happened this week?"
    ]
  },
  {
    id: "3",
    title: "Quick Stretch Break",
    description: "Simple stretches to release tension and boost energy",
    longDescription: "Release physical tension and increase blood flow with these simple stretches you can do at your desk or anywhere.",
    duration: 7,
    category: "physical",
    moodTags: ["tired", "sluggish", "stressed"],
    animation: "stretching",
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#4ADE80] to-[#22C55E]",
    bgColor: "bg-[#4ADE80]/10",
    benefits: ["Reduces muscle tension", "Improves posture", "Boosts energy", "Increases flexibility"]
  },
  {
    id: "4",
    title: "Push-up Challenge",
    description: "Build strength with guided push-ups",
    longDescription: "A quick strength-building workout that you can do anywhere. Perfect for releasing pent-up energy.",
    duration: 5,
    category: "physical",
    moodTags: ["energetic", "stressed", "angry"],
    animation: "pushup",
    image: "https://images.unsplash.com/photo-1598971639058-999900a4427c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1598971639058-999900a4427c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#F87171] to-[#EF4444]",
    bgColor: "bg-[#F87171]/10",
    benefits: ["Builds upper body strength", "Releases tension", "Boosts confidence"],
    sets: [
      { count: 5, rest: 15 },
      { count: 8, rest: 15 },
      { count: 5, rest: 15 },
      { count: 5, rest: 0 }
    ]
  },
  {
    id: "5",
    title: "Call a Friend",
    description: "Connect with someone you trust",
    longDescription: "Social connection is vital for emotional health. Reach out to someone who makes you feel understood.",
    duration: 15,
    category: "social",
    moodTags: ["lonely", "sad", "isolated"],
    animation: "calling",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#A78BFA] to-[#8B5CF6]",
    bgColor: "bg-[#A78BFA]/10",
    benefits: ["Reduces loneliness", "Strengthens relationships", "Provides support", "Boosts mood"],
    conversationStarters: [
      "What's been the highlight of your week?",
      "I've been thinking about you and wanted to catch up",
      "What's something fun you've done recently?"
    ]
  },
  {
    id: "6",
    title: "Creative Drawing",
    description: "Express your feelings through art",
    longDescription: "You don't need to be an artist to benefit from creative expression. Let your emotions guide your hand.",
    duration: 20,
    category: "creative",
    moodTags: ["creative", "reflective", "calm"],
    animation: "drawing",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#F97316] to-[#EA580C]",
    bgColor: "bg-[#F97316]/10",
    benefits: ["Reduces stress", "Processes emotions", "Increases mindfulness", "Boosts creativity"]
  },
  {
    id: "7",
    title: "Nature Walk",
    description: "Take a mindful walk in nature",
    longDescription: "Connect with nature and practice mindfulness as you walk. Notice the sights, sounds, and sensations around you.",
    duration: 30,
    category: "physical",
    moodTags: ["stressed", "anxious", "tired"],
    animation: "walking",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#4ADE80] to-[#22C55E]",
    bgColor: "bg-[#4ADE80]/10",
    benefits: ["Reduces stress", "Improves mood", "Boosts vitamin D", "Increases creativity"]
  },
  {
    id: "8",
    title: "Progressive Muscle Relaxation",
    description: "Release tension from head to toe",
    longDescription: "Systematically tense and relax different muscle groups to release physical stress and achieve deep relaxation.",
    duration: 15,
    category: "relaxation",
    moodTags: ["stressed", "tense", "anxious"],
    animation: "relaxation",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#38BDF8] to-[#0EA5E9]",
    bgColor: "bg-[#38BDF8]/10",
    benefits: ["Reduces physical tension", "Lowers anxiety", "Improves sleep"]
  },
  {
    id: "9",
    title: "Listen to Calming Music",
    description: "Soothing playlist for relaxation",
    longDescription: "Music has powerful effects on our emotions. Let these carefully selected tracks help you relax and unwind.",
    duration: 20,
    category: "relaxation",
    moodTags: ["anxious", "stressed", "tired"],
    animation: "music",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#A78BFA] to-[#8B5CF6]",
    bgColor: "bg-[#A78BFA]/10",
    benefits: ["Lowers cortisol", "Reduces anxiety", "Improves focus", "Enhances mood"]
  },
  {
    id: "10",
    title: "Jumping Jacks",
    description: "Get your heart rate up with jumping jacks",
    longDescription: "A quick cardio burst to energize your body and clear your mind. Great for when you need to shake off stress.",
    duration: 3,
    category: "physical",
    moodTags: ["sluggish", "tired", "stressed"],
    animation: "jumping",
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-[#F97316] to-[#EA580C]",
    bgColor: "bg-[#F97316]/10",
    benefits: ["Boosts energy", "Improves circulation", "Releases endorphins", "Clears mind"],
    sets: [
      { count: 20, rest: 10 },
      { count: 20, rest: 10 },
      { count: 20, rest: 0 }
    ]
  }
];

// ─── Mood Definitions ──────────────────────────────────────────────────────
const moods = [
  { id: "anxious", name: "Anxious", icon: Cloud, color: "text-[#38BDF8]", bgColor: "bg-[#38BDF8]/20", lightBg: "bg-[#38BDF8]/10", gradient: "from-[#38BDF8] to-[#0EA5E9]", hue: "199", image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "stressed", name: "Stressed", icon: Zap, color: "text-[#F87171]", bgColor: "bg-[#F87171]/20", lightBg: "bg-[#F87171]/10", gradient: "from-[#F87171] to-[#EF4444]", hue: "0", image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "sad", name: "Sad", icon: Frown, color: "text-[#60A5FA]", bgColor: "bg-[#60A5FA]/20", lightBg: "bg-[#60A5FA]/10", gradient: "from-[#60A5FA] to-[#3B82F6]", hue: "215", image: "https://images.unsplash.com/photo-1486633632054-d732792b5cb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "tired", name: "Tired", icon: Moon, color: "text-[#A78BFA]", bgColor: "bg-[#A78BFA]/20", lightBg: "bg-[#A78BFA]/10", gradient: "from-[#A78BFA] to-[#8B5CF6]", hue: "265", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "lonely", name: "Lonely", icon: Cloud, color: "text-[#38BDF8]", bgColor: "bg-[#38BDF8]/20", lightBg: "bg-[#38BDF8]/10", gradient: "from-[#38BDF8] to-[#0EA5E9]", hue: "199", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "calm", name: "Calm", icon: Sun, color: "text-[#34D399]", bgColor: "bg-[#34D399]/20", lightBg: "bg-[#34D399]/10", gradient: "from-[#34D399] to-[#10B981]", hue: "160", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "happy", name: "Happy", icon: Smile, color: "text-[#4ADE80]", bgColor: "bg-[#4ADE80]/20", lightBg: "bg-[#4ADE80]/10", gradient: "from-[#4ADE80] to-[#22C55E]", hue: "142", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "overwhelmed", name: "Overwhelmed", icon: CloudRain, color: "text-[#6B7280]", bgColor: "bg-[#6B7280]/20", lightBg: "bg-[#6B7280]/10", gradient: "from-[#6B7280] to-[#4B5563]", hue: "220", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

const categories = [
  { id: "all", name: "All Activities", icon: Activity },
  { id: "mindfulness", name: "Mindfulness", icon: Wind },
  { id: "physical", name: "Physical", icon: Dumbbell },
  { id: "creative", name: "Creative", icon: PenTool },
  { id: "social", name: "Social", icon: Users },
  { id: "relaxation", name: "Relaxation", icon: Coffee }
];

const durations = [
  { id: "any", name: "Any Duration" },
  { id: "5", name: "5-10 min" },
  { id: "15", name: "15-20 min" },
  { id: "30", name: "30+ min" }
];

// ─── Glassmorphism Card ────────────────────────────────────────────────────
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
const AmbientBackground = ({ moodId }) => {
  const mood = moods.find(m => m.id === moodId);
  const hue = mood?.hue ?? "142";
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#060d17]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#060d17] via-[#0a1628] to-[#04080f]" />
      <motion.div
        key={hue}
        animate={{ scale: [1, 1.15, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(circle, hsl(${hue} 80% 55% / 0.35) 0%, transparent 70%)`,
        }}
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.2, 0.12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute bottom-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(215 80% 55% / 0.2) 0%, transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <StarfieldBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#060d17_100%)]" />
    </div>
  );
};

// ─── Breathing Animation ───────────────────────────────────────────────────
const BreathingAnimation = ({ isActive, isPaused, phase }) => (
  <div className="relative w-64 h-64 mx-auto">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#38BDF8]/20 to-[#0EA5E9]/20 flex items-center justify-center">
      <motion.div
        animate={{
          scale: isActive && !isPaused 
            ? phase === "inhale" ? 1.3
              : phase === "exhale" ? 0.7
              : 1
            : 1
        }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 6 : 4, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full bg-[#22C55E]/30 flex items-center justify-center"
      >
        <div className="text-white font-bold text-lg bg-black/50 px-3 py-1.5 rounded-full">
          {phase === "inhale" ? "🌬️" : phase === "exhale" ? "😮‍💨" : "⏸️"}
        </div>
      </motion.div>
    </div>
    <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm capitalize whitespace-nowrap">
      {phase}
    </p>
  </div>
);

// ─── Push-up Animation ─────────────────────────────────────────────────────
const PushupAnimation = ({ isActive, isPaused, currentSet, currentCount, totalSets }) => (
  <div className="relative w-64 h-64 mx-auto">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#F87171]/20 to-[#EF4444]/20 flex items-center justify-center">
      <motion.div
        animate={{
          y: isActive && !isPaused ? [0, 30, 0] : 0
        }}
        transition={{ duration: 1.5, repeat: isActive && !isPaused ? Infinity : 0, ease: "easeInOut" }}
        className="w-32 h-32 rounded-full bg-[#22C55E]/30 flex items-center justify-center"
      >
        <div className="text-white font-bold text-xl bg-black/50 px-3 py-1.5 rounded-full">
          {currentCount}
        </div>
      </motion.div>
    </div>
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap">
      <div className="text-white/60 text-sm">
        Set {currentSet + 1} of {totalSets}
      </div>
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────
export default function ActivitiesPage() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState("");
  const [activities] = useState(activitiesData);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("any");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [currentSet, setCurrentSet] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [hoveredActivity, setHoveredActivity] = useState(null);
  const [breathingPhase, setBreathingPhase] = useState("inhale");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showError, setShowError] = useState(false);

  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    if (selectedMood) {
      filtered = filtered.filter(activity =>
        activity.moodTags.includes(selectedMood)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity =>
        activity.category === selectedCategory
      );
    }

    if (selectedDuration !== "any") {
      filtered = filtered.filter(activity => {
        if (selectedDuration === "5") return activity.duration <= 10;
        if (selectedDuration === "15") return activity.duration > 10 && activity.duration <= 20;
        if (selectedDuration === "30") return activity.duration >= 30;
        return true;
      });
    }

    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [activities, selectedMood, selectedCategory, selectedDuration, searchQuery]);

  // Timer effect
  useEffect(() => {
    let interval;
    let phaseInterval;
    
    if (isActive && !isPaused && selectedActivity) {
      if (selectedActivity.animation === "breathing" && selectedActivity.phases) {
        let phaseIndex = 0;
        phaseInterval = setInterval(() => {
          setBreathingPhase(selectedActivity.phases[phaseIndex % selectedActivity.phases.length].name.toLowerCase());
          phaseIndex++;
        }, selectedActivity.phases[0].duration * 1000);
      }

      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 0) {
            if (selectedActivity.sets && currentSet < selectedActivity.sets.length - 1) {
              setCurrentSet(prevSet => prevSet + 1);
              setCurrentCount(selectedActivity.sets[currentSet + 1]?.count || 0);
              return selectedActivity.sets[currentSet + 1]?.rest || 0;
            } else {
              setIsActive(false);
              setCompleted(true);
              return 0;
            }
          }

          if (selectedActivity.animation === "pushup" && currentCount > 0) {
            setCurrentCount(prev => Math.max(0, prev - 1));
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      clearInterval(phaseInterval);
    };
  }, [isActive, isPaused, selectedActivity, currentSet, currentCount]);

  const startActivity = (activity) => {
    setSelectedActivity(activity);
    setIsActive(true);
    setCompleted(false);
    setCurrentSet(0);
    setTimer(activity.duration * 60);
    setBreathingPhase("inhale");
    if (activity.sets) {
      setCurrentCount(activity.sets[0].count);
    }
  };

  const pauseActivity = () => setIsPaused(!isPaused);
  
  const resetActivity = () => {
    setIsActive(false);
    setSelectedActivity(null);
    setCompleted(false);
    setCurrentSet(0);
    setTimer(0);
    setCurrentCount(0);
  };

  const getMoodSuggestion = () => {
    if (!selectedMood) return null;
    const moodActivities = activities.filter(a => a.moodTags.includes(selectedMood));
    const moodName = moods.find(m => m.id === selectedMood)?.name;
    const moodGradient = moods.find(m => m.id === selectedMood)?.gradient;
    return {
      mood: moodName,
      gradient: moodGradient,
      count: moodActivities.length,
      activities: moodActivities.slice(0, 3)
    };
  };

  const suggestion = getMoodSuggestion();
  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  // Close mobile menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu-container"))
        setIsMobileMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobileMenuOpen]);

  const showErrorMsg = (msg) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 4000);
  };

  const renderActivityAnimation = () => {
    if (!selectedActivity) return null;

    switch (selectedActivity.animation) {
      case "pushup":
        return (
          <PushupAnimation 
            isActive={isActive}
            isPaused={isPaused}
            currentSet={currentSet}
            currentCount={currentCount}
            totalSets={selectedActivity.sets?.length || 0}
          />
        );
      case "breathing":
        return (
          <BreathingAnimation 
            isActive={isActive}
            isPaused={isPaused}
            phase={breathingPhase}
          />
        );
      default:
        return (
          <div className="relative w-64 h-64 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: isActive && !isPaused ? 360 : 0,
                }}
                transition={{ duration: 2, repeat: isActive && !isPaused ? Infinity : 0, ease: "linear" }}
                className="w-32 h-32 rounded-full bg-[#22C55E]/30 flex items-center justify-center"
              >
                <Timer className="w-12 h-12 text-white" />
              </motion.div>
            </div>
            <p className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-sm whitespace-nowrap">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative min-h-screen font-[system-ui] text-white">
      <AmbientBackground moodId={selectedMood || null} />

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
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-sm font-medium text-white/80 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300 hidden sm:inline">Wellness Activities</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {[
                { href: "/dashboard", icon: Home, label: "Home" },
                { href: "/Analytics_Page", icon: BarChart3, label: "Analytics" },
                { href: "/ActivityPage", icon: Activity, label: "Activities", active: true },
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
                  <Activity className="w-5 h-5 text-emerald-400" />
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
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            {getGreeting()}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Find Your Calm
            </span>
          </h1>
          <p className="text-white/40 text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
          {selectedMood && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Filtered by: {moods.find(m => m.id === selectedMood)?.name}
            </motion.div>
          )}
        </motion.div>

        {!selectedActivity ? (
          // Activities Grid View
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <GlassCard className="p-5 sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-white/80 text-sm">How are you feeling?</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-white/40 hover:text-white/60"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mood Selector */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {moods.map((mood) => {
                    const Icon = mood.icon;
                    const isSelected = selectedMood === mood.id;
                    return (
                      <motion.button
                        key={mood.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMood(isSelected ? "" : mood.id)}
                        className={`
                          relative overflow-hidden rounded-xl p-3 transition-all
                          ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-[#0a1628]' : ''}
                          bg-white/[0.04] border border-white/[0.08]
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${mood.color}`} />
                          <span className="text-sm text-white/70">{mood.name}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Category Filter */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-white/40 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(cat => {
                      const Icon = cat.icon;
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                            isSelected 
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/20"
                              : "bg-white/[0.04] text-white/50 hover:text-white/70 border border-white/[0.06]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {cat.name}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Filter */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-white/40 mb-2">Duration</label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 focus:border-emerald-500/50 outline-none transition-all"
                  >
                    {durations.map(dur => (
                      <option key={dur.id} value={dur.id}>{dur.name}</option>
                    ))}
                  </select>
                </div>

                {/* Search */}
                <div className="mb-5">
                  <label className="block text-xs font-medium text-white/40 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search activities..."
                      className="w-full pl-9 pr-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white/70 placeholder:text-white/25 focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedMood || selectedCategory !== "all" || selectedDuration !== "any" || searchQuery) && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                      setSelectedMood("");
                      setSelectedCategory("all");
                      setSelectedDuration("any");
                      setSearchQuery("");
                    }}
                    className="w-full mt-2 py-2 rounded-xl text-sm text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Clear all filters
                  </motion.button>
                )}
              </GlassCard>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="lg:hidden flex justify-end mb-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/70 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </motion.button>
              </div>

              {/* Mood Suggestion Section */}
              {suggestion && suggestion.count > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
                >
                  <h2 className="text-lg font-semibold text-white/80 mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    Feeling {suggestion.mood}? Try these:
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {suggestion.activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startActivity(activity)}
                        className="bg-white/[0.04] rounded-xl p-3 cursor-pointer border border-white/[0.06] hover:border-emerald-500/30 transition-all"
                      >
                        <h3 className="font-medium text-white/80 text-sm mb-1">{activity.title}</h3>
                        <p className="text-xs text-white/40 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration} min
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Activities Grid */}
              <AnimatePresence mode="wait">
                {filteredActivities.length > 0 ? (
                  <motion.div
                    key="activities-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {filteredActivities.map((activity, idx) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -4 }}
                        onHoverStart={() => setHoveredActivity(activity.id)}
                        onHoverEnd={() => setHoveredActivity(null)}
                        onClick={() => startActivity(activity)}
                        className="bg-white/[0.03] rounded-2xl overflow-hidden cursor-pointer border border-white/[0.06] hover:border-emerald-500/30 transition-all group"
                      >
                        {/* ── Card image area ── */}
                        <div className="relative h-40 overflow-hidden">
                          {/* Actual photo */}
                          <img
                            src={activity.thumbnail}
                            alt={activity.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Gradient tint overlay — keeps the existing colour identity */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-40 group-hover:opacity-55 transition-opacity`}
                          />
                          {/* Dark scrim at bottom so the badge stays readable */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          <div className="absolute bottom-3 left-3">
                            <span className="px-2 py-1 bg-black/50 backdrop-blur text-white/80 text-xs rounded-full">
                              {activity.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-white/80 mb-1">{activity.title}</h3>
                          <p className="text-xs text-white/40 line-clamp-2 mb-3">{activity.description}</p>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {activity.moodTags.slice(0, 3).map((tag, i) => {
                              const mood = moods.find(m => m.id === tag);
                              return mood ? (
                                <span key={i} className={`text-[10px] ${mood.color} bg-white/[0.04] px-2 py-0.5 rounded-full`}>
                                  {mood.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1 text-white/40">
                              <Clock className="w-3 h-3" />
                              {activity.duration} min
                            </span>
                            <span className="text-emerald-400 group-hover:translate-x-0.5 transition-transform">Start →</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-16 bg-white/[0.02] rounded-2xl border border-white/[0.06]"
                  >
                    <Search className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No activities found</p>
                    <p className="text-xs text-white/25 mt-1">Try adjusting your filters</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          // Activity Detail View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <GlassCard>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={resetActivity}
                    className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-white/60" />
                  </button>
                  <h2 className="text-xl font-semibold text-white/80">{selectedActivity.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className={`${selectedActivity.bgColor} rounded-2xl p-8 flex items-center justify-center min-h-[320px]`}>
                    {renderActivityAnimation()}
                  </div>

                  <div className="space-y-5">
                    <p className="text-white/60 text-sm leading-relaxed">{selectedActivity.longDescription}</p>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-xs text-white/40">Duration</p>
                        <p className="text-sm font-semibold text-white/70">{selectedActivity.duration} min</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <Heart className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-xs text-white/40">Benefits</p>
                        <p className="text-sm font-semibold text-white/70">{selectedActivity.benefits?.length || 0}</p>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <Award className="w-4 h-4 mx-auto mb-1 text-emerald-400" />
                        <p className="text-xs text-white/40">Level</p>
                        <p className="text-sm font-semibold text-white/70">Beginner</p>
                      </div>
                    </div>

                    {selectedActivity.benefits && (
                      <div>
                        <h3 className="text-sm font-semibold text-white/60 mb-2">Benefits</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedActivity.benefits.map((benefit, i) => (
                            <span key={i} className="text-xs text-emerald-400/80 bg-emerald-500/10 px-2 py-1 rounded-full">
                              ✓ {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedActivity.animation === "breathing" && isActive && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                        <p className="text-sm font-medium text-emerald-400 capitalize">{breathingPhase}</p>
                      </div>
                    )}

                    {selectedActivity.instructions && (
                      <div>
                        <button
                          onClick={() => setShowInstructions(!showInstructions)}
                          className="text-sm text-emerald-400 flex items-center gap-1"
                        >
                          <ChevronDown className={`w-4 h-4 transition-transform ${showInstructions ? 'rotate-180' : ''}`} />
                          {showInstructions ? 'Hide' : 'Show'} Instructions
                        </button>
                        <AnimatePresence>
                          {showInstructions && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-1 text-xs text-white/40 list-disc list-inside"
                            >
                              {selectedActivity.instructions.map((instruction, i) => (
                                <li key={i}>{instruction}</li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      {!isActive && !completed ? (
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => startActivity(selectedActivity)}
                          className="flex-1 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)]"
                        >
                          Start Activity
                        </motion.button>
                      ) : (
                        <>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={pauseActivity}
                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          >
                            {isPaused ? 'Resume' : 'Pause'}
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={resetActivity}
                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-white/[0.06] text-white/60 border border-white/[0.08]"
                          >
                            Cancel
                          </motion.button>
                        </>
                      )}
                    </div>

                    {completed && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center"
                      >
                        <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 font-medium">Great job! Activity completed!</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Bottom Navigation */}
        {!selectedActivity && (
          <div className="grid grid-cols-2 gap-3 mt-8">
            {[
              { href: "/dashboard", icon: Home, label: "Dashboard", sub: "Log your mood", color: "#22c55e" },
              { href: "/Analytics_Page", icon: BarChart3, label: "Analytics", sub: "Track mood patterns", color: "#38bdf8" },
            ].map(({ href, icon: Icon, label, sub, color }) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
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
        )}
      </div>
    </div>
  );
}
