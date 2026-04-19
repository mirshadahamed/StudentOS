"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smile,
  Meh,
  Frown,
  Angry,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Moon,
  Heart,
  Mic,
  Camera,
  X,
  Check,
  Volume2,
  Loader2,
  Sparkles,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Send,
  SmilePlus,
  ThumbsUp,
  ThumbsDown,
  Eye,
  EyeOff,
  Activity,
  BarChart3,
  Home,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Coffee,
  Music,
  Briefcase,
  Utensils,
  Car,
  Users,
  BookOpen,
  Dumbbell,
  Wind,
  Moon as MoonIcon,
  AlertTriangle,
  Menu,
  X as XIcon,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: Date;
  note?: string;
  factors?: string[];
  source: "emoji" | "voice" | "camera" | "text";
}

interface SentimentAnalysis {
  score: number;
  label: "positive" | "neutral" | "negative";
  confidence: number;
  mood?: string;
}

interface UserData {
  name: string;
  email: string;
  profileImage?: string;
}

// Mood definitions with updated colors (soft tones)
const moodEmojis = [
  { id: "happy", emoji: "😊", label: "Happy", color: "text-[#4ADE80]", bg: "bg-[#4ADE80]", lightBg: "bg-[#4ADE80]/10", gradient: "from-[#4ADE80] to-[#22C55E]", value: 5 },
  { id: "excited", emoji: "🎉", label: "Excited", color: "text-[#F97316]", bg: "bg-[#F97316]", lightBg: "bg-[#F97316]/10", gradient: "from-[#F97316] to-[#EA580C]", value: 5 },
  { id: "calm", emoji: "😌", label: "Calm", color: "text-[#34D399]", bg: "bg-[#34D399]", lightBg: "bg-[#34D399]/10", gradient: "from-[#34D399] to-[#10B981]", value: 4 },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "text-[#9CA3AF]", bg: "bg-[#9CA3AF]", lightBg: "bg-[#9CA3AF]/10", gradient: "from-[#9CA3AF] to-[#6B7280]", value: 3 },
  { id: "tired", emoji: "😴", label: "Tired", color: "text-[#A78BFA]", bg: "bg-[#A78BFA]", lightBg: "bg-[#A78BFA]/10", gradient: "from-[#A78BFA] to-[#8B5CF6]", value: 2 },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "text-[#38BDF8]", bg: "bg-[#38BDF8]", lightBg: "bg-[#38BDF8]/10", gradient: "from-[#38BDF8] to-[#0EA5E9]", value: 2 },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-[#60A5FA]", bg: "bg-[#60A5FA]", lightBg: "bg-[#60A5FA]/10", gradient: "from-[#60A5FA] to-[#3B82F6]", value: 1 },
  { id: "angry", emoji: "😠", label: "Angry", color: "text-[#F87171]", bg: "bg-[#F87171]", lightBg: "bg-[#F87171]/10", gradient: "from-[#F87171] to-[#EF4444]", value: 1 }
];

// Activity suggestions based on mood
const moodActivities = {
  happy: ["Dance to upbeat music", "Share your joy with someone", "Start a creative project"],
  excited: ["Channel energy into exercise", "Plan something fun", "Learn something new"],
  calm: ["Practice mindfulness", "Read a book", "Enjoy nature"],
  neutral: ["Try something new", "Listen to music", "Connect with a friend"],
  tired: ["Take a power nap", "Drink water", "Gentle stretching"],
  anxious: ["Deep breathing", "Grounding exercise", "Talk to someone"],
  sad: ["Watch a comfort movie", "Write in journal", "Call a loved one"],
  angry: ["Physical exercise", "Count to ten", "Write down feelings"]
};

