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
  Moon as MoonIcon
} from "lucide-react";
import Link from "next/link";

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
}

// Mood definitions with enhanced styling
const moodEmojis = [
  { id: "happy", emoji: "😊", label: "Happy", color: "text-yellow-500", bg: "bg-yellow-500", lightBg: "bg-yellow-50", gradient: "from-yellow-400 to-amber-500", value: 5 },
  { id: "excited", emoji: "🎉", label: "Excited", color: "text-orange-500", bg: "bg-orange-500", lightBg: "bg-orange-50", gradient: "from-orange-400 to-red-500", value: 5 },
  { id: "calm", emoji: "😌", label: "Calm", color: "text-green-500", bg: "bg-green-500", lightBg: "bg-green-50", gradient: "from-green-400 to-teal-500", value: 4 },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "text-gray-500", bg: "bg-gray-500", lightBg: "bg-gray-50", gradient: "from-gray-400 to-gray-600", value: 3 },
  { id: "tired", emoji: "😴", label: "Tired", color: "text-purple-500", bg: "bg-purple-500", lightBg: "bg-purple-50", gradient: "from-purple-400 to-indigo-500", value: 2 },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "text-indigo-500", bg: "bg-indigo-500", lightBg: "bg-indigo-50", gradient: "from-indigo-400 to-blue-500", value: 2 },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-blue-500", bg: "bg-blue-500", lightBg: "bg-blue-50", gradient: "from-blue-400 to-cyan-500", value: 1 },
  { id: "angry", emoji: "😠", label: "Angry", color: "text-red-500", bg: "bg-red-500", lightBg: "bg-red-50", gradient: "from-red-400 to-rose-500", value: 1 }
];

