"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
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
  RefreshCw
} from "lucide-react";

// Enhanced activities data with images and rich content
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
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-50",
    // icon: "🌬️",
    benefits: ["Reduces stress", "Lowers heart rate", "Improves focus", "Calms anxiety"],
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes and take a deep breath",
      "Inhale for 4 counts, hold for 4, exhale for 6",
      "Repeat for 5 minutes"
    ],
    phases: [
      { name: "Inhale", duration: 4, color: "bg-green-500" },
      { name: "Hold", duration: 4, color: "bg-yellow-500" },
      { name: "Exhale", duration: 6, color: "bg-blue-500" }
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
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-50",
    // icon: "📝",
    benefits: ["Boosts mood", "Increases optimism", "Improves sleep", "Builds resilience"],
    prompts: [
      "What made you smile today?",
      "Who are you grateful to have in your life?",
      "What's something good that happened this week?",
      "What's a simple pleasure you enjoyed today?"
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
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    // icon: "🧘",
    benefits: ["Reduces muscle tension", "Improves posture", "Boosts energy", "Increases flexibility"]
  },
  {
    id: "4",
    title: "Push-up Challenge",
    description: "Build strength with guided push-ups",
    longDescription: "A quick strength-building workout that you can do anywhere. Perfect for releasing pent-up energy and building upper body strength.",
    duration: 5,
    category: "physical",
    moodTags: ["energetic", "stressed", "angry"],
    animation: "pushup",
    image: "https://images.unsplash.com/photo-1598971639058-999900a4427c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1598971639058-999900a4427c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-red-400 to-rose-500",
    bgColor: "bg-red-50",
    // icon: "💪",
    benefits: ["Builds upper body strength", "Releases tension", "Boosts confidence", "Improves posture"],
    sets: [
      { count: 5, rest: 15 },
      { count: 8, rest: 15 },
      { count: 5, rest: 15 },
      { count: 5, rest: 0 }
    ],
    instructions: [
      "Keep your back straight",
      "Lower until chest nearly touches floor",
      "Push up with controlled motion",
      "Breathe out when pushing up"
    ]
  },
  {
    id: "5",
    title: "Call a Friend",
    description: "Connect with someone you trust",
    longDescription: "Social connection is vital for emotional health. Reach out to someone who makes you feel understood and supported.",
    duration: 15,
    category: "social",
    moodTags: ["lonely", "sad", "isolated"],
    animation: "calling",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-purple-400 to-indigo-500",
    bgColor: "bg-purple-50",
    // icon: "📞",
    benefits: ["Reduces loneliness", "Strengthens relationships", "Provides support", "Boosts mood"],
    conversationStarters: [
      "What's been the highlight of your week?",
      "I've been thinking about you and wanted to catch up",
      "What's something fun you've done recently?",
      "I could use some cheering up - tell me something funny"
    ]
  },
  {
    id: "6",
    title: "Creative Drawing",
    description: "Express your feelings through art",
    longDescription: "You don't need to be an artist to benefit from creative expression. Let your emotions guide your hand and see what emerges.",
    duration: 20,
    category: "creative",
    moodTags: ["creative", "reflective", "calm"],
    animation: "drawing",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    // icon: "🎨",
    benefits: ["Reduces stress", "Processes emotions", "Increases mindfulness", "Boosts creativity"],
    ideas: [
      "Draw your current emotion as an abstract shape",
      "Create a gratitude doodle",
      "Sketch something in your environment",
      "Draw your safe place"
    ]
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
    color: "from-green-400 to-teal-500",
    bgColor: "bg-green-50",
    // icon: "🌳",
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
    color: "from-indigo-400 to-blue-500",
    bgColor: "bg-indigo-50",
    // icon: "😌",
    benefits: ["Reduces physical tension", "Lowers anxiety", "Improves sleep", "Increases body awareness"]
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
    color: "from-violet-400 to-purple-500",
    bgColor: "bg-violet-50",
    // icon: "🎵",
    benefits: ["Lowers cortisol", "Reduces anxiety", "Improves focus", "Enhances mood"]
  },
  {
    id: "10",
    title: "Jumping Jacks",
    description: "Get your heart rate up with jumping jacks",
    longDescription: "A quick cardio burst to energize your body and clear your mind. Great for when you need to shake off stress or wake up.",
    duration: 3,
    category: "physical",
    moodTags: ["sluggish", "tired", "stressed"],
    animation: "jumping",
    image: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    color: "from-orange-400 to-red-500",
    bgColor: "bg-orange-50",
    // icon: "🏃",
    benefits: ["Boosts energy", "Improves circulation", "Releases endorphins", "Clears mind"],
    sets: [
      { count: 20, rest: 10 },
      { count: 20, rest: 10 },
      { count: 20, rest: 0 }
    ]
  }
];