// Mood factors that can affect how you're feeling
const moodFactors = [
  { id: "work", label: "Work", icon: Briefcase, color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10", border: "border-[#38BDF8]/20" },
  { id: "food", label: "Food", icon: Utensils, color: "text-[#F97316]", bg: "bg-[#F97316]/10", border: "border-[#F97316]/20" },
  { id: "travel", label: "Travel", icon: Car, color: "text-[#4ADE80]", bg: "bg-[#4ADE80]/10", border: "border-[#4ADE80]/20" },
  { id: "social", label: "Social", icon: Users, color: "text-[#A78BFA]", bg: "bg-[#A78BFA]/10", border: "border-[#A78BFA]/20" },
  { id: "study", label: "Study", icon: BookOpen, color: "text-[#38BDF8]", bg: "bg-[#38BDF8]/10", border: "border-[#38BDF8]/20" },
  { id: "exercise", label: "Exercise", icon: Dumbbell, color: "text-[#F87171]", bg: "bg-[#F87171]/10", border: "border-[#F87171]/20" },
  { id: "weather", label: "Weather", icon: Wind, color: "text-[#86EFAC]", bg: "bg-[#86EFAC]/10", border: "border-[#86EFAC]/20" },
  { id: "sleep", label: "Sleep", icon: MoonIcon, color: "text-[#9CA3AF]", bg: "bg-[#9CA3AF]/10", border: "border-[#9CA3AF]/20" },
  { id: "health", label: "Health", icon: Heart, color: "text-[#F87171]", bg: "bg-[#F87171]/10", border: "border-[#F87171]/20" },
  { id: "family", label: "Family", icon: Users, color: "text-[#4ADE80]", bg: "bg-[#4ADE80]/10", border: "border-[#4ADE80]/20" }
];

// Banned words for content filtering
const bannedWords = ["kill", "suicide", "die", "death", "kill myself", "hurt myself", "self harm", "end it"];

// Animated gradient background with shade effects
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1A] via-[#0F172A] to-[#020617]" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#22C55E]/5 via-transparent to-transparent" />
      
      {/* Animated gradient orbs with shade effects */}
      <motion.div
        className="absolute top-20 -left-40 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.05) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 150, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-20 -right-40 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(74,222,128,0.1) 0%, rgba(74,222,128,0.03) 50%, transparent 70%)",
        }}
        animate={{
          x: [0, -120, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.02) 50%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Additional subtle shade layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/50 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1A]/30 via-transparent to-[#020617]/30" />
      
      {/* Grid pattern for texture */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(to right, #22C55E 1px, transparent 1px), linear-gradient(to bottom, #22C55E 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }} 
      />
    </div>
  );
};

// Floating particles with shade
const FloatingParticles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.2 + 0.05,
    blur: Math.random() * 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, rgba(34,197,94,${particle.opacity}) 0%, rgba(34,197,94,0) 100%)`,
            filter: `blur(${particle.blur}px)`,
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  
  // State for mood logging
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  
  // State for other features
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSentiment, setShowSentiment] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  
  // User state
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Refs for debounce and tracking
  const noteTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectedMoodRef = useRef<string | null>(null);
  const moodNoteRef = useRef("");
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const errorTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    selectedMoodRef.current = selectedMood;
  }, [selectedMood]);

  useEffect(() => {
    moodNoteRef.current = moodNote;
  }, [moodNote]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMobileMenuOpen && !target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Show error message with auto-hide
  const showErrorMessage = (message: string) => {
    setErrorMessage(message);
    setShowError(true);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      setShowError(false);
      setTimeout(() => setErrorMessage(null), 300);
    }, 4000);
  };

  // Validate input text
  const validateText = (text: string): boolean => {
    const trimmedText = text.trim();
    
    if (trimmedText.length === 0) {
      showErrorMessage("Please write something before saving.");
      return false;
    }
    
    if (trimmedText.length < 5) {
      showErrorMessage("Please write a more meaningful message (at least 5 characters).");
      return false;
    }
    
    if (trimmedText.length > 500) {
      showErrorMessage("Message is too long. Maximum 500 characters allowed.");
      return false;
    }
    
    const lowerText = trimmedText.toLowerCase();
    const foundBannedWord = bannedWords.some(word => lowerText.includes(word));
    
    if (foundBannedWord) {
      showErrorMessage(
        "⚠️ Sensitive content detected. Please remember that support is available. " +
        "If you're struggling, please reach out to a trusted friend, family member, or mental health professional."
      );
      return false;
    }
    
    const meaninglessPatterns = [
      /^[a-z]{1,3}$/i,
      /^(ok|okay|hmm|hmm|meh|meh|idk|idk|k)$/i,
      /^(.)\1{5,}$/,
      /^[\s\-_~]*$/
    ];
    
    if (meaninglessPatterns.some(pattern => pattern.test(trimmedText))) {
      showErrorMessage("Please write a more meaningful message. Your thoughts matter!");
      return false;
    }
    
    return true;
  };

  // Fetch user data from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("student_user_id");
        
        if (!userId) {
          setIsLoadingUser(false);
          return;
        }
        
        const response = await fetch(`/api/user/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Sentiment analysis function
  const analyzeSentiment = async (text: string) => {
    try {
      setIsAnalyzing(true);

      const res = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data.error);
        return;
      }

      setSentiment({
        score: data.score,
        label: data.label,
        confidence: data.score,
        mood: data.mood,
      });

      if (!selectedMoodRef.current && data.mood) {
        setSelectedMood(data.mood);
      }

    } catch (error) {
      console.error("Sentiment error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    );
  };

  const saveMoodEntry = async () => {
    const currentMood = selectedMoodRef.current;
    const currentNote = moodNoteRef.current.trim();

    if (!currentMood && !currentNote) {
      showErrorMessage("Please select a mood or write about your day.");
      return;
    }
    
    if (currentNote && !validateText(currentNote)) {
      return;
    }

    try {
      const userId = localStorage.getItem("student_user_id");

      if (!userId) {
        showErrorMessage("Please login first to save mood and send risk notifications.");
        return;
      }

      let moodToSave = currentMood;
      
      if (!moodToSave && currentNote && sentiment) {
        if (sentiment.label === "negative") {
          moodToSave = "sad";
        } else if (sentiment.label === "positive") {
          moodToSave = "happy";
        } else {
          moodToSave = "neutral";
        }
      }
      
      if (!moodToSave) {
        moodToSave = "neutral";
      }

      // Save mood with intensity and factors
      const saveRes = await fetch("/api/save-mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          text: currentNote,
          mood: moodToSave,
          score: sentiment?.score || 0,
          intensity: moodIntensity, // Store intensity value
          factors: selectedFactors,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save mood");
      }

      const savedData = await saveRes.json();

      if (moodToSave === "sad") {
        const riskRes = await fetch("/api/check-risk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        const riskData = await riskRes.json();

        if (riskData.danger) {
          const notifyRes = await fetch("/api/notify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              message: riskData.message || "User emotional risk detected",
            }),
          });

          const notifyData = await notifyRes.json();

          if (notifyRes.ok && notifyData.success) {
            alert("⚠️ Your trusted person has been notified because your mood shows risk.");
          } else {
            alert(`⚠️ Risk detected, but notification failed: ${notifyData.error || "Unknown error"}`);
          }
        }
      }

      const newEntry: MoodEntry = {
        id: savedData._id || Date.now().toString(),
        mood: moodToSave,
        intensity: moodIntensity,
        timestamp: new Date(),
        note: currentNote,
        factors: selectedFactors.length > 0 ? selectedFactors : undefined,
        source: currentMood ? "emoji" : "text",
      };

      setRecentEntries((prev) => [newEntry, ...prev].slice(0, 10));

      setSelectedMood(null);
      setMoodNote("");
      setSentiment(null);
      setSelectedFactors([]);
      setMoodIntensity(3);

      alert(`✅ Mood saved successfully as "${moodToSave}" with intensity ${moodIntensity}/5!`);

    } catch (error) {
      console.error("Error saving mood:", error);
      showErrorMessage("❌ Failed to save mood. Please try again.");
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case "positive": return "text-[#4ADE80] bg-[#4ADE80]/20";
      case "negative": return "text-[#F87171] bg-[#F87171]/20";
      default: return "text-[#9CA3AF] bg-[#9CA3AF]/20";
    }
  };

  const getCurrentSuggestions = () => {
    if (!selectedMood) return [];
    return moodActivities[selectedMood as keyof typeof moodActivities] || [];
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getUserFirstName = () => {
    if (userData?.name) {
      return userData.name.split(' ')[0];
    }
    return null;
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (errorTimeout.current) {
        clearTimeout(errorTimeout.current);
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background with Shade Effects */}
      <AnimatedBackground />
      <FloatingParticles />

      {/* Error Toast Notification */}
      <AnimatePresence>
        {showError && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -100, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -100, x: "-50%" }}
            className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform"
          >
            <div className="flex items-center gap-3 bg-red-950/90 backdrop-blur-md border border-red-800 rounded-xl px-4 py-3 shadow-2xl shadow-red-900/20 max-w-md">
              <div className="p-1 bg-red-900/50 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <p className="text-sm text-red-200 flex-1">{errorMessage}</p>
              <button
                onClick={() => setShowError(false)}
                className="p-1 hover:bg-red-900/50 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar with shadow */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#111827]/80 backdrop-blur-md border-b border-[#374151] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button - Left Side */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 text-[#E5E7EB] bg-[#1F2937]/80 backdrop-blur-sm rounded-xl hover:bg-[#374151] transition-all font-medium shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex items-center gap-2">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 px-5 py-2.5 text-[#22C55E] bg-[#22C55E]/10 rounded-xl hover:bg-[#22C55E]/20 transition-all font-medium shadow-md"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              <Link 
                href="/Analytics_Page" 
                className="flex items-center gap-2 px-5 py-2.5 text-[#E5E7EB] hover:text-[#22C55E] bg-[#1F2937]/80 backdrop-blur-sm rounded-xl hover:bg-[#374151] transition-all font-medium shadow-md"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link 
                href="/ActivityPage" 
                className="flex items-center gap-2 px-5 py-2.5 text-[#E5E7EB] hover:text-[#22C55E] bg-[#1F2937]/80 backdrop-blur-sm rounded-xl hover:bg-[#374151] transition-all font-medium shadow-md"
              >
                <Activity className="w-4 h-4" />
                <span>Activities</span>
              </Link>
            </div>

            {/* Mobile Menu Button - Right Side */}
            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-xl bg-[#1F2937]/80 backdrop-blur-sm text-[#E5E7EB] hover:bg-[#374151] transition-all shadow-md"
              >
                {isMobileMenuOpen ? (
                  <XIcon className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>

            {/* Empty div for spacing on desktop */}
            <div className="w-[100px] hidden md:block"></div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="mobile-menu-container fixed left-0 top-0 bottom-0 w-72 bg-[#111827]/95 backdrop-blur-xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-6 border-b border-[#374151]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-[#22C55E]" />
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-[#1F2937] rounded-lg transition-colors"
                  >
                    <XIcon className="w-5 h-5 text-[#E5E7EB]" />
                  </motion.button>
                </div>
                {/* Back Button in Mobile Menu */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/");
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 bg-[#1F2937] hover:bg-[#374151] rounded-xl transition-all text-[#E5E7EB] mt-4 shadow-md"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Go Back</span>
                </motion.button>
                {userData && (
                  <div className="mt-4">
                    <p className="text-sm text-[#9CA3AF]">Welcome back,</p>
                    <p className="font-semibold text-lg text-[#E5E7EB]">{userData.name}</p>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#1F2937] transition-all duration-200 group shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-[#22C55E]/10 text-[#22C55E] group-hover:bg-[#22C55E] group-hover:text-white transition-colors">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#E5E7EB]">Home</p>
                    <p className="text-xs text-[#9CA3AF]">Your mood dashboard</p>
                  </div>
                </Link>
                
                <Link
                  href="/Analytics_Page"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#1F2937] transition-all duration-200 group shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-[#1F2937] text-[#9CA3AF] group-hover:bg-[#22C55E] group-hover:text-white transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#E5E7EB]">Analytics</p>
                    <p className="text-xs text-[#9CA3AF]">Track your mood patterns</p>
                  </div>
                </Link>
                
                <Link
                  href="/ActivityPage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#1F2937] transition-all duration-200 group shadow-sm"
                >
                  <div className="p-2 rounded-lg bg-[#1F2937] text-[#9CA3AF] group-hover:bg-[#22C55E] group-hover:text-white transition-colors">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-[#E5E7EB]">Activities</p>
                    <p className="text-xs text-[#9CA3AF]">Wellness activities</p>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add padding top to account for fixed header */}
      <div className="pt-16 relative z-10">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Welcome Header with Simple Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {isLoadingUser ? (
              <div className="flex items-center justify-center gap-2 mb-3">
                <Loader2 className="w-6 h-6 text-[#22C55E] animate-spin" />
                <h1 className="text-3xl font-bold text-[#E5E7EB] sm:text-4xl">Loading...</h1>
              </div>
            ) : (
              <h1 className="mb-3 text-3xl font-bold text-[#E5E7EB] sm:text-4xl drop-shadow-lg">
                {getGreeting()}
                {getUserFirstName() && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#4ADE80]">
                    {`, ${getUserFirstName()}`}
                  </span>
                )}
                <span className="ml-2">👋</span>
              </h1>
            )}
            <p className="text-lg text-[#9CA3AF] mb-2">
              How are you feeling today?
            </p>
            <p className="text-sm text-[#6B7280]">
              {getFormattedDate()}
            </p>
          </motion.div>

          {/* Character Counter */}
          {moodNote.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end mb-2"
            >
              <span className={`text-xs ${moodNote.length > 500 ? 'text-red-400' : 'text-[#6B7280]'}`}>
                {moodNote.length}/500 characters
              </span>
            </motion.div>
          )}

          {/* Main Card - Quick Check-in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1F2937]/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-[#374151] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] transition-all duration-300"
          >
            {/* Card Header with Gradient */}
            <div className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-5 py-5 sm:px-8 sm:py-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <h2 className="flex items-center gap-3 text-xl font-semibold text-white sm:text-2xl relative z-10">
                <Sparkles className="w-6 h-6" />
                Quick Mood Check-in
              </h2>
              <p className="text-green-100 mt-1 relative z-10">Share how you're feeling right now</p>
            </div>

            {/* Card Body */}
            <div className="p-5 sm:p-8">
              {/* Selected Mood Display */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-[#E5E7EB]">Selected mood:</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedMood(null)}
                      className="text-sm text-[#9CA3AF] hover:text-[#E5E7EB] flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  </div>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className={`inline-flex items-center gap-3 px-4 py-2 rounded-full mt-2 ${
                      moodEmojis.find(m => m.id === selectedMood)?.lightBg
                    }`}
                  >
                    <span className="text-2xl">
                      {moodEmojis.find(m => m.id === selectedMood)?.emoji}
                    </span>
                    <span className={`font-medium ${
                      moodEmojis.find(m => m.id === selectedMood)?.color
                    }`}>
                      {moodEmojis.find(m => m.id === selectedMood)?.label}
                    </span>
                  </motion.div>
                </motion.div>
              )}

              {/* Emoji Grid */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-4">
                  {!selectedMood ? "Choose your mood" : "Or change your mood"}
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                  {moodEmojis.map((mood, index) => (
                    <motion.button
                      key={mood.id}
                      type="button"
                      data-testid={`mood-${mood.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedMood(mood.id);
                        requestAnimationFrame(() => noteTextareaRef.current?.focus());
                      }}
                      className={`
                        relative group flex flex-col items-center rounded-2xl p-4 sm:p-6
                        transition-all duration-300
                        ${selectedMood === mood.id ? `${mood.lightBg} ring-2 ring-[#22C55E] ring-offset-2 ring-offset-[#1F2937]` : mood.lightBg}
                        hover:shadow-lg hover:shadow-green-500/10
                        border border-[#374151] hover:border-[#22C55E]
                      `}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                        style={{
                          background: `radial-gradient(circle at 50% 0%, ${mood.color.replace('text', 'bg')}20, transparent 70%)`
                        }}
                      />
                      
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className="relative z-10 mb-3 text-3xl sm:text-4xl"
                      >
                        {mood.emoji}
                      </motion.div>
                      
                      <span className={`text-sm font-medium ${mood.color} relative z-10`}>
                        {mood.label}
                      </span>
                      
                      {selectedMood === mood.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <Check className="w-4 h-4 text-[#22C55E]" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-[#E5E7EB] mb-4">
                  Write about your day
                </h3>
                <div className="relative">
                  <textarea
                    ref={noteTextareaRef}
                    value={moodNote}
                    onChange={(e) => {
                      const value = e.target.value;
                      setMoodNote(value);

                      if (debounceTimer.current) {
                        clearTimeout(debounceTimer.current);
                      }

                      debounceTimer.current = setTimeout(() => {
                        if (value.trim().length > 15) {
                          analyzeSentiment(value);
                        }
                      }, 500);
                    }}
                    placeholder="How was your day? What's on your mind?... (minimum 5 characters)"
                    className="w-full p-4 border border-[#374151] bg-[#111827]/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-[#22C55E] focus:border-transparent resize-none text-[#E5E7EB] placeholder:text-[#6B7280]"
                    rows={4}
                    maxLength={500}
                  />
                  
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-4 right-4 flex items-center gap-2 text-sm bg-[#111827]/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-[#374151]"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-[#22C55E]" />
                        <span className="text-[#9CA3AF]">Analyzing...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Real-time Sentiment Display */}
              <AnimatePresence>
                {sentiment && showSentiment && moodNote.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-xl text-white shadow-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">AI Sentiment Analysis</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSentiment(!showSentiment)}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {showSentiment ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        getSentimentColor(sentiment.label)
                      }`}>
                        {sentiment.label}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(sentiment.score + 1) * 50}%` }}
                            className="bg-white rounded-full h-2"
                          />
                        </div>
                      </div>
                      <span className="text-sm font-semibold">
                        {(sentiment.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    
                    <p className="text-sm text-white/80 mt-2">
                      Confidence: {(sentiment.confidence * 100).toFixed(0)}%
                    </p>
                    
                    {sentiment.mood && !selectedMoodRef.current && (
                      <p className="text-sm text-white/90 mt-2 italic">
                        Detected mood: {sentiment.mood}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Intensity Section - Always visible when mood is selected */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-8"
                >
                  <div className="bg-[#111827]/50 backdrop-blur-sm rounded-2xl p-6 border border-[#374151] shadow-inner">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium text-[#E5E7EB]">
                        How intense is this feeling?
                      </label>
                      <motion.div
                        key={moodIntensity}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          moodIntensity <= 2 ? 'bg-[#38BDF8]/20 text-[#38BDF8]' :
                          moodIntensity <= 4 ? 'bg-[#4ADE80]/20 text-[#4ADE80]' :
                          'bg-[#F87171]/20 text-[#F87171]'
                        }`}
                      >
                        {moodIntensity <= 2 ? 'Mild' : moodIntensity <= 4 ? 'Moderate' : 'Intense'}
                      </motion.div>
                    </div>
                    
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={moodIntensity}
                      onChange={(e) => setMoodIntensity(Number(e.target.value))}
                      className="w-full h-3 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-[#22C55E]"
                      style={{
                        background: `linear-gradient(to right, 
                          ${moodEmojis.find(m => m.id === selectedMood)?.color.replace('text', '')} 0%, 
                          ${moodEmojis.find(m => m.id === selectedMood)?.color.replace('text', '')} ${(moodIntensity/5)*100}%, 
                          #374151 ${(moodIntensity/5)*100}%, 
                          #374151 100%)`
                      }}
                    />
                    
                    <div className="flex justify-between text-xs text-[#9CA3AF] mt-2 px-1">
                      <span>😌 Mild</span>
                      <span>😐 Moderate</span>
                      <span>😫 Intense</span>
                    </div>
                    
                    {/* Intensity description */}
                    <p className="text-xs text-[#6B7280] mt-3 text-center">
                      {moodIntensity === 1 && "Barely noticeable"}
                      {moodIntensity === 2 && "Slightly felt"}
                      {moodIntensity === 3 && "Moderately intense"}
                      {moodIntensity === 4 && "Very intense"}
                      {moodIntensity === 5 && "Extremely intense"}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Factors Section */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                      <Activity className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <h3 className="text-lg font-medium text-[#E5E7EB]">
                      What&apos;s affecting your mood?
                    </h3>
                    <span className="text-xs text-[#6B7280] ml-auto">
                      Select all that apply
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                    {moodFactors.map((factor) => {
                      const Icon = factor.icon;
                      const isSelected = selectedFactors.includes(factor.id);
                      
                      return (
                        <motion.button
                          key={factor.id}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleFactor(factor.id)}
                          className={`
                            relative flex flex-col items-center p-4 rounded-xl
                            transition-all duration-200 border
                            ${isSelected 
                              ? `${factor.bg} ${factor.color} ring-2 ring-offset-2 ring-[#22C55E] border-[#22C55E]` 
                              : 'bg-[#111827]/50 backdrop-blur-sm hover:bg-[#1F2937] text-[#9CA3AF] border-[#374151]'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 mb-2 ${isSelected ? factor.color : 'text-[#6B7280]'}`} />
                          <span className={`text-xs font-medium ${isSelected ? factor.color : 'text-[#9CA3AF]'}`}>
                            {factor.label}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center shadow-md"
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {selectedFactors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 flex flex-wrap gap-2"
                    >
                      <span className="text-xs text-[#6B7280]">Selected:</span>
                      {selectedFactors.map(factorId => {
                        const factor = moodFactors.find(f => f.id === factorId);
                        return factor ? (
                          <span
                            key={factor.id}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${factor.bg} ${factor.color}`}
                          >
                            <factor.icon className="w-3 h-3" />
                            {factor.label}
                          </span>
                        ) : null;
                      })}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Suggested Activities */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Coffee className="w-4 h-4 text-[#22C55E]" />
                    <h4 className="text-sm font-medium text-[#E5E7EB]">Suggested activities:</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getCurrentSuggestions().map((suggestion, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setMoodNote(suggestion)}
                        className="px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-sm hover:bg-[#22C55E]/20 transition-colors border border-[#22C55E]/20 shadow-sm"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Save Button */}
              {(selectedMood || moodNote) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={saveMoodEntry}
                    className="flex-1 py-4 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl font-semibold hover:shadow-lg transition-all relative overflow-hidden group shadow-md"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    />
                    <span className="relative flex items-center justify-center gap-2">
                      <Heart className="w-5 h-5" />
                      Log My Mood
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedMood(null);
                      setMoodNote("");
                      setSentiment(null);
                      setSelectedFactors([]);
                      setMoodIntensity(3);
                    }}
                    className="px-6 py-4 bg-[#111827]/50 backdrop-blur-sm text-[#9CA3AF] rounded-xl hover:bg-[#1F2937] transition-colors border border-[#374151] sm:w-auto shadow-sm"
                  >
                    Cancel
                  </motion.button>
                </motion.div>
              )}

              {/* Quick Tips */}
              {!selectedMood && !moodNote && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-4 bg-[#22C55E]/5 rounded-xl border border-[#22C55E]/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                      <Sparkles className="w-4 h-4 text-[#22C55E]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#22C55E] mb-1">Quick Tip</h4>
                      <p className="text-sm text-[#9CA3AF]">
                        Select a mood or write about your day to get started. Our AI will help analyze your emotions!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Recent Entries Preview */}
          {recentEntries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-center"
            >
              <p className="text-sm text-[#6B7280]">
                You&apos;ve logged {recentEntries.length} {recentEntries.length === 1 ? 'entry' : 'entries'} today
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}