// Quick mood options with enhanced styling
const quickMoods = [
  { id: "great", text: "Feeling Great!", icon: Sun, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" },
  { id: "good", text: "Pretty Good", icon: ThumbsUp, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
  { id: "okay", text: "Just Okay", icon: Meh, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
  { id: "bad", text: "Not Great", icon: Frown, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "awful", text: "Awful", icon: Angry, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" }
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
  { id: "work", label: "Work", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-200" },
  { id: "food", label: "Food", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  { id: "travel", label: "Travel", icon: Car, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" },
  { id: "social", label: "Social", icon: Users, color: "text-purple-500", bg: "bg-purple-50", border: "border-purple-200" },
  { id: "study", label: "Study", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200" },
  { id: "exercise", label: "Exercise", icon: Dumbbell, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" },
  { id: "weather", label: "Weather", icon: Wind, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-200" },
  { id: "sleep", label: "Sleep", icon: MoonIcon, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
  { id: "health", label: "Health", icon: Heart, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-200" },
  { id: "family", label: "Family", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" }
];

export default function Dashboard() {
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Simulate sentiment analysis
  const analyzeSentiment = async (text: string) => {
    try {
      setIsAnalyzing(true);

      const res = await fetch("/api/analyze-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      const result = data[0]; // HuggingFace response

      let label: "positive" | "neutral" | "negative" = "neutral";

      if (result.label.toLowerCase().includes("sad")) {
        label = "negative";
      } else if (result.label.toLowerCase().includes("joy")) {
        label = "positive";
      }

      setSentiment({
        score: result.score,
        label,
        confidence: result.score,
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle factor selection
  const toggleFactor = (factorId: string) => {
    setSelectedFactors(prev =>
      prev.includes(factorId)
        ? prev.filter(id => id !== factorId)
        : [...prev, factorId]
    );
  };

  // Save mood entry
  const saveMoodEntry = async () => {
    if (!selectedMood && !moodNote) return;

    try {
      const moodToSave =
        sentiment?.label === "negative" ? "sad" : selectedMood || "neutral";

      // 1️⃣ Save mood in DB
      const saveRes = await fetch("/api/save-mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "123", // replace with real logged user id
          mood: moodToSave,
          text: moodNote,
          score: sentiment?.score || 0,
          intensity: moodIntensity,
          factors: selectedFactors,
        }),
      });

      if (!saveRes.ok) {
        throw new Error("Failed to save mood");
      }

      // 2️⃣ Check risk (4 days rule)
      const riskRes = await fetch("/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "123" }), // replace with real logged user id
      });

      const riskData = await riskRes.json();

      if (riskData.danger) {
        await fetch("/api/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: "123", // replace with real logged user id
            type: "risk_alert",
            message: riskData.message 
          }),
        });
        
        // Show alert to user
        alert("🚨 Your trusted person has been notified. Support is available if you need it.");
      }

      // Update local state with the new entry
      const newEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood || "neutral",
        intensity: moodIntensity,
        timestamp: new Date(),
        note: moodNote || (sentiment ? `Sentiment: ${sentiment.label} (${(sentiment.score * 100).toFixed(0)}%)` : undefined),
        factors: selectedFactors.length > 0 ? selectedFactors : undefined,
        source: "emoji"
      };
      
      setRecentEntries(prev => [newEntry, ...prev].slice(0, 10));
      
      // Reset form
      setSelectedMood(null);
      setMoodNote("");
      setSentiment(null);
      setSelectedFactors([]);
      setMoodIntensity(3);
      
      alert("✅ Mood saved successfully!");

    } catch (error) {
      console.error("Error saving mood:", error);
      alert("❌ Failed to save mood. Please try again.");
    }
  };

  // Get sentiment color
  const getSentimentColor = (label: string) => {
    switch (label) {
      case "positive": return "text-green-600 bg-green-100";
      case "negative": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  // Get current mood suggestions
  const getCurrentSuggestions = () => {
    if (!selectedMood) return [];
    return moodActivities[selectedMood as keyof typeof moodActivities] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MoodFlow</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-lg">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link href="/Analytics_Page" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link href="/activities" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                <Activity className="w-5 h-5" />
                <span>Activities</span>
              </Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
          </h1>
          <p className="text-lg text-gray-600">How are you feeling today?</p>
        </motion.div>

        {/* Main Card - Quick Check-in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
        >
          {/* Card Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              Quick Mood Check-in
            </h2>
            <p className="text-purple-100 mt-1">Share how you're feeling right now</p>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Mood Selection Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6"
            >
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {!selectedMood ? "Choose your mood" : "You selected:"}
              </h3>
              {selectedMood && (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${
                    moodEmojis.find(m => m.id === selectedMood)?.lightBg
                  }`}
                >
                  <span className="text-2xl">
                    {moodEmojis.find(m => m.id === selectedMood)?.emoji}
                  </span>
                  <span className="font-medium text-gray-700">
                    {moodEmojis.find(m => m.id === selectedMood)?.label}
                  </span>
                  <button
                    onClick={() => setSelectedMood(null)}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Emoji Grid */}
            {!selectedMood ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
              >
                {moodEmojis.map((mood, index) => (
                  <motion.button
                    key={mood.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`
                      relative group flex flex-col items-center p-6 rounded-2xl
                      transition-all duration-300
                      ${mood.lightBg} hover:shadow-lg
                      border-2 border-transparent hover:border-${mood.color.split('-')[1]}-200
                    `}
                  >
                    {/* Floating animation on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, ${mood.color.replace('text', 'bg')}20, transparent 70%)`
                      }}
                    />
                    
                    {/* Emoji with glow effect */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-4xl mb-3 relative z-10"
                    >
                      {mood.emoji}
                    </motion.div>
                    
                    <span className={`text-sm font-medium ${mood.color} relative z-10`}>
                      {mood.label}
                    </span>
                    
                    {/* Value indicator */}
                    <div className="absolute top-2 right-2">
                      <div className={`w-2 h-2 rounded-full ${mood.bg} opacity-50`} />
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              /* Intensity Slider */
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-medium text-gray-700">
                      How intense is this feeling?
                    </label>
                    <motion.div
                      key={moodIntensity}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        moodIntensity <= 2 ? 'bg-blue-100 text-blue-700' :
                        moodIntensity <= 4 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
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
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    style={{
                      background: `linear-gradient(to right, 
                        ${moodEmojis.find(m => m.id === selectedMood)?.color.replace('text', '#')} 0%, 
                        ${moodEmojis.find(m => m.id === selectedMood)?.color.replace('text', '#')} ${(moodIntensity/5)*100}%, 
                        #e5e7eb ${(moodIntensity/5)*100}%, 
                        #e5e7eb 100%)`
                    }}
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                    <span>😌 Mild</span>
                    <span>😐 Moderate</span>
                    <span>😫 Intense</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* What's Affecting Your Mood Section */}
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    What's affecting your mood?
                  </h3>
                  <span className="text-xs text-gray-400 ml-auto">
                    Select all that apply
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {moodFactors.map((factor) => {
                    const Icon = factor.icon;
                    const isSelected = selectedFactors.includes(factor.id);
                    
                    return (
                      <motion.button
                        key={factor.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleFactor(factor.id)}
                        className={`
                          relative flex flex-col items-center p-4 rounded-xl
                          transition-all duration-200
                          ${isSelected 
                            ? `${factor.bg} ${factor.color} ring-2 ring-offset-2 ring-${factor.color.split('-')[1]}-500` 
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
                          }
                        `}
                      >
                        <Icon className={`w-5 h-5 mb-2 ${isSelected ? factor.color : 'text-gray-400'}`} />
                        <span className={`text-xs font-medium ${isSelected ? factor.color : 'text-gray-500'}`}>
                          {factor.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* Selected factors summary */}
                {selectedFactors.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    <span className="text-xs text-gray-500">Selected:</span>
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

            {/* Quick Suggestions - Based on selected mood */}
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Coffee className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-medium text-gray-700">Suggested activities:</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getCurrentSuggestions().map((suggestion, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMoodNote(suggestion)}
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Text Input - Only appears when mood is selected */}
            {selectedMood && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="relative">
                  <textarea
                    value={moodNote}
                    onChange={(e) => {
                      setMoodNote(e.target.value);
                      if (e.target.value.length > 10) {
                        analyzeSentiment(e.target.value);
                      }
                    }}
                    placeholder=" "
                    className="w-full p-4 pt-6 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all peer"
                    rows={3}
                  />
                  <label className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 left-4 origin-[0] peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75">
                    Write about your mood (optional)
                  </label>
                  
                  {/* Sentiment Analysis Indicator */}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute bottom-4 right-4 flex items-center gap-2 text-sm bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg"
                      >
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-gray-600">Analyzing...</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Real-time Sentiment Display */}
            <AnimatePresence>
              {sentiment && showSentiment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-semibold">AI Sentiment Analysis</span>
                    </div>
                    <button
                      onClick={() => setShowSentiment(!showSentiment)}
                      className="p-1 hover:bg-white/20 rounded"
                    >
                      {showSentiment ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4">
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
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save Button */}
            {(selectedMood || moodNote) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={saveMoodEntry}
                  className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all relative overflow-hidden group"
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedMood(null);
                    setMoodNote("");
                    setSentiment(null);
                    setSelectedFactors([]);
                  }}
                  className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
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
                className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-100"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-900 mb-1">Quick Tip</h4>
                    <p className="text-sm text-purple-700">
                      Select a mood above to get personalized activity suggestions and track your emotional journey.
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
            <p className="text-sm text-gray-500">
              You've logged {recentEntries.length} {recentEntries.length === 1 ? 'entry' : 'entries'} today
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}