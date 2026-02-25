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
  LogOut
} from "lucide-react";
import Link from "next/link";

// Types
interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: Date;
  note?: string;
  source: "emoji" | "voice" | "camera" | "text";
}

interface SentimentAnalysis {
  score: number;
  label: "positive" | "neutral" | "negative";
  confidence: number;
}

// Mood definitions
const moodEmojis = [
  { id: "happy", emoji: "😊", label: "Happy", color: "text-yellow-500", bg: "bg-yellow-100", value: 5 },
  { id: "excited", emoji: "🎉", label: "Excited", color: "text-orange-500", bg: "bg-orange-100", value: 5 },
  { id: "calm", emoji: "😌", label: "Calm", color: "text-green-500", bg: "bg-green-100", value: 4 },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "text-gray-500", bg: "bg-gray-100", value: 3 },
  { id: "tired", emoji: "😴", label: "Tired", color: "text-purple-500", bg: "bg-purple-100", value: 2 },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "text-indigo-500", bg: "bg-indigo-100", value: 2 },
  { id: "sad", emoji: "😢", label: "Sad", color: "text-blue-500", bg: "bg-blue-100", value: 1 },
  { id: "angry", emoji: "😠", label: "Angry", color: "text-red-500", bg: "bg-red-100", value: 1 }
];

// Quick mood options (text based)
const quickMoods = [
  { id: "great", text: "Feeling Great!", icon: Sun, color: "text-yellow-500" },
  { id: "good", text: "Pretty Good", icon: ThumbsUp, color: "text-green-500" },
  { id: "okay", text: "Just Okay", icon: Meh, color: "text-gray-500" },
  { id: "bad", text: "Not Great", icon: Frown, color: "text-blue-500" },
  { id: "awful", text: "Awful", icon: Angry, color: "text-red-500" }
];

