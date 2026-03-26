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
  AlertCircle
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">MoodFlow</span>
            </div>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-700 flex items-center gap-2"
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
            className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700 flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {errorMessage}
          </motion.div>
        )}

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-600 to-pink-600" />
          
          {/* Profile Info */}
          <div className="relative px-6 pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 p-1">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    {userData?.profileImage ? (
                      <Image
                        src={userData.profileImage}
                        alt={userData.name}
                        width={110}
                        height={110}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-14 h-14 text-purple-600" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-1 right-1 p-1.5 bg-purple-600 rounded-full text-white hover:bg-purple-700 transition-colors">
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
                    className="w-full text-2xl font-bold text-center border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    className="w-full text-gray-600 border-2 border-purple-200 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
                    placeholder="Your email"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userData?.name || "User"}
                  </h1>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {userData?.email || "email@example.com"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined {formatDate(userData?.createdAt || userData?.joinDate)}
                  </p>
                </>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center gap-3">
              {isEditing ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
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
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2"
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
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-2"
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
          className="mt-6 bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Quick Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {userData?.totalMoods || 0}
              </p>
              <p className="text-sm text-gray-500">Total Moods Logged</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {userData?.moodStreak || 0}
              </p>
              <p className="text-sm text-gray-500">Current Streak</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