// Mood definitions with colors and images
const moods = [
  { id: "anxious", name: "Anxious", icon: Cloud, color: "text-yellow-600", bgColor: "bg-yellow-100", lightBg: "bg-yellow-50", gradient: "from-yellow-400 to-amber-500", image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "stressed", name: "Stressed", icon: Zap, color: "text-red-600", bgColor: "bg-red-100", lightBg: "bg-red-50", gradient: "from-red-400 to-rose-500", image: "https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "sad", name: "Sad", icon: Frown, color: "text-blue-600", bgColor: "bg-blue-100", lightBg: "bg-blue-50", gradient: "from-blue-400 to-cyan-500", image: "https://images.unsplash.com/photo-1486633632054-d732792b5cb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "tired", name: "Tired", icon: Moon, color: "text-purple-600", bgColor: "bg-purple-100", lightBg: "bg-purple-50", gradient: "from-purple-400 to-indigo-500", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "lonely", name: "Lonely", icon: Cloud, color: "text-indigo-600", bgColor: "bg-indigo-100", lightBg: "bg-indigo-50", gradient: "from-indigo-400 to-blue-500", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "calm", name: "Calm", icon: Sun, color: "text-orange-600", bgColor: "bg-orange-100", lightBg: "bg-orange-50", gradient: "from-orange-400 to-amber-500", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "happy", name: "Happy", icon: Smile, color: "text-green-600", bgColor: "bg-green-100", lightBg: "bg-green-50", gradient: "from-green-400 to-emerald-500", image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: "overwhelmed", name: "Overwhelmed", icon: CloudRain, color: "text-gray-600", bgColor: "bg-gray-100", lightBg: "bg-gray-50", gradient: "from-gray-400 to-slate-500", image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
];

// Categories with icons
const categories = [
  { id: "all", name: "All Activities", icon: Activity },
  { id: "mindfulness", name: "Mindfulness", icon: Wind },
  { id: "physical", name: "Physical", icon: Dumbbell },
  { id: "creative", name: "Creative", icon: PenTool },
  { id: "social", name: "Social", icon: Users },
  { id: "relaxation", name: "Relaxation", icon: Coffee }
];

// Durations for filter
const durations = [
  { id: "any", name: "Any Duration" },
  { id: "5", name: "5-10 min" },
  { id: "15", name: "15-20 min" },
  { id: "30", name: "30+ min" }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

// Breathing Animation Component
const BreathingAnimation = ({ isActive, isPaused, phase }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <Image
        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        alt="Breathing exercise"
        width={256}
        height={256}
        className="rounded-2xl object-cover"
      />
      <motion.div
        animate={{
          scale: isActive && !isPaused 
            ? phase === "inhale" ? 1.2
              : phase === "exhale" ? 0.8
              : 1
            : 1
        }}
        transition={{ duration: phase === "inhale" ? 4 : phase === "exhale" ? 6 : 4, ease: "easeInOut" }}
        className="absolute inset-0 bg-purple-500/20 rounded-2xl flex items-center justify-center"
      >
        <div className="text-white font-bold text-2xl bg-black/50 px-4 py-2 rounded-full">
          {phase === "inhale" ? "🌬️ Inhale" : phase === "exhale" ? "😮‍💨 Exhale" : "Hold"}
        </div>
      </motion.div>
    </div>
  );
};

// Push-up Animation Component
const PushupAnimation = ({ isActive, isPaused, currentSet, currentCount, totalSets }) => {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <Image
        src="https://images.unsplash.com/photo-1598971639058-999900a4427c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        alt="Push-up exercise"
        width={256}
        height={256}
        className="rounded-2xl object-cover"
      />
      <motion.div
        animate={{
          y: isActive && !isPaused ? [0, 20, 0] : 0
        }}
        transition={{
          duration: 1.5,
          repeat: isActive && !isPaused ? Infinity : 0,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-purple-500/20 rounded-2xl flex items-center justify-center"
      >
        <div className="text-white font-bold text-xl bg-black/50 px-4 py-2 rounded-full">
          {currentCount} reps
        </div>
      </motion.div>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-sm text-gray-500">
          Set {currentSet + 1} of {totalSets}
        </div>
      </div>
    </div>
  );
};

export default function ActivitiesPage() {
  const [selectedMood, setSelectedMood] = useState("");
  const [activities, setActivities] = useState(activitiesData);
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
  const [showQuickStart, setShowQuickStart] = useState(true);

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

  // Timer effect for activity
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

  const pauseActivity = () => {
    setIsPaused(!isPaused);
  };

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
    const moodColor = moods.find(m => m.id === selectedMood)?.gradient;
    return {
      mood: moodName,
      color: moodColor,
      count: moodActivities.length,
      activities: moodActivities.slice(0, 3)
    };
  };

  const suggestion = getMoodSuggestion();

  // Render activity animation based on type
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
            <Image
              src={selectedActivity.image}
              alt={selectedActivity.title}
              width={256}
              height={256}
              className="rounded-2xl object-cover"
            />
            <motion.div
              animate={{
                rotate: isActive && !isPaused ? 360 : 0,
              }}
              transition={{
                duration: 2,
                repeat: isActive && !isPaused ? Infinity : 0,
                ease: "linear"
              }}
              className="absolute inset-0 bg-purple-500/20 rounded-2xl flex items-center justify-center"
            >
              <Timer className="w-16 h-16 text-white" />
            </motion.div>
            <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white font-bold text-xl bg-black/50 px-4 py-2 rounded-full">
              {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header - Invisible background */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Back button - Show when no activity is selected */}
              {!selectedActivity && (
                <Link href="/MoodLogin">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-gray-100 rounded-lg bg-white/50 backdrop-blur-sm"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </Link>
              )}
              {selectedActivity && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={resetActivity}
                  className="p-2 hover:bg-gray-100 rounded-lg bg-white/50 backdrop-blur-sm"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </motion.button>
              )}
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <motion.h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {selectedActivity ? selectedActivity.title : "Wellness Activities"}
                </motion.h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!selectedActivity && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm text-gray-600 rounded-lg hover:bg-white/70 transition-colors lg:hidden"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedActivity ? (
          // Activity Detail View
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Hero Image */}
            <div className="relative h-64 lg:h-96">
              <Image
                src={selectedActivity.image}
                alt={selectedActivity.title}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${selectedActivity.color} opacity-60`} />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-4xl">{selectedActivity.icon}</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm">
                    {selectedActivity.category}
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-2">{selectedActivity.title}</h2>
                <p className="text-lg text-white/90 max-w-2xl">{selectedActivity.longDescription}</p>
              </div>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className={`${selectedActivity.bgColor} rounded-xl p-8 flex items-center justify-center min-h-[400px]`}>
                  {renderActivityAnimation()}
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Clock className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-semibold">{selectedActivity.duration} min</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Heart className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm text-gray-500">Moods</div>
                      <div className="font-semibold">{selectedActivity.moodTags.length}</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                      <Award className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                      <div className="text-sm text-gray-500">Level</div>
                      <div className="font-semibold">Beginner</div>
                    </div>
                  </div>

                  {selectedActivity.benefits && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Benefits</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedActivity.benefits.map((benefit, i) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            ✓ {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedActivity.animation === "breathing" && isActive && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-700 mb-2 capitalize">
                          {breathingPhase}
                        </div>
                        <div className="flex gap-2 justify-center">
                          {selectedActivity.phases?.map((phase, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                phase.name.toLowerCase() === breathingPhase
                                  ? phase.color
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedActivity.instructions && (
                    <div>
                      <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-purple-600 font-semibold flex items-center gap-2"
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
                            className="mt-4 space-y-2 list-disc list-inside text-gray-600"
                          >
                            {selectedActivity.instructions.map((instruction, i) => (
                              <li key={i}>{instruction}</li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {selectedActivity.conversationStarters && (
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h3 className="font-semibold text-purple-900 mb-3">Conversation Starters</h3>
                      <ul className="space-y-2">
                        {selectedActivity.conversationStarters.map((starter, i) => (
                          <li key={i} className="text-purple-700 text-sm">💬 {starter}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedActivity.tips && (
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
                      <ul className="space-y-1 text-sm text-blue-700">
                        {selectedActivity.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    {!isActive && !completed ? (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startActivity(selectedActivity)}
                        className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg"
                      >
                        Start Activity
                      </motion.button>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={pauseActivity}
                          className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
                        >
                          {isPaused ? 'Resume' : 'Pause'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={resetActivity}
                          className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
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
                      className="p-4 bg-green-100 text-green-700 rounded-xl text-center"
                    >
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Great job! Activity completed!</p>
                      <p className="text-sm mt-2">You're doing amazing! 🌟</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Activities Grid View
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters with images */}
            <AnimatePresence mode="wait">
              {(showFilters || !showFilters) && (
                <motion.div
                  key="filters"
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  className={`lg:w-96 ${showFilters ? 'block' : 'hidden lg:block'}`}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-semibold text-gray-900">How are you feeling?</h2>
                      {showFilters && (
                        <motion.button 
                          whileHover={{ rotate: 90 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setShowFilters(false)}
                          className="lg:hidden"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </motion.button>
                      )}
                    </div>

                    {/* Mood selector with images */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {moods.map((mood) => {
                        const Icon = mood.icon;
                        const isSelected = selectedMood === mood.id;
                        
                        return (
                          <motion.button
                            key={mood.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedMood(isSelected ? "" : mood.id)}
                            className={`
                              relative overflow-hidden rounded-xl transition-all
                              ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                            `}
                          >
                            <div className="absolute inset-0">
                              <Image
                                src={mood.image}
                                alt={mood.name}
                                fill
                                className="object-cover"
                              />
                              <div className={`absolute inset-0 bg-gradient-to-br ${mood.gradient} opacity-60`} />
                            </div>
                            <div className="relative p-3 flex items-center gap-2 text-white">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{mood.name}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Category filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map(cat => {
                          const Icon = cat.icon;
                          const isSelected = selectedCategory === cat.id;
                          return (
                            <motion.button
                              key={cat.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelectedCategory(cat.id)}
                              className={`
                                flex items-center gap-2 p-2 rounded-lg transition-all
                                ${isSelected 
                                  ? 'bg-purple-600 text-white' 
                                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }
                              `}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm">{cat.name}</span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Duration filter */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        value={selectedDuration}
                        onChange={(e) => setSelectedDuration(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                      >
                        {durations.map(dur => (
                          <option key={dur.id} value={dur.id}>{dur.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search activities..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    {/* Quick Start Toggle */}
                    <div className="mb-6">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm font-medium text-gray-700">Quick Start Mode</span>
                        <button
                          onClick={() => setShowQuickStart(!showQuickStart)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            showQuickStart ? 'bg-purple-600' : 'bg-gray-300'
                          }`}
                        >
                          <motion.div
                            className="absolute top-1 w-4 h-4 bg-white rounded-full"
                            animate={{ x: showQuickStart ? 24 : 4 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </label>
                    </div>

                    {/* Clear filters */}
                    {(selectedMood || selectedCategory !== "all" || selectedDuration !== "any" || searchQuery) && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onClick={() => {
                          setSelectedMood("");
                          setSelectedCategory("all");
                          setSelectedDuration("any");
                          setSearchQuery("");
                        }}
                        className="mt-4 text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Clear all filters
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1"
            >
              {/* Wellness Activities Heading */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                {/* <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Wellness Activities
                  </h1>
                </div>
                <p className="text-gray-600 ml-11">
                  Discover calming activities to nurture your mind and body
                </p> */}
              </motion.div>

              {/* Filter Toggle Button for Mobile */}
              <div className="lg:hidden flex justify-end mb-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg shadow-md"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                </motion.button>
              </div>

              {/* "Feeling [mood]? Try these" section */}
              {suggestion && suggestion.count > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-gradient-to-r ${suggestion.color} rounded-xl p-6 text-white mb-8 shadow-xl`}
                >
                  <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Feeling {suggestion.mood}? Try these:
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {suggestion.activities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        onClick={() => startActivity(activity)}
                        className="bg-white/10 backdrop-blur rounded-lg p-3 cursor-pointer group"
                      >
                        <div className="relative h-32 rounded-lg overflow-hidden mb-2">
                          <Image
                            src={activity.thumbnail}
                            alt={activity.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 text-2xl">
                            {activity.icon}
                          </div>
                        </div>
                        <h3 className="font-medium mb-1">{activity.title}</h3>
                        <p className="text-sm text-white/80 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.duration} min
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Activities grid */}
              <AnimatePresence mode="wait">
                {filteredActivities.length > 0 ? (
                  <motion.div
                    key="activities-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredActivities.map((activity) => (
                      <motion.div
                        key={activity.id}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onHoverStart={() => setHoveredActivity(activity.id)}
                        onHoverEnd={() => setHoveredActivity(null)}
                        onClick={() => startActivity(activity)}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all relative group cursor-pointer"
                      >
                        {/* Card Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={activity.thumbnail}
                            alt={activity.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${activity.color} opacity-0 group-hover:opacity-30 transition-opacity`} />
                          
                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-white/90 backdrop-blur text-gray-700 text-xs font-medium rounded-full shadow-lg">
                              {activity.category}
                            </span>
                          </div>

                          {/* Icon Overlay */}
                          <div className="absolute top-3 right-3 text-3xl">
                            {activity.icon}
                          </div>
                        </div>
                        
                        {/* Card Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                            {activity.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {activity.description}
                          </p>
                          
                          {/* Mood Tags */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {activity.moodTags.slice(0, 3).map((tag, i) => {
                              const mood = moods.find(m => m.id === tag);
                              return mood ? (
                                <span
                                  key={i}
                                  className={`px-2 py-0.5 ${mood.lightBg} ${mood.color} text-xs rounded-full`}
                                >
                                  {mood.name}
                                </span>
                              ) : null;
                            })}
                            {activity.moodTags.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{activity.moodTags.length - 3}
                              </span>
                            )}
                          </div>
                          
                          {/* Duration */}
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1 text-gray-500">
                              <Clock className="w-4 h-4" />
                              {activity.duration} min
                            </span>
                            
                            {/* Quick Start Indicator */}
                            {showQuickStart && (
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="flex items-center gap-1 text-purple-600"
                              >
                                <Play className="w-4 h-4" />
                                <span className="text-xs">Quick Start</span>
                              </motion.div>
                            )}
                          </div>

                          {/* Hover Stats */}
                          <AnimatePresence>
                            {hoveredActivity === activity.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white rounded-b-xl"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    <span className="text-xs">{activity.benefits?.length || 0} benefits</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs">Beginner</span>
                                  </div>
                                </div>
                                <p className="text-xs mt-1 opacity-90">Click to start →</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12 bg-white rounded-xl shadow-lg"
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="inline-block p-4 bg-gray-100 rounded-full mb-4"
                    >
                      <Search className="w-8 h-8 text-gray-400" />
                    </motion.div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                    <p className="text-gray-500">Try adjusting your filters or search query</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}