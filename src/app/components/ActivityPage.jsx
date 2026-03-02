"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Clock,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
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
  Book,
  PenTool,
  Users,
  Dumbbell,
  Leaf,
  Camera,
  Headphones,
  Star,
  Sparkles,
  Timer,
  Calendar,
  ChevronDown,
  X
} from "lucide-react";

// Sample activities data
const activitiesData = [
  {
    id: "1",
    title: "5-Minute Breathing Exercise",
    description: "Simple breathing technique to calm your mind and reduce anxiety",
    duration: 5,
    category: "mindfulness",
    moodTags: ["anxious", "stressed", "overwhelmed"],
    saved: false,
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes and take a deep breath",
      "Inhale for 4 counts, hold for 4, exhale for 6",
      "Repeat for 5 minutes"
    ]
  },
  {
    id: "2",
    title: "Gratitude Journaling",
    description: "Write down three things you're grateful for today",
    duration: 10,
    category: "creative",
    moodTags: ["sad", "lonely", "low"],
    saved: false
  },
  {
    id: "3",
    title: "Quick Stretch Break",
    description: "Simple stretches to release tension and boost energy",
    duration: 7,
    category: "physical",
    moodTags: ["tired", "sluggish", "stressed"],
    saved: false
  },
  {
    id: "4",
    title: "Guided Meditation: Peace",
    description: "10-minute meditation for inner peace and calm",
    duration: 10,
    category: "mindfulness",
    moodTags: ["anxious", "overwhelmed", "stressed"],
    saved: false
  },
  {
    id: "5",
    title: "Call a Friend",
    description: "Connect with someone you trust",
    duration: 15,
    category: "social",
    moodTags: ["lonely", "sad", "isolated"],
    saved: false
  },
  {
    id: "6",
    title: "Creative Drawing",
    description: "Express your feelings through art",
    duration: 20,
    category: "creative",
    moodTags: ["creative", "reflective", "calm"],
    saved: false
  },
  {
    id: "7",
    title: "Nature Walk",
    description: "Take a mindful walk in nature",
    duration: 30,
    category: "physical",
    moodTags: ["stressed", "anxious", "tired"],
    saved: false
  },
  {
    id: "8",
    title: "Progressive Muscle Relaxation",
    description: "Release tension from head to toe",
    duration: 15,
    category: "relaxation",
    moodTags: ["stressed", "tense", "anxious"],
    saved: false
  },
  {
    id: "9",
    title: "Listen to Calming Music",
    description: "Soothing playlist for relaxation",
    duration: 20,
    category: "relaxation",
    moodTags: ["anxious", "stressed", "tired"],
    saved: false
  },
  {
    id: "10",
    title: "Positive Affirmations",
    description: "Repeat empowering statements",
    duration: 5,
    category: "mindfulness",
    moodTags: ["low", "sad", "insecure"],
    saved: false
  }
];