export default function Dashboard() {
  // State for mood logging
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  
  // State for other features
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSentiment, setShowSentiment] = useState(true);
  const [activeLogMethod, setActiveLogMethod] = useState<"emoji" | "voice" | "camera" | "text" | null>(null);
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Simulate sentiment analysis
  const analyzeSentiment = (text: string) => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Simple keyword-based sentiment (demo only)
      const positiveWords = ["good", "great", "happy", "excellent", "amazing", "love", "wonderful", "best", "awesome"];
      const negativeWords = ["bad", "awful", "terrible", "hate", "sad", "angry", "stressed", "worst", "horrible"];
      
      const words = text.toLowerCase().split(" ");
      let score = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 0.2;
        if (negativeWords.includes(word)) score -= 0.2;
      });
      
      score = Math.max(-1, Math.min(1, score));
      
      let label: "positive" | "neutral" | "negative" = "neutral";
      if (score > 0.3) label = "positive";
      if (score < -0.3) label = "negative";
      
      setSentiment({
        score,
        label,
        confidence: 0.85 + Math.random() * 0.1
      });
      
      setIsAnalyzing(false);
    }, 1500);
  };

  // Voice recording simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setAudioLevel(Math.random() * 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        // Simulate voice analysis
        setTimeout(() => {
          setSentiment({
            score: 0.6,
            label: "positive",
            confidence: 0.78
          });
        }, 2000);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
      setCapturedImage(null);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        
        // Simulate facial expression analysis
        setTimeout(() => {
          setSentiment({
            score: 0.7,
            label: "positive",
            confidence: 0.82
          });
        }, 2000);
      }
    }
  };

  // Save mood entry
  const saveMoodEntry = () => {
    if (!selectedMood && !moodNote) return;
    
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      mood: selectedMood || "neutral",
      intensity: moodIntensity,
      timestamp: new Date(),
      note: moodNote || (sentiment ? `Sentiment: ${sentiment.label} (${(sentiment.score * 100).toFixed(0)}%)` : undefined),
      source: "emoji"
    };
    
    setRecentEntries(prev => [newEntry, ...prev].slice(0, 10));
    
    // Reset form
    setSelectedMood(null);
    setMoodNote("");
    setSentiment(null);
    setMoodIntensity(3);
  };

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get mood emoji
  const getMoodEmoji = (moodId: string) => {
    return moodEmojis.find(m => m.id === moodId)?.emoji || "😐";
  };

  // Get sentiment color
  const getSentimentColor = (label: string) => {
    switch (label) {
      case "positive": return "text-green-600 bg-green-100";
      case "negative": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
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
              <Link href="/mood-history" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
            </h1>
            <p className="text-gray-600">How are you feeling right now?</p>
          </div>
          
          {/* Quick Stats */}
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Today&apos;s Entries</div>
              <div className="text-2xl font-bold text-gray-900">{recentEntries.length}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Avg. Mood</div>
              <div className="text-2xl font-bold text-green-600">
                {recentEntries.length > 0 
                  ? (recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length).toFixed(1)
                  : '0.0'}/5
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Logging */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Mood Check-in Box - Updated with emoji above and text input below */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Check-in</h2>
              
              {/* Emoji Grid - Always visible at the top */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select your mood
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {moodEmojis.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={`
                        flex flex-col items-center p-3 rounded-xl transition-all
                        ${selectedMood === mood.id 
                          ? `${mood.bg} ring-2 ring-offset-2 ring-${mood.color.split('-')[1]}-500 scale-105` 
                          : 'bg-gray-50 hover:bg-gray-100'
                        }
                      `}
                    >
                      <span className="text-2xl mb-1">{mood.emoji}</span>
                      <span className={`text-xs ${mood.color}`}>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider - Shows when mood is selected */}
              {selectedMood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intensity: {moodIntensity}/5
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={moodIntensity}
                    onChange={(e) => setMoodIntensity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Mild</span>
                    <span>Moderate</span>
                    <span>Intense</span>
                  </div>
                </motion.div>
              )}

              {/* Text Input - Always visible below */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? (optional)
                </label>
                <div className="relative">
                  <textarea
                    value={moodNote}
                    onChange={(e) => {
                      setMoodNote(e.target.value);
                      if (e.target.value.length > 10) {
                        analyzeSentiment(e.target.value);
                      }
                    }}
                    placeholder="Write a few sentences about your mood..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  
                  {/* Sentiment Analysis Indicator */}
                  {isAnalyzing && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing...
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Mood Suggestions - Small chips for quick text input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick suggestions
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickMoods.map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setMoodNote(mood.text)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-full text-sm transition-colors"
                      >
                        <Icon className={`w-3 h-3 ${mood.color}`} />
                        {mood.text}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Sentiment Display */}
              <AnimatePresence>
                {sentiment && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <span className="font-semibold">Real-time Sentiment</span>
                      </div>
                      <button
                        onClick={() => setShowSentiment(!showSentiment)}
                        className="p-1 hover:bg-white/20 rounded"
                      >
                        {showSentiment ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {showSentiment && (
                      <>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                            getSentimentColor(sentiment.label)
                          }`}>
                            {sentiment.label}
                          </div>
                          <div className="flex-1">
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className="bg-white rounded-full h-2"
                                style={{ width: `${(sentiment.score + 1) * 50}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm">
                            {(sentiment.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <p className="text-sm text-white/80">
                          Confidence: {(sentiment.confidence * 100).toFixed(0)}%
                        </p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Save Button */}
              {(selectedMood || moodNote) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <button
                    onClick={saveMoodEntry}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Log Mood Entry
                  </button>
                </motion.div>
              )}
            </div>

            {/* Today's Mood Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Today&apos;s Mood Summary
              </h2>

              {/* Timeline */}
              <div className="space-y-4">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry, index) => {
                    const mood = moodEmojis.find(m => m.id === entry.mood);
                    return (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full ${mood?.bg || 'bg-gray-200'} flex items-center justify-center text-xl`}>
                          {mood?.emoji || '😐'}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{mood?.label || 'Unknown'}</span>
                            <span className="text-xs text-gray-500">{formatTime(entry.timestamp)}</span>
                          </div>
                          
                          {entry.note && (
                            <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                          )}
                          
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[1,2,3,4,5].map(i => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    i <= entry.intensity ? mood?.color.replace('text', 'bg') || 'bg-gray-400' : 'bg-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No entries yet today. Select a mood and write a note above!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Quick Actions (unchanged) */}
          <div className="space-y-6">
            {/* Wellness Score Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Today&apos;s Wellness Score</h3>
              <div className="text-5xl font-bold mb-2">
                {recentEntries.length > 0 
                  ? Math.round(recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length * 20)
                  : 0}
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                <TrendingUp className="w-4 h-4" />
                <span>Based on your {recentEntries.length} entries today</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mood</span>
                    <span>
                      {recentEntries.length > 0 
                        ? (recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length).toFixed(1)
                        : 0}/5
                    </span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2" 
                      style={{ 
                        width: `${recentEntries.length > 0 
                          ? (recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length) * 20
                          : 0}%` 
                      }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{recentEntries.length}</div>
                  <div className="text-xs text-gray-600">Today's Entries</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    {recentEntries.length > 0 
                      ? Math.max(...recentEntries.map(e => e.intensity))
                      : 0}
                  </div>
                  <div className="text-xs text-gray-600">Peak Mood</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">
                    {selectedMood ? moodEmojis.find(m => m.id === selectedMood)?.emoji : '😐'}
                  </div>
                  <div className="text-xs text-gray-600">Current</div>
                </div>
              </div>
            </div>

            {/* Mood Patterns */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Today's Pattern
              </h3>
              
              <div className="space-y-3">
                {recentEntries.slice(0, 5).map((entry, index) => {
                  const mood = moodEmojis.find(m => m.id === entry.mood);
                  return (
                    <div key={entry.id} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{formatTime(entry.timestamp)}</span>
                      <span className="text-sm">{mood?.emoji} {mood?.label}</span>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => (
                          <div key={i} className={`w-2 h-2 rounded-full ${i <= entry.intensity ? 'bg-purple-500' : 'bg-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
                {recentEntries.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No entries yet today. Log your first mood above!
                  </p>
                )}
              </div>
            </div>

            {/* Recommended Activity */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recommended for You
              </h3>
              <p className="text-white/90 text-sm mb-4">
                {selectedMood 
                  ? `Based on your ${moodEmojis.find(m => m.id === selectedMood)?.label} mood, try a calming activity`
                  : 'Select a mood above to get personalized recommendations'}
              </p>
              <button 
                className="w-full py-2 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedMood}
              >
                {selectedMood ? 'Get Recommendation' : 'Select a mood first'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}