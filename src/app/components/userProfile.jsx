"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Calendar,
  Heart,
  Edit2,
  Save,
  X,
  Camera,
  Loader2,
  LogOut,
  Check,
  AlertCircle,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("student_user_id");
      
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`/api/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setEditedName(data.name);
        setEditedEmail(data.email);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const userId = localStorage.getItem("student_user_id");
      
      const response = await fetch(`/api/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedName,
          email: editedEmail,
        }),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
        setSuccessMessage("Profile updated successfully!");
        
        // Update localStorage
        localStorage.setItem("user_name", updatedUser.name);
        
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Failed to update profile. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student_user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    router.push("/SignInpage");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "March 2024";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin mx-auto mb-4" />
          <p className="text-[#9CA3AF]">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navigation Bar */}
      <nav className="bg-[#111827] backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-[#374151]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-[#E5E7EB] sm:text-xl">MoodFlow</span>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 text-sm text-[#9CA3AF] transition-colors hover:text-[#22C55E] sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-[#22C55E]/10 border border-[#22C55E]/20 rounded-lg text-[#4ADE80] flex items-center gap-2"
          >
            <Check className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
        
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-[#F87171]/10 border border-[#F87171]/20 rounded-lg text-[#F87171] flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1F2937] rounded-2xl shadow-xl overflow-hidden border border-[#374151]"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-[#22C55E] to-[#16A34A]" />
          
          {/* Profile Info */}
          <div className="relative px-4 pb-6 sm:px-6 sm:pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] p-1">
                  <div className="w-full h-full rounded-full bg-[#1F2937] flex items-center justify-center">
                    {userData?.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt={userData.name}
                        width={110}
                        height={110}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-[#22C55E]" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 p-1.5 bg-[#22C55E] rounded-full text-white hover:bg-[#16A34A] transition-colors">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
            </div>
            
            {/* User Details */}
            <div className="text-center mb-6">
              {isEditing ? (
                <div className="space-y-3 max-w-md mx-auto">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="w-full text-2xl font-bold text-center bg-[#111827] border-2 border-[#22C55E]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#22C55E] text-[#E5E7EB] placeholder:text-[#6B7280]"
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full text-[#9CA3AF] bg-[#111827] border-2 border-[#22C55E]/30 rounded-lg px-4 py-2 focus:outline-none focus:border-[#22C55E]"
                    placeholder="Your email"
                  />
                </div>
              ) : (
                <>
                  <h1 className="mb-2 text-2xl font-bold text-[#E5E7EB] sm:text-3xl">
                    {userData?.name || "User"}
                  </h1>
                  <p className="text-[#9CA3AF] flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userData?.email || "email@example.com"}
                  </p>
                  <p className="text-sm text-[#6B7280] mt-2 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(userData?.createdAt || userData?.joinDate)}
                  </p>
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2 bg-[#22C55E] text-white rounded-lg font-semibold hover:bg-[#16A34A] transition-colors flex items-center gap-2"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(userData?.name || "");
                      setEditedEmail(userData?.email || "");
                    }}
                    className="px-6 py-2 bg-[#374151] text-[#E5E7EB] rounded-lg font-semibold hover:bg-[#4B5563] transition-colors flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-[#22C55E] text-white rounded-lg font-semibold hover:bg-[#16A34A] transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-6 py-2 bg-[#F87171] text-white rounded-lg font-semibold hover:bg-[#EF4444] transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </motion.button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Simple Stats Card - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-[#1F2937] rounded-xl shadow-lg p-5 sm:p-6 border border-[#374151]"
        >
          <h2 className="text-lg font-semibold text-[#E5E7EB] mb-4 text-center">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#22C55E]">
                {userData?.totalMoods || 0}
              </p>
              <p className="text-sm text-[#9CA3AF]">Total Moods Logged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#22C55E]">
                {userData?.moodStreak || 0}
              </p>
              <p className="text-sm text-[#9CA3AF]">Current Streak</p>
            </div>
          </div>
        </motion.div>

        {/* Motivational Quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 rounded-full border border-[#22C55E]/20">
            <Sparkles className="w-4 h-4 text-[#22C55E]" />
            <span className="text-sm text-[#9CA3AF]">
              "Your mental health journey matters"
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}