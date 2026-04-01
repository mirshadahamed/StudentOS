"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  Activity,
  PieChart,
  BarChart3,
  Brain,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  Zap,
  Smile,
  Frown,
  Meh,
  Angry,
  Heart,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Share2,
  AlertCircle,
  Award,
  Flame,
  Clock,
  CalendarDays,
  LineChart,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mood definitions with colors and icons (updated with soft tones)
const moodDefinitions = {
  happy: { 
    name: "Happy", 
    icon: Smile, 
    color: "text-[#4ADE80]", 
    bg: "bg-[#4ADE80]/10", 
    gradient: "from-[#4ADE80] to-[#22C55E]",
    emoji: "😊",
    value: 5
  },
  calm: { 
    name: "Calm", 
    icon: Sun, 
    color: "text-[#34D399]", 
    bg: "bg-[#34D399]/10", 
    gradient: "from-[#34D399] to-[#10B981]",
    emoji: "😌",
    value: 4
  },
  neutral: { 
    name: "Neutral", 
    icon: Meh, 
    color: "text-[#9CA3AF]", 
    bg: "bg-[#9CA3AF]/10", 
    gradient: "from-[#9CA3AF] to-[#6B7280]",
    emoji: "😐",
    value: 3
  },
  anxious: { 
    name: "Anxious", 
    icon: Cloud, 
    color: "text-[#38BDF8]", 
    bg: "bg-[#38BDF8]/10", 
    gradient: "from-[#38BDF8] to-[#0EA5E9]",
    emoji: "😰",
    value: 2
  },
  sad: { 
    name: "Sad", 
    icon: Frown, 
    color: "text-[#60A5FA]", 
    bg: "bg-[#60A5FA]/10", 
    gradient: "from-[#60A5FA] to-[#3B82F6]",
    emoji: "😢",
    value: 1
  },
  angry: { 
    name: "Angry", 
    icon: Angry, 
    color: "text-[#F87171]", 
    bg: "bg-[#F87171]/10", 
    gradient: "from-[#F87171] to-[#EF4444]",
    emoji: "😠",
    value: 1
  },
  energetic: { 
    name: "Energetic", 
    icon: Zap, 
    color: "text-[#F97316]", 
    bg: "bg-[#F97316]/10", 
    gradient: "from-[#F97316] to-[#EA580C]",
    emoji: "⚡",
    value: 5
  },
  tired: { 
    name: "Tired", 
    icon: Moon, 
    color: "text-[#A78BFA]", 
    bg: "bg-[#A78BFA]/10", 
    gradient: "from-[#A78BFA] to-[#8B5CF6]",
    emoji: "😴",
    value: 2
  }
};

// Calculate stats
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
      const prevDate = new Date(sorted[i-1].date);
      const currDate = new Date(sorted[i].date);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  // Calculate consistency (percentage of days with entries)
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