// Mood definitions
const moods = [
  { id: "anxious", name: "Anxious", icon: Cloud, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  { id: "stressed", name: "Stressed", icon: Zap, color: "text-red-600", bgColor: "bg-red-100" },
  { id: "sad", name: "Sad", icon: Frown, color: "text-blue-600", bgColor: "bg-blue-100" },
  { id: "tired", name: "Tired", icon: Moon, color: "text-purple-600", bgColor: "bg-purple-100" },
  { id: "lonely", name: "Lonely", icon: Cloud, color: "text-indigo-600", bgColor: "bg-indigo-100" },
  { id: "calm", name: "Calm", icon: Sun, color: "text-orange-600", bgColor: "bg-orange-100" },
  { id: "happy", name: "Happy", icon: Smile, color: "text-green-600", bgColor: "bg-green-100" },
  { id: "overwhelmed", name: "Overwhelmed", icon: CloudRain, color: "text-gray-600", bgColor: "bg-gray-100" }
];

// Categories
const categories = [
  { id: "all", name: "All Activities" },
  { id: "mindfulness", name: "Mindfulness" },
  { id: "physical", name: "Physical" },
  { id: "creative", name: "Creative" },
  { id: "social", name: "Social" },
  { id: "relaxation", name: "Relaxation" }
];

// Durations for filter
const durations = [
  { id: "any", name: "Any Duration" },
  { id: "5", name: "5-10 min" },
  { id: "15", name: "15-20 min" },
  { id: "30", name: "30+ min" }
];

export default function ActivitiesPage() {
  const [selectedMood, setSelectedMood] = useState("");
  const [activities, setActivities] = useState(activitiesData);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("any");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeBreathing, setActiveBreathing] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState("inhale");
  const [breathingCount, setBreathingCount] = useState(4);

  // Derive filtered activities from current filters/state
  const filteredActivities = useMemo(() => {
    let filtered = [...activities];

    // Filter by mood if selected
    if (selectedMood) {
      filtered = filtered.filter(activity => 
        activity.moodTags.includes(selectedMood)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity => 
        activity.category === selectedCategory
      );
    }

    // Filter by duration
    if (selectedDuration !== "any") {
      filtered = filtered.filter(activity => {
        if (selectedDuration === "5") return activity.duration <= 10;
        if (selectedDuration === "15") return activity.duration > 10 && activity.duration <= 20;
        if (selectedDuration === "30") return activity.duration > 20;
        return true;
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(activity =>
        activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter saved only
    if (showSavedOnly) {
      filtered = filtered.filter(activity => activity.saved);
    }

    return filtered;
  }, [selectedMood, selectedCategory, selectedDuration, searchQuery, showSavedOnly, activities]);

  // Toggle save activity
  const toggleSave = (id) => {
    setActivities(prev =>
      prev.map(activity =>
        activity.id === id
          ? { ...activity, saved: !activity.saved }
          : activity
      )
    );
  };

  // Breathing exercise timer
  useEffect(() => {
    if (!activeBreathing) return;

    const timer = setInterval(() => {
      setBreathingCount(prev => {
        if (prev === 1) {
          if (breathingPhase === "inhale") {
            setBreathingPhase("hold");
            return 4;
          } else if (breathingPhase === "hold") {
            setBreathingPhase("exhale");
            return 6;
          } else {
            setBreathingPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBreathing, breathingPhase]);

  const startBreathing = () => {
    setActiveBreathing(true);
    setBreathingPhase("inhale");
    setBreathingCount(4);
  };

  const stopBreathing = () => {
    setActiveBreathing(false);
  };

  const getMoodSuggestion = () => {
    if (!selectedMood) return null;
    
    const moodActivities = activities.filter(a => a.moodTags.includes(selectedMood));
    const moodName = moods.find(m => m.id === selectedMood)?.name;
    
    return {
      mood: moodName,
      count: moodActivities.length,
      activities: moodActivities.slice(0, 3)
    };
  };

  const suggestion = getMoodSuggestion();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Wellness Activities</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowSavedOnly(!showSavedOnly)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showSavedOnly 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <BookmarkCheck className="w-5 h-5" />
                <span className="hidden sm:inline">Saved</span>
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900">How are you feeling?</h2>
                {showFilters && (
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                )}
              </div>

              {/* Mood selector */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  const isSelected = selectedMood === mood.id;
                  
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(isSelected ? "" : mood.id)}
                      className={`
                        flex items-center gap-2 p-2 rounded-lg transition-all
                        ${isSelected 
                          ? `${mood.bgColor} ${mood.color} ring-2 ring-offset-2 ring-${mood.color.split('-')[1]}-500` 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{mood.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Duration filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {durations.map(dur => (
                    <option key={dur.id} value={dur.id}>{dur.name}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
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
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Clear filters */}
              {(selectedMood || selectedCategory !== "all" || selectedDuration !== "any" || searchQuery || showSavedOnly) && (
                <button
                  onClick={() => {
                    setSelectedMood("");
                    setSelectedCategory("all");
                    setSelectedDuration("any");
                    setSearchQuery("");
                    setShowSavedOnly(false);
                  }}
                  className="mt-4 text-sm text-purple-600 hover:text-purple-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1">
            {/* "Feeling [mood]? Try these" section */}
            {suggestion && suggestion.count > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white mb-8"
              >
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Sparkles className="w-6 h-6" />
                  Feeling {suggestion.mood}? Try these:
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  {suggestion.activities.map(activity => (
                    <div key={activity.id} className="bg-white/10 backdrop-blur rounded-lg p-3">
                      <h3 className="font-medium mb-1">{activity.title}</h3>
                      <p className="text-sm text-white/80">{activity.duration} min</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick breathing exercise */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Wind className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Breathing Exercise</h3>
                    <p className="text-sm text-gray-500">Calm your mind in just 2 minutes</p>
                  </div>
                </div>
                {!activeBreathing ? (
                  <button
                    onClick={startBreathing}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stopBreathing}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Pause className="w-4 h-4" />
                    Stop
                  </button>
                )}
              </div>

              {/* Breathing animation */}
              {activeBreathing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-6 text-center"
                >
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <motion.div
                      animate={{
                        scale: breathingPhase === "inhale" ? 1.5 : breathingPhase === "exhale" ? 0.8 : 1.2,
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="absolute inset-0 bg-purple-200 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-purple-600">{breathingCount}</span>
                    </div>
                  </div>
                  <p className="text-lg font-medium text-gray-700 capitalize">
                    {breathingPhase}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Activities grid */}
            {filteredActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                          {activity.category}
                        </span>
                        <button
                          onClick={() => toggleSave(activity.id)}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                        >
                          {activity.saved ? (
                            <BookmarkCheck className="w-5 h-5 text-purple-600" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {activity.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {activity.moodTags.length} moods
                        </span>
                      </div>

                      {/* Mood tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {activity.moodTags.slice(0, 3).map(tag => {
                          const mood = moods.find(m => m.id === tag);
                          if (!mood) return null;
                          const Icon = mood.icon;
                          return (
                            <span
                              key={tag}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${mood.bgColor} ${mood.color}`}
                            >
                              <Icon className="w-3 h-3" />
                              {mood.name}
                            </span>
                          );
                        })}
                        {activity.moodTags.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{activity.moodTags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
