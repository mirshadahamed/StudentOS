"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  AlertTriangle,
  Phone,
  Heart,
  Shield,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  CheckCircle,
  XCircle,
  Menu,
  Settings,
  Home,
  MessageCircle,
  PhoneCall,
  Mail,
  Globe,
  Download,
  Share2,
  ChevronRight,
  ChevronLeft,
  Bell,
  BellOff,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  User,
  PhoneForwarded,
  Ambulance,
  Flame,
  Droplet,
  Wind,
  HelpCircle,
  Info,
  AlertCircle,
  Check,
  X
} from "lucide-react";

// Sample emergency contacts
const emergencyContacts = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    relationship: "Therapist",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@example.com",
    isPrimary: true,
    canCall: true,
    canMessage: true
  },
  {
    id: "2",
    name: "Mike Thompson",
    relationship: "Brother",
    phone: "+1 (555) 987-6543",
    isPrimary: false,
    canCall: true,
    canMessage: true
  },
  {
    id: "3",
    name: "Emily Chen",
    relationship: "Close Friend",
    phone: "+1 (555) 456-7890",
    isPrimary: false,
    canCall: true,
    canMessage: true
  }
];

// Sample crisis resources
const crisisResources = [
  {
    id: "1",
    name: "National Suicide Prevention Lifeline",
    description: "24/7, free and confidential support for people in distress",
    phone: "1-800-273-8255",
    website: "https://suicidepreventionlifeline.org",
    hours: "24/7",
    type: "hotline",
    languages: ["English", "Spanish"],
    isAvailable247: true
  },
  {
    id: "2",
    name: "Crisis Text Line",
    description: "Text with a trained crisis counselor",
    phone: "741741",
    website: "https://www.crisistextline.org",
    hours: "24/7",
    type: "chat",
    languages: ["English"],
    isAvailable247: true
  },
  {
    id: "3",
    name: "SAMHSA National Helpline",
    description: "Treatment referral and information service",
    phone: "1-800-662-4357",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    hours: "24/7",
    type: "hotline",
    languages: ["English", "Spanish"],
    isAvailable247: true
  },
  {
    id: "4",
    name: "The Trevor Project",
    description: "Crisis intervention for LGBTQ young people",
    phone: "1-866-488-7386",
    website: "https://www.thetrevorproject.org",
    hours: "24/7",
    type: "hotline",
    languages: ["English"],
    isAvailable247: true
  },
  {
    id: "5",
    name: "Veterans Crisis Line",
    description: "Support for veterans and their families",
    phone: "1-800-273-8255",
    website: "https://www.veteranscrisisline.net",
    hours: "24/7",
    type: "hotline",
    languages: ["English"],
    isAvailable247: true
  }
];

// Sample safety plan
const defaultSafetyPlan = {
  id: "1",
  title: "My Safety Plan",
  warningSigns: [
    "Feeling hopeless or trapped",
    "Withdrawing from friends and family",
    "Increased anxiety or agitation",
    "Sleep disturbances",
    "Loss of interest in activities"
  ],
  copingStrategies: [
    "Deep breathing exercises",
    "Go for a walk outside",
    "Listen to calming music",
    "Write in my journal",
    "Call a friend"
  ],
  supportPeople: [
    "Sarah (Therapist) - 555-123-4567",
    "Mike (Brother) - 555-987-6543",
    "Emily (Friend) - 555-456-7890"
  ],
  professionalContacts: [
    "Dr. Johnson - 555-123-4567",
    "Crisis Hotline - 1-800-273-8255",
    "Local ER - 911"
  ],
  safeEnvironment: [
    "Remove access to means",
    "Stay in public spaces",
    "Keep medications secured",
    "Avoid being alone when struggling"
  ],
  reasonsToLive: [
    "My family loves me",
    "My dog needs me",
    "I have goals I want to achieve",
    "Things can get better",
    "I haven't traveled enough"
  ],
  lastUpdated: new Date()
};