// Generate insights
const generateInsights = (data) => {
  const insights = [];
  
  // Check weekend pattern
  const weekendMoods = data.filter(entry => {
    const day = new Date(entry.date).getDay();
    return day === 0 || day === 6;
  });
  
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
  
  // Check most common factor correlations
  const factorMoods = {};
  data.forEach(entry => {
    entry.factors.forEach(factor => {
      if (!factorMoods[factor]) factorMoods[factor] = [];
      factorMoods[factor].push(entry.intensity);
    });
  });
  
  let bestFactor = "";
  let bestAvg = 0;
  
  Object.entries(factorMoods).forEach(([factor, intensities]) => {
    const avg = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    if (avg > bestAvg && intensities.length > 5) {
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

// Months for filter
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function MoodHistoryPage() {
  const router = useRouter();
  const [moodData, setMoodData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("calendar");
  const [selectedMood, setSelectedMood] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const stats = useMemo(() => calculateStats(moodData), [moodData]);
  const insights = useMemo(() => generateInsights(moodData), [moodData]);

  useEffect(() => {
    const loadMoodData = async () => {
      try {
        const userId = localStorage.getItem("student_user_id");
        
        if (!userId) {
          console.warn("No user ID found in localStorage");
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
    
    // Filter by month/year
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

  // Get mood for a specific date
  const getMoodForDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moodData.find(entry => entry.date === dateStr);
  };

  // Navigate months
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

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <div className="bg-[#111827] shadow-sm border-b border-[#374151] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 sm:items-center">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-[#1F2937] rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#E5E7EB]" />
              </button>
              <h1 className="text-xl font-bold text-[#E5E7EB] sm:text-2xl">Mood History & Analytics</h1>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-[#1F2937] text-[#E5E7EB] rounded-lg hover:bg-[#374151] transition-colors lg:hidden"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mt-4 flex gap-2 overflow-x-auto border-b border-[#374151] pb-1">
            {[
              { id: "calendar", label: "Calendar", icon: CalendarDays },
              { id: "timeline", label: "Timeline", icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewType(tab.id)}
                  className={`flex shrink-0 items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    viewType === tab.id
                      ? "border-[#22C55E] text-[#22C55E]"
                      : "border-transparent text-[#9CA3AF] hover:text-[#E5E7EB]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wellness Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1F2937] rounded-xl shadow-sm p-6 border border-[#374151] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#9CA3AF]">Wellness Score</h3>
              <Brain className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-[#E5E7EB]">
                {(stats.average * 20).toFixed(0)}
              </span>
              <span className="text-sm text-[#6B7280] mb-1">/100</span>
            </div>
            <div className="mt-2 w-full bg-[#374151] rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#22C55E] to-[#4ADE80] rounded-full h-2"
                style={{ width: `${stats.average * 20}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#1F2937] rounded-xl shadow-sm p-6 border border-[#374151] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#9CA3AF]">Current Streak</h3>
              <Flame className="w-5 h-5 text-[#F97316]" />
            </div>
            <div className="text-3xl font-bold text-[#E5E7EB]">{stats.streak} days</div>
            <p className="text-sm text-[#6B7280] mt-2">Keep it up! 🔥</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1F2937] rounded-xl shadow-sm p-6 border border-[#374151] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#9CA3AF]">Total Entries</h3>
              <Activity className="w-5 h-5 text-[#4ADE80]" />
            </div>
            <div className="text-3xl font-bold text-[#E5E7EB]">{stats.total}</div>
            <p className="text-sm text-[#6B7280] mt-2">Consistency: {stats.consistency.toFixed(0)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1F2937] rounded-xl shadow-sm p-6 border border-[#374151] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[#9CA3AF]">Dominant Mood</h3>
              {stats.dominant && moodDefinitions[stats.dominant]?.icon && (
                <div className={`p-2 rounded-lg ${moodDefinitions[stats.dominant].bg}`}>
                  {(() => {
                    const Icon = moodDefinitions[stats.dominant].icon;
                    return <Icon className={`w-4 h-4 ${moodDefinitions[stats.dominant].color}`} />;
                  })()}
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-[#E5E7EB] capitalize">{stats.dominant}</div>
            <p className="text-sm text-[#6B7280] mt-2">Most frequent mood</p>
          </motion.div>
        </div>

        {/* Insights Section */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-[#E5E7EB] mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#22C55E]" />
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
                    className="bg-[#1F2937] rounded-xl p-4 border border-[#374151] hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-[#111827]`}>
                        <Icon className={`w-5 h-5 ${insight.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#E5E7EB] mb-1">{insight.title}</h3>
                        <p className="text-sm text-[#9CA3AF]">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Filters (desktop) */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[#1F2937] rounded-xl shadow-sm p-5 sm:p-6 border border-[#374151] lg:sticky lg:top-32">
              <h2 className="font-semibold text-[#E5E7EB] mb-4">Filters</h2>
              
              {/* Month/Year Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Time Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="p-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-[#E5E7EB] focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="p-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-[#E5E7EB] focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                  >
                    {[2026, 2025, 2024].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mood Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#9CA3AF] mb-2">
                  Mood
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full p-2 bg-[#111827] border border-[#374151] rounded-lg text-sm text-[#E5E7EB] focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
                >
                  <option value="all">All Moods</option>
                  {Object.entries(moodDefinitions).map(([key, def]) => (
                    <option key={key} value={key}>{def.name}</option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-[#374151] pt-4">
                <h3 className="font-medium text-[#E5E7EB] mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  {moodDistribution.slice(0, 4).map((item) => (
                    <div key={item.mood} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-[#9CA3AF]">{item.name}</span>
                      </div>
                      <span className="font-medium text-[#E5E7EB]">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Main Content */}
          <div className="flex-1">
            {/* Calendar View */}
            {viewType === "calendar" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#1F2937] rounded-xl shadow-sm p-4 sm:p-6 border border-[#374151]"
              >
                {/* Calendar Header */}
                <div className="mb-6 flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold text-[#E5E7EB] sm:text-lg">
                    {months[selectedMonth]} {selectedYear}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-[#374151] rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#9CA3AF]" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-[#374151] rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF]" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <div key={day} className="py-2 text-center text-[10px] font-medium text-[#6B7280] sm:text-sm">
                      <span className="sm:hidden">{day.charAt(0)}</span>
                      <span className="hidden sm:inline">{day}</span>
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
                          flex aspect-square flex-col items-center justify-center rounded-lg p-1 sm:p-2
                          ${day ? 'cursor-pointer hover:ring-2 hover:ring-[#22C55E]' : ''}
                          ${moodDef ? moodDef.bg : 'bg-[#111827]'}
                        `}
                      >
                        {day && (
                          <>
                            <span className="text-xs font-medium text-[#E5E7EB] sm:text-sm">{day}</span>
                            {moodDef && (
                              <div className="mt-1">
                                <moodDef.icon className={`h-3 w-3 sm:h-4 sm:w-4 ${moodDef.color}`} />
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[#374151]">
                  {Object.entries(moodDefinitions).map(([key, def]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${def.color.replace('text', 'bg')}`} />
                      <span className="text-xs text-[#9CA3AF]">{def.name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Timeline View */}
            {viewType === "timeline" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#1F2937] rounded-xl shadow-sm p-4 sm:p-6 border border-[#374151]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-[#E5E7EB]">Mood Timeline</h2>
                  <p className="text-sm text-[#6B7280]">{filteredData.length} entries</p>
                </div>

                {/* Timeline entries */}
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredData.sort((a, b) => b.timestamp - a.timestamp).map((entry) => {
                    const mood = moodDefinitions[entry.mood];
                    if (!mood) return null;
                    
                    const Icon = mood.icon;
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-3 rounded-lg bg-[#111827] p-3 transition-colors hover:bg-[#1F2937] sm:flex-row sm:items-center sm:gap-4 border border-[#374151]"
                      >
                        <div className={`p-2 rounded-lg ${mood.bg}`}>
                          <Icon className={`w-5 h-5 ${mood.color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`font-medium ${mood.color}`}>{mood.name}</span>
                            <span className="text-xs text-[#6B7280]">
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i <= entry.intensity ? mood.color.replace('text', 'bg') : 'bg-[#374151]'
                                  }`}
                                />
                              ))}
                            </div>
                            {entry.factors && entry.factors.length > 0 && (
                              <span className="text-xs text-[#6B7280]">
                                {entry.factors.join(' • ')}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div className="max-w-full text-xs text-[#6B7280] sm:max-w-xs sm:truncate">
                            &quot;{entry.notes}&quot;
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                  
                  {filteredData.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-[#6B7280]">No mood entries for this period</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}