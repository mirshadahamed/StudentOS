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

// Sample today's entries
const todaysEntries = [
  {
    id: "1",
    mood: "happy",
    intensity: 4,
    timestamp: new Date(new Date().setHours(9, 0)),
    note: "Woke up feeling refreshed!",
    source: "emoji"
  },
  {
    id: "2",
    mood: "anxious",
    intensity: 3,
    timestamp: new Date(new Date().setHours(14, 30)),
    note: "Before the big meeting",
    source: "text"
  },
  {
    id: "3",
    mood: "calm",
    intensity: 5,
    timestamp: new Date(new Date().setHours(17, 0)),
    note: "After evening meditation",
    source: "voice"
  }
];

export default function Dashboard() {
  // State for different logging methods
  const [activeLogMethod, setActiveLogMethod] = useState(null);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [moodNote, setMoodNote] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recentEntries, setRecentEntries] = useState(todaysEntries);
  const [showSentiment, setShowSentiment] = useState(true);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Simulate sentiment analysis
  const analyzeSentiment = (text) => {
    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      // Simple keyword-based sentiment (demo only)
      const positiveWords = ["good", "great", "happy", "excellent", "amazing", "love", "wonderful"];
      const negativeWords = ["bad", "awful", "terrible", "hate", "sad", "angry", "stressed"];
      
      const words = text.toLowerCase().split(" ");
      let score = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) score += 0.2;
        if (negativeWords.includes(word)) score -= 0.2;
      });
      
      score = Math.max(-1, Math.min(1, score));
      
      let label = "neutral";
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
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
        setAudioLevel(Math.random() * 100); // Simulate audio levels
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
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
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
      const stream = videoRef.current.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach(track => track.stop());
      }
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
    if (!selectedMood && activeLogMethod !== "text") return;
    
    const newEntry = {
      id: Date.now().toString(),
      mood: selectedMood || "neutral",
      intensity: moodIntensity,
      timestamp: new Date(),
      note: moodNote || (sentiment ? `Sentiment: ${sentiment.label} (${(sentiment.score * 100).toFixed(0)}%)` : undefined),
      source: activeLogMethod || "emoji"
    };
    
    setRecentEntries(prev => [newEntry, ...prev].slice(0, 10));
    
    // Reset form
    setSelectedMood(null);
    setMoodNote("");
    setSentiment(null);
    setActiveLogMethod(null);
    stopCamera();
  };

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Get mood emoji
  const getMoodEmoji = (moodId) => {
    return moodEmojis.find(m => m.id === moodId)?.emoji || "😐";
  };

  // Get sentiment color
  const getSentimentColor = (label) => {
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
              <div className="text-2xl font-bold text-green-600">7.2/10</div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mood Logging */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Mood Check-in Options */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Check-in</h2>
              
              {/* Logging Method Selector */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { id: "emoji", icon: SmilePlus, label: "Emoji" },
                  { id: "text", icon: Send, label: "Text" },
                  { id: "voice", icon: Mic, label: "Voice" },
                  { id: "camera", icon: Camera, label: "Camera" }
                ].map((method) => {
                  const Icon = method.icon;
                  const isActive = activeLogMethod === method.id;
                  
                  return (
                    <button
                      key={method.id}
                      onClick={() => setActiveLogMethod(method.id)}
                      className={`
                        flex flex-col items-center gap-2 p-3 rounded-xl transition-all
                        ${isActive 
                          ? 'bg-purple-600 text-white shadow-lg scale-105' 
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">{method.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Logging Interface */}
              <AnimatePresence mode="wait">
                {activeLogMethod === "emoji" && (
                  <motion.div
                    key="emoji"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-4 gap-3">
                      {moodEmojis.map((mood) => (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`
                            flex flex-col items-center p-3 rounded-xl transition-all
                            ${selectedMood === mood.id 
                              ? `${mood.bg} ring-2 ring-offset-2 ring-${mood.color.split('-')[1]}-500` 
                              : 'bg-gray-50 hover:bg-gray-100'
                            }
                          `}
                        >
                          <span className="text-2xl mb-1">{mood.emoji}</span>
                          <span className={`text-xs ${mood.color}`}>{mood.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Intensity Slider */}
                    {selectedMood && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-2"
                      >
                        <label className="text-sm text-gray-600">Intensity</label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={moodIntensity}
                          onChange={(e) => setMoodIntensity(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mild</span>
                          <span>Moderate</span>
                          <span>Intense</span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {activeLogMethod === "text" && (
                  <motion.div
                    key="text"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    {/* Quick text moods */}
                    <div className="flex flex-wrap gap-2">
                      {quickMoods.map((mood) => {
                        const Icon = mood.icon;
                        return (
                          <button
                            key={mood.id}
                            onClick={() => setMoodNote(mood.text)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm transition-colors"
                          >
                            <Icon className={`w-4 h-4 ${mood.color}`} />
                            {mood.text}
                          </button>
                        );
                      })}
                    </div>

                    {/* Text input */}
                    <div className="relative">
                      <textarea
                        value={moodNote}
                        onChange={(e) => {
                          setMoodNote(e.target.value);
                          if (e.target.value.length > 10) {
                            analyzeSentiment(e.target.value);
                          }
                        }}
                        placeholder="How are you feeling? Write a few sentences..."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                      
                      {/* Sentiment Analysis */}
                      {isAnalyzing && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeLogMethod === "voice" && (
                  <motion.div
                    key="voice"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                      {/* Recording Animation */}
                      <div className="relative mb-4">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          isRecording ? 'bg-red-500 animate-pulse' : 'bg-purple-600'
                        }`}>
                          <Mic className={`w-8 h-8 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                        </div>
                        {isRecording && (
                          <>
                            <div className="absolute inset-0 rounded-full border-4 border-red-500 animate-ping" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                              ●
                            </div>
                          </>
                        )}
                      </div>

                      {/* Audio Level Visualization */}
                      {isRecording && (
                        <div className="w-full max-w-xs mb-4">
                          <div className="flex items-center gap-1 h-8">
                            {[...Array(20)].map((_, i) => (
                              <div
                                key={i}
                                className="flex-1 bg-purple-500 rounded-full"
                                style={{
                                  height: `${Math.max(4, (audioLevel / 100) * 40 * Math.sin(i * 0.5 + recordingTime * 0.8))}px`
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timer */}
                      <div className="text-2xl font-mono mb-4">
                        {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                      </div>

                      {/* Controls */}
                      {!isRecording ? (
                        <button
                          onClick={startRecording}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-shadow"
                        >
                          Start Recording
                        </button>
                      ) : (
                        <button
                          onClick={stopRecording}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                        >
                          Stop Recording
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeLogMethod === "camera" && (
                  <motion.div
                    key="camera"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                      {!isCameraActive && !capturedImage ? (
                        <div className="aspect-video flex flex-col items-center justify-center bg-gray-800">
                          <Camera className="w-12 h-12 text-gray-400 mb-2" />
                          <p className="text-gray-400 mb-4">Camera is off</p>
                          <button
                            onClick={startCamera}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            Start Camera
                          </button>
                        </div>
                      ) : (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            className={`w-full aspect-video object-cover ${capturedImage ? 'hidden' : ''}`}
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          {capturedImage && (
                            <img src={capturedImage} alt="Captured" className="w-full aspect-video object-cover" />
                          )}
                          
                          {/* Camera Controls */}
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                            {!capturedImage ? (
                              <button
                                onClick={captureImage}
                                className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 shadow-lg"
                              >
                                Capture
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setCapturedImage(null)}
                                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                  Retake
                                </button>
                                <button
                                  onClick={stopCamera}
                                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                  Done
                                </button>
                              </>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Face Scan Guide */}
                    <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <Eye className="w-4 h-4" />
                      <span>Position your face clearly in the frame for accurate emotion detection</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Real-time Sentiment Display */}
              <AnimatePresence>
                {sentiment && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-4 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white"
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
              {(selectedMood || moodNote || sentiment || capturedImage) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4"
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
                            <span className="text-xs text-gray-400">via {entry.source}</span>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No entries yet today. Log your first mood above!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Insights & Quick Actions */}
          <div className="space-y-6">
            {/* Wellness Score Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Today&apos;s Wellness Score</h3>
              <div className="text-5xl font-bold mb-2">82</div>
              <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                <TrendingUp className="w-4 h-4" />
                <span>↑ 5 points from yesterday</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mood</span>
                    <span>8/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '80%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy</span>
                    <span>7/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '70%' }} />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Calmness</span>
                    <span>9/10</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '90%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-xs text-gray-600">Total Days</div>
                </div>
                
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">4</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                
                <div className="text-center p-3 bg-orange-50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-xs text-gray-600">Activities</div>
                </div>
              </div>
            </div>

            {/* Mood Patterns */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Mood Patterns
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Morning (6-12)</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= 4 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Afternoon (12-18)</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= 3 ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Evening (18-24)</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full ${i <= 5 ? 'bg-purple-500' : 'bg-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Best time of day:</span>
                  <span className="font-medium text-green-600">Evening</span>
                </div>
              </div>
            </div>

            {/* Recommended Activity */}
            <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recommended for You
              </h3>
              <p className="text-white/90 text-sm mb-4">
                Based on your mood patterns, try a calming meditation session
              </p>
              <button className="w-full py-2 bg-white text-green-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Start 5-min Meditation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