// Risk assessment function (simulated)
const assessRisk = () => {
  const random = Math.random();
  let level = "low";
  let score = 0;
  
  if (random < 0.3) {
    level = "low";
    score = 15;
  } else if (random < 0.6) {
    level = "moderate";
    score = 35;
  } else if (random < 0.85) {
    level = "high";
    score = 65;
  } else {
    level = "critical";
    score = 85;
  }
  
  const factors = [
    "Recent mood changes detected",
    "Sleep pattern disruption",
    "Social withdrawal indicators",
    "Expressed feelings of hopelessness"
  ];
  
  const recommendations = [
    "Reach out to a support person",
    "Practice grounding techniques",
    "Review your safety plan",
    "Consider professional support"
  ];
  
  return {
    level,
    score,
    factors: factors.slice(0, Math.floor(Math.random() * 3) + 2),
    recommendations,
    timestamp: new Date()
  };
};

export default function SOSPage() {
  const [activeTab, setActiveTab] = useState("sos");
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const riskAssessment = useMemo(() => assessRisk(), []);
  const [showRiskAlert, setShowRiskAlert] = useState(
    () => riskAssessment.level === "high" || riskAssessment.level === "critical"
  );
  const [safetyPlan, setSafetyPlan] = useState(defaultSafetyPlan);
  const [editingPlan, setEditingPlan] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationShared, setLocationShared] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  function triggerEmergency() {
    setIsEmergencyActive(true);
    setShowEmergencyDialog(false);
    
    // Simulate emergency actions
    console.log("🚨 EMERGENCY TRIGGERED");
    
    // In a real app, this would:
    // 1. Call emergency contacts
    // 2. Send location to contacts
    // 3. Alert crisis services
    // 4. Display emergency instructions
    
    // Reset after 3 seconds (for demo)
    setTimeout(() => {
      setIsEmergencyActive(false);
    }, 3000);
  }

  // Emergency countdown
  useEffect(() => {
    let timer;
    if (showEmergencyDialog && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      timer = setTimeout(() => triggerEmergency(), 0);
    }
    return () => clearTimeout(timer);
  }, [showEmergencyDialog, countdown]);

  const cancelEmergency = () => {
    setShowEmergencyDialog(false);
    setCountdown(5);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical": return "bg-red-100 text-red-800 border-red-200 animate-pulse";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Emergency Active Overlay */}
      <AnimatePresence>
        {isEmergencyActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-red-600 p-4"
          >
              <div className="text-center text-white">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mb-8"
              >
                <Ambulance className="w-24 h-24 mx-auto" />
              </motion.div>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl">EMERGENCY ACTIVE</h2>
              <p className="mb-8 text-lg sm:text-xl">Help has been notified. Stay calm.</p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-semibold hover:bg-gray-100">
                  I&apos;m Safe Now
                </button>
                <button className="px-6 py-3 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800">
                  Cancel Alert
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900 sm:text-xl">SOS Safety</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {notificationsEnabled ? (
                  <Bell className="w-5 h-5 text-gray-600" />
                ) : (
                  <BellOff className="w-5 h-5 text-gray-600" />
                )}
              </button>
              <Link
                href="/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SOS Button Section - Always visible */}
        <div className="mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEmergencyDialog(true)}
            className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-orange-600 py-5 text-white shadow-lg transition-all hover:shadow-xl sm:py-6"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <div className="flex items-center justify-center gap-2 px-3 text-center sm:gap-4">
              <AlertTriangle className="h-6 w-6 animate-pulse sm:h-8 sm:w-8" />
              <span className="text-lg font-bold sm:text-2xl">SOS EMERGENCY BUTTON</span>
              <AlertTriangle className="h-6 w-6 animate-pulse sm:h-8 sm:w-8" />
            </div>
            <p className="text-sm mt-2 text-white/80">Press only in case of immediate danger</p>
          </motion.button>
        </div>

        {/* Emergency Confirmation Dialog */}
        <AnimatePresence>
          {showEmergencyDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6"
              >
                <h3 className="mb-4 text-xl font-bold text-red-600 sm:text-2xl">Emergency Confirmation</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to trigger the emergency protocol? This will:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-red-500" />
                    Call your primary emergency contact
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-red-500" />
                    Share your location with contacts
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Bell className="w-4 h-4 text-red-500" />
                    Alert crisis services if needed
                  </li>
                </ul>
                
                <div className="text-center mb-6">
                  <div className="mb-2 text-4xl font-bold text-red-600 sm:text-5xl">{countdown}</div>
                  <p className="text-sm text-gray-500">Auto-triggering in {countdown} seconds</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={triggerEmergency}
                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Yes, Trigger SOS
                  </button>
                  <button
                    onClick={cancelEmergency}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: "sos", label: "SOS Central", icon: Shield },
            { id: "contacts", label: "Emergency Contacts", icon: Users },
            { id: "resources", label: "Crisis Resources", icon: BookOpen },
            { id: "safety", label: "Safety Plan", icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all
                  ${isActive 
                    ? 'bg-red-600 text-white shadow-lg' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Risk Assessment Alert */}
        <AnimatePresence>
          {riskAssessment && showRiskAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`mb-6 p-4 rounded-xl border-2 ${getRiskColor(riskAssessment.level)} relative`}
            >
              <button
                onClick={() => setShowRiskAlert(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="p-3 bg-white rounded-full shadow-md">
                  {riskAssessment.level === "critical" ? (
                    <Flame className="w-6 h-6 text-red-600" />
                  ) : riskAssessment.level === "high" ? (
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  ) : riskAssessment.level === "moderate" ? (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                    <h3 className="font-bold text-lg capitalize">
                      {riskAssessment.level} Risk Level Detected
                    </h3>
                    <span className="px-2 py-1 bg-white/50 rounded-full text-xs">
                      Score: {riskAssessment.score}%
                    </span>
                  </div>

                  <p className="text-sm mb-3">
                    Based on your recent activity and mood patterns, we&apos;ve detected some concerns.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Risk Factors:</h4>
                      <ul className="space-y-1">
                        {riskAssessment.factors.map((factor, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Recommendations:</h4>
                      <ul className="space-y-1">
                        {riskAssessment.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                      Review Safety Plan
                    </button>
                    <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
          {/* SOS Central */}
          {activeTab === "sos" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">SOS Central</h2>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-6 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left">
                  <Phone className="w-8 h-8 text-red-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Call Emergency Services</h3>
                  <p className="text-sm text-gray-600">Direct line to 911 (US)</p>
                </button>

                <button className="p-6 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left">
                  <MessageCircle className="w-8 h-8 text-orange-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Crisis Text Line</h3>
                  <p className="text-sm text-gray-600">Text HOME to 741741</p>
                </button>

                <button className="p-6 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors text-left">
                  <MapPin className="w-8 h-8 text-yellow-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Share Location</h3>
                  <p className="text-sm text-gray-600">Send your location to trusted contacts</p>
                </button>

                <button className="p-6 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
                  <Heart className="w-8 h-8 text-green-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Grounding Exercises</h3>
                  <p className="text-sm text-gray-600">Quick calming techniques</p>
                </button>
              </div>

              {/* Location Sharing */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 sm:items-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Location Sharing</h4>
                      <p className="text-sm text-gray-500">
                        {locationShared 
                          ? "Your location is being shared with emergency contacts" 
                          : "Share your location for faster emergency response"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setLocationShared(!locationShared)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      locationShared 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {locationShared ? 'Sharing' : 'Share'}
                  </button>
                </div>
              </div>

              {/* Emergency Instructions */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">In Case of Emergency:</h3>
                <div className="space-y-3">
                  {[
                    "Stay calm and breathe deeply",
                    "Call emergency services immediately if in danger",
                    "Reach out to your emergency contacts",
                    "Move to a safe location if possible",
                    "Use grounding techniques: 5-4-3-2-1 method"
                  ].map((instruction, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Emergency Contacts */}
          {activeTab === "contacts" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Emergency Contacts</h2>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  <Plus className="w-4 h-4" />
                  Add Contact
                </button>
              </div>

              {/* Contact List */}
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <motion.div
                    key={contact.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-3 rounded-full ${
                          contact.isPrimary ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          <User className={`w-5 h-5 ${
                            contact.isPrimary ? 'text-red-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                            {contact.isPrimary && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{contact.relationship}</p>
                          <p className="text-sm text-gray-700 mt-1">{contact.phone}</p>
                          {contact.email && (
                            <p className="text-sm text-gray-500">{contact.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 self-end sm:self-auto">
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Dial */}
              <div className="mt-6 p-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white">
                <h3 className="font-semibold mb-2">Quick Dial Emergency</h3>
                <p className="text-sm text-white/80 mb-4">
                  Press and hold the SOS button on your phone for immediate emergency services
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button className="flex-1 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100">
                    Call 911
                  </button>
                  <button className="flex-1 py-2 bg-red-700 text-white rounded-lg font-semibold hover:bg-red-800">
                    Test Call
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Crisis Resources */}
          {activeTab === "resources" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">Crisis Resources</h2>

              {/* Filter Bar */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg whitespace-nowrap">All</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Hotlines</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Text/Chat</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">24/7 Available</button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg whitespace-nowrap hover:bg-gray-200">Local</button>
              </div>

              {/* Resources Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {crisisResources.map((resource) => (
                  <motion.div
                    key={resource.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        resource.type === 'hotline' ? 'bg-red-100' :
                        resource.type === 'chat' ? 'bg-blue-100' :
                        resource.type === 'local' ? 'bg-green-100' : 'bg-purple-100'
                      }`}>
                        {resource.type === 'hotline' && <Phone className="w-4 h-4 text-red-600" />}
                        {resource.type === 'chat' && <MessageCircle className="w-4 h-4 text-blue-600" />}
                        {resource.type === 'local' && <MapPin className="w-4 h-4 text-green-600" />}
                        {resource.type === 'online' && <Globe className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{resource.name}</h3>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                      </div>
                      {resource.isAvailable247 && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full">
                          24/7
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a href={`tel:${resource.phone}`} className="text-blue-600 hover:underline">
                          {resource.phone}
                        </a>
                      </div>
                      
                      {resource.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            Visit Website
                          </a>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{resource.hours}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {resource.languages.map((lang) => (
                          <span key={lang} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                        Call Now
                      </button>
                      <button className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                        Save
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Safety Plan */}
          {activeTab === "safety" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">My Safety Plan</h2>
                <div className="flex flex-wrap gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setEditingPlan(!editingPlan)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingPlan ? 'Save Plan' : 'Edit Plan'}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Last updated: {safetyPlan.lastUpdated.toLocaleDateString()}
              </p>

              {/* Plan Sections */}
              <div className="space-y-4">
                {/* Warning Signs */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Warning Signs
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.warningSigns.map((sign, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500">•</span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add warning sign
                    </button>
                  )}
                </div>

                {/* Coping Strategies */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-500" />
                    Coping Strategies
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.copingStrategies.map((strategy, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-pink-500">•</span>
                        {strategy}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add coping strategy
                    </button>
                  )}
                </div>

                {/* Support People */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    Support People
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.supportPeople.map((person, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-blue-500">•</span>
                        {person}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add support person
                    </button>
                  )}
                </div>

                {/* Professional Contacts */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    Professional Contacts
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.professionalContacts.map((contact, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-green-500">•</span>
                        {contact}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add professional contact
                    </button>
                  )}
                </div>

                {/* Safe Environment */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-500" />
                    Making My Environment Safe
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.safeEnvironment.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-purple-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add safety measure
                    </button>
                  )}
                </div>

                {/* Reasons to Live */}
                <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-pink-50 to-purple-50">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Reasons to Live
                  </h3>
                  <ul className="space-y-2">
                    {safetyPlan.reasonsToLive.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-red-500">❤️</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                  {editingPlan && (
                    <button className="mt-2 text-sm text-red-600 hover:text-red-700">
                      + Add reason
                    </button>
                  )}
                </div>
              </div>

              {/* Safety Plan Tips */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Safety Plan Tips
                </h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Review your plan regularly and update as needed</li>
                  <li>• Share your plan with trusted people</li>
                  <li>• Keep a copy easily accessible (phone, wallet, etc.)</li>
                  <li>• Practice your coping strategies when you&apos;re feeling calm</li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Information */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>If this is a life-threatening emergency, please call 911 immediately.</p>
          <p className="mt-2">© 2024 Safety & Support Services. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
