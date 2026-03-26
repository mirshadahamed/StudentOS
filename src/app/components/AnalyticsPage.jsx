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
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Mood definitions with colors and icons
const moodDefinitions = {
  happy: { 
    name: "Happy", 
    icon: Smile, 
    color: "text-yellow-500", 
    bg: "bg-yellow-100", 
    gradient: "from-yellow-400 to-orange-400",
    emoji: "😊",
    value: 5
  },
  calm: { 
    name: "Calm", 
    icon: Sun, 
    color: "text-green-500", 
    bg: "bg-green-100", 
    gradient: "from-green-400 to-teal-400",
    emoji: "😌",
    value: 4
  },
  neutral: { 
    name: "Neutral", 
    icon: Meh, 
    color: "text-gray-500", 
    bg: "bg-gray-100", 
    gradient: "from-gray-400 to-gray-500",
    emoji: "😐",
    value: 3
  },
  anxious: { 
    name: "Anxious", 
    icon: Cloud, 
    color: "text-purple-500", 
    bg: "bg-purple-100", 
    gradient: "from-purple-400 to-pink-400",
    emoji: "😰",
    value: 2
  },
  sad: { 
    name: "Sad", 
    icon: Frown, 
    color: "text-blue-500", 
    bg: "bg-blue-100", 
    gradient: "from-blue-400 to-indigo-400",
    emoji: "😢",
    value: 1
  },
  angry: { 
    name: "Angry", 
    icon: Angry, 
    color: "text-red-500", 
    bg: "bg-red-100", 
    gradient: "from-red-400 to-orange-400",
    emoji: "😠",
    value: 1
  },
  energetic: { 
    name: "Energetic", 
    icon: Zap, 
    color: "text-orange-500", 
    bg: "bg-orange-100", 
    gradient: "from-orange-400 to-red-400",
    emoji: "⚡",
    value: 5
  },
  tired: { 
    name: "Tired", 
    icon: Moon, 
    color: "text-indigo-500", 
    bg: "bg-indigo-100", 
    gradient: "from-indigo-400 to-purple-400",
    emoji: "😴",
    value: 2
  }
};

// Sample mood data (last 60 days)
const generateSampleData = () => {
  const moods = Object.keys(moodDefinitions);
  const factors = ["Sleep", "Exercise", "Work", "Social", "Weather", "Food", "Stress", "Meditation"];
  const data = [];
  
  const now = new Date();
  for (let i = 60; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate somewhat realistic patterns
    const dayOfWeek = date.getDay();
    let moodIndex;
    
    // Better moods on weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      moodIndex = Math.floor(Math.random() * 3) + 4; // happier moods
    } else {
      moodIndex = Math.floor(Math.random() * 5); // mixed
    }
    
    const mood = moods[moodIndex % moods.length];
    const intensity = Math.floor(Math.random() * 5) + 1;
    
    // Random factors
    const numFactors = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...factors].sort(() => 0.5 - Math.random());
    
    data.push({
      id: `entry-${i}`,
      date: date.toISOString().split('T')[0],
      mood,
      intensity,
      factors: shuffled.slice(0, numFactors),
      notes: Math.random() > 0.7 ? "Sample note for this day" : undefined,
      timestamp: date.getTime()
    });
  }
  
  return data;
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
      color: "text-yellow-500"
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
      color: "text-green-500"
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
      color: "text-orange-500"
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
      color: "text-pink-500"
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

  const [moodData, setMoodData] = useState([]);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [viewType, setViewType] = useState("calendar");
  const [selectedMood, setSelectedMood] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [chartType, setChartType] = useState("line");

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

  // Prepare chart data
  const prepareChartData = () => {
    const sorted = [...filteredData].sort((a, b) => a.timestamp - b.timestamp);
    
    return {
      labels: sorted.map(entry => {
        const date = new Date(entry.date);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      }),
      values: sorted.map(entry => entry.intensity),
      moods: sorted.map(entry => entry.mood)
    };
  };

  const chartData = prepareChartData();

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

  // Weekly average
  const getWeeklyAverage = () => {
    const weeklyData = {
      "Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []
    };
    
    moodData.forEach(entry => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      weeklyData[day].push(entry.intensity);
    });
    
    return Object.entries(weeklyData).map(([day, values]) => ({
      day,
      average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0
    }));
  };

  const weeklyAverages = getWeeklyAverage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Mood History & Analytics</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors lg:hidden"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <div className="hidden lg:flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex gap-4 mt-4 border-b border-gray-200">
            {[
              { id: "calendar", label: "Calendar", icon: CalendarDays },
              { id: "timeline", label: "Timeline", icon: BarChart3 },
              { id: "analytics", label: "Analytics", icon: LineChart }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setViewType(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    viewType === tab.id
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
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
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Wellness Score</h3>
              <Brain className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {(stats.average * 20).toFixed(0)}
              </span>
              <span className="text-sm text-gray-500 mb-1">/100</span>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-2"
                style={{ width: `${stats.average * 20}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Current Streak</h3>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.streak} days</div>
            <p className="text-sm text-gray-500 mt-2">Keep it up! 🔥</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Entries</h3>
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <p className="text-sm text-gray-500 mt-2">Consistency: {stats.consistency.toFixed(0)}%</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Dominant Mood</h3>
              {stats.dominant && moodDefinitions[stats.dominant]?.icon && (
                <div className={`p-2 rounded-lg ${moodDefinitions[stats.dominant].bg}`}>
                  {(() => {
                    const Icon = moodDefinitions[stats.dominant].icon;
                    return <Icon className={`w-4 h-4 ${moodDefinitions[stats.dominant].color}`} />;
                  })()}
                </div>
              )}
            </div>
            <div className="text-3xl font-bold text-gray-900 capitalize">{stats.dominant}</div>
            <p className="text-sm text-gray-500 mt-2">Most frequent mood</p>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Filters (desktop) */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-32">
              <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>
              
              {/* Month/Year Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Period
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={index}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {[2026, 2025, 2024].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mood Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mood
                </label>
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Moods</option>
                  {Object.entries(moodDefinitions).map(([key, def]) => (
                    <option key={key} value={key}>{def.name}</option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Quick Stats</h3>
                <div className="space-y-2">
                  {moodDistribution.slice(0, 4).map((item) => (
                    <div key={item.mood} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <item.icon className={`w-4 h-4 ${item.color}`} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{item.count}</span>
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
                className="bg-white rounded-xl shadow-sm p-6"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {months[selectedMonth]} {selectedYear}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
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
                          aspect-square rounded-lg p-2 flex flex-col items-center justify-center
                          ${day ? 'cursor-pointer hover:ring-2 hover:ring-purple-300' : ''}
                          ${moodDef ? moodDef.bg : 'bg-gray-50'}
                        `}
                      >
                        {day && (
                          <>
                            <span className="text-sm font-medium text-gray-700">{day}</span>
                            {moodDef && (
                              <div className="mt-1">
                                <moodDef.icon className={`w-4 h-4 ${moodDef.color}`} />
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-gray-200">
                  {Object.entries(moodDefinitions).map(([key, def]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${def.bg.replace('100', '500')}`} />
                      <span className="text-xs text-gray-600">{def.name}</span>
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
                className="bg-white rounded-xl shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Mood Timeline</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setChartType("line")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "line" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
                      }`}
                    >
                      <LineChart className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setChartType("bar")}
                      className={`p-2 rounded-lg transition-colors ${
                        chartType === "bar" ? "bg-purple-100 text-purple-600" : "hover:bg-gray-100"
                      }`}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-64 relative mb-8">
                  {chartType === "line" ? (
                    <div className="absolute inset-0 flex items-end">
                      {chartData.values.map((value, index) => {
                        const height = (value / 5) * 100;
                        const mood = chartData.moods[index];
                        const color = moodDefinitions[mood]?.color.replace('text-', 'bg-').replace('500', '400');
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: index * 0.02 }}
                            className="flex-1 mx-0.5 rounded-t relative group"
                          >
                            <div 
                              className={`absolute bottom-0 w-full ${color} hover:opacity-80 transition-opacity rounded-t`}
                              style={{ height: `${height}%` }}
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                                {moodDefinitions[mood]?.name}: {value}/5
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {moodDistribution.filter(m => m.count > 0).map((item, index) => (
                        <motion.div
                          key={item.mood}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-24 text-sm text-gray-600">{item.name}</div>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${item.gradient}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-gray-600">{item.count}</div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Timeline entries */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredData.sort((a, b) => b.timestamp - a.timestamp).map((entry) => {
                    const mood = moodDefinitions[entry.mood];
                    const Icon = mood.icon;
                    
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${mood.bg}`}>
                          <Icon className={`w-5 h-5 ${mood.color}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{mood.name}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i <= entry.intensity ? mood.color.replace('text', 'bg') : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {entry.factors.join(' • ')}
                            </span>
                          </div>
                        </div>
                        
                        {entry.notes && (
                          <div className="text-xs text-gray-400 max-w-xs truncate">
                            &quot;{entry.notes}&quot;
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Analytics View */}
            {viewType === "analytics" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Weekly Pattern */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Pattern</h2>
                  <div className="h-48">
                    <div className="flex h-full items-end gap-2">
                      {weeklyAverages.map(({ day, average }) => {
                        const height = (average / 5) * 100;
                        return (
                          <div key={day} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex justify-center">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t"
                                style={{ height: `${height}%`, minHeight: 4 }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 rotate-45 origin-left">
                              {day.slice(0, 3)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Insights Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Insights & Patterns
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.map((insight, index) => {
                      const Icon = insight.icon;
                      return (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border-l-4 ${
                            insight.type === 'pattern' ? 'border-l-blue-500 bg-blue-50' :
                            insight.type === 'correlation' ? 'border-l-green-500 bg-green-50' :
                            insight.type === 'achievement' ? 'border-l-orange-500 bg-orange-50' :
                            'border-l-purple-500 bg-purple-50'
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`p-2 rounded-lg ${
                              insight.type === 'pattern' ? 'bg-blue-100' :
                              insight.type === 'correlation' ? 'bg-green-100' :
                              insight.type === 'achievement' ? 'bg-orange-100' :
                              'bg-purple-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${insight.color}`} />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
                              <p className="text-sm text-gray-600">{insight.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Mood Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Mood Distribution</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moodDistribution.filter(m => m.count > 0).map((item) => (
                      <div key={item.mood} className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className={`inline-block p-2 rounded-lg ${item.bg} mb-2`}>
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                        </div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.percentage.toFixed(1)}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Factor Analysis */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Factor Analysis</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Sleep", "Exercise", "Social", "Work", "Weather", "Stress"].map(factor => {
                      const factorEntries = moodData.filter(e => e.factors.includes(factor));
                      const avgMood = factorEntries.length 
                        ? factorEntries.reduce((s, e) => s + e.intensity, 0) / factorEntries.length
                        : 0;
                      const percentage = (avgMood / 5) * 100;
                      
                      return (
                        <div key={factor} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">{factor}</span>
                            <span className="text-sm text-gray-500">{factorEntries.length} entries</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full h-2"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">Avg mood:</span>
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i <= avgMood ? 'bg-purple-500' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
