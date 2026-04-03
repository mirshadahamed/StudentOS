// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Users,
//   Activity,
//   Heart,
//   TrendingUp,
//   Calendar,
//   Clock,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   ChevronDown,
//   ChevronRight,
//   Menu,
//   X,
//   Search,
//   Filter,
//   Download,
//   RefreshCw,
//   Eye,
//   Edit,
//   Trash2,
//   MoreVertical,
//   UserPlus,
//   Mail,
//   Phone,
//   MapPin,
//   Award,
//   BarChart3,
//   PieChart,
//   LineChart,
//   Settings,
//   LogOut,
//   Bell,
//   Moon,
//   Sun,
//   Shield,
//   Database,
//   FileText,
//   MessageSquare,
//   ThumbsUp,
//   ThumbsDown,
//   Star,
//   UserCheck,
//   UserX,
//   Clock as ClockIcon,
//   Calendar as CalendarIcon,
//   TrendingDown,
//   Sparkles,
//   DollarSign,
//   CreditCard,
//   Wallet,
//   Receipt,
//   Briefcase,
//   Globe,
//   Lock,
//   Users2,
//   MessageCircle,
//   FileBarChart,
//   FileSpreadsheet,
//   Printer,
//   Upload,
//   FilterX,
//   ArrowUpDown,
//   ExternalLink,
//   Copy,
//   Share2
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// // Types
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "admin" | "user" | "moderator";
//   status: "active" | "inactive" | "suspended";
//   moodEntries: number;
//   lastActive: string;
//   joinDate: string;
//   avatar?: string;
//   location?: string;
//   phone?: string;
// }

// interface MoodEntry {
//   id: string;
//   userId: string;
//   userName: string;
//   mood: string;
//   intensity: number;
//   note: string;
//   timestamp: string;
//   sentiment: "positive" | "neutral" | "negative";
//   sentimentScore: number;
// }

// interface Analytics {
//   totalUsers: number;
//   activeUsers: number;
//   totalMoodEntries: number;
//   averageMoodScore: number;
//   userGrowth: number;
//   entriesGrowth: number;
//   riskUsers: number;
//   riskAlerts: number;
// }

// interface ActivityLog {
//   id: string;
//   userId: string;
//   userName: string;
//   action: string;
//   timestamp: string;
//   details: string;
// }

// // Mock Data
// const mockUsers: User[] = [
//   {
//     id: "1",
//     name: "Alex Johnson",
//     email: "alex@example.com",
//     role: "user",
//     status: "active",
//     moodEntries: 45,
//     lastActive: "2024-01-15T10:30:00",
//     joinDate: "2023-06-01",
//     location: "New York, NY",
//     phone: "+1 234-567-8901"
//   },
//   {
//     id: "2",
//     name: "Sarah Williams",
//     email: "sarah@example.com",
//     role: "user",
//     status: "active",
//     moodEntries: 32,
//     lastActive: "2024-01-14T15:45:00",
//     joinDate: "2023-07-15",
//     location: "Los Angeles, CA",
//     phone: "+1 234-567-8902"
//   },
//   {
//     id: "3",
//     name: "Michael Brown",
//     email: "michael@example.com",
//     role: "moderator",
//     status: "active",
//     moodEntries: 128,
//     lastActive: "2024-01-15T09:15:00",
//     joinDate: "2023-03-10",
//     location: "Chicago, IL",
//     phone: "+1 234-567-8903"
//   },
//   {
//     id: "4",
//     name: "Emily Davis",
//     email: "emily@example.com",
//     role: "user",
//     status: "inactive",
//     moodEntries: 12,
//     lastActive: "2023-12-20T14:20:00",
//     joinDate: "2023-09-20",
//     location: "Houston, TX",
//     phone: "+1 234-567-8904"
//   },
//   {
//     id: "5",
//     name: "James Wilson",
//     email: "james@example.com",
//     role: "user",
//     status: "suspended",
//     moodEntries: 8,
//     lastActive: "2023-12-15T11:00:00",
//     joinDate: "2023-10-05",
//     location: "Phoenix, AZ",
//     phone: "+1 234-567-8905"
//   }
// ];

// const mockMoodEntries: MoodEntry[] = [
//   {
//     id: "1",
//     userId: "1",
//     userName: "Alex Johnson",
//     mood: "happy",
//     intensity: 5,
//     note: "Had a great day!",
//     timestamp: "2024-01-15T10:30:00",
//     sentiment: "positive",
//     sentimentScore: 0.95
//   },
//   {
//     id: "2",
//     userId: "2",
//     userName: "Sarah Williams",
//     mood: "calm",
//     intensity: 4,
//     note: "Productive day at work",
//     timestamp: "2024-01-14T15:45:00",
//     sentiment: "positive",
//     sentimentScore: 0.82
//   },
//   {
//     id: "3",
//     userId: "3",
//     userName: "Michael Brown",
//     mood: "anxious",
//     intensity: 3,
//     note: "Feeling stressed about deadline",
//     timestamp: "2024-01-13T09:15:00",
//     sentiment: "negative",
//     sentimentScore: 0.35
//   },
//   {
//     id: "4",
//     userId: "4",
//     userName: "Emily Davis",
//     mood: "sad",
//     intensity: 2,
//     note: "Not feeling well today",
//     timestamp: "2023-12-20T14:20:00",
//     sentiment: "negative",
//     sentimentScore: 0.25
//   },
//   {
//     id: "5",
//     userId: "5",
//     userName: "James Wilson",
//     mood: "angry",
//     intensity: 4,
//     note: "Frustrated with project",
//     timestamp: "2023-12-15T11:00:00",
//     sentiment: "negative",
//     sentimentScore: 0.15
//   }
// ];

// const mockActivityLogs: ActivityLog[] = [
//   {
//     id: "1",
//     userId: "1",
//     userName: "Alex Johnson",
//     action: "Logged mood",
//     timestamp: "2024-01-15T10:30:00",
//     details: "Mood: happy, Intensity: 5"
//   },
//   {
//     id: "2",
//     userId: "2",
//     userName: "Sarah Williams",
//     action: "Updated profile",
//     timestamp: "2024-01-14T15:45:00",
//     details: "Changed profile picture"
//   },
//   {
//     id: "3",
//     userId: "3",
//     userName: "Michael Brown",
//     action: "Completed activity",
//     timestamp: "2024-01-14T09:15:00",
//     details: "Completed breathing exercise"
//   },
//   {
//     id: "4",
//     userId: "1",
//     userName: "Alex Johnson",
//     action: "Received notification",
//     timestamp: "2024-01-13T14:20:00",
//     details: "Risk alert triggered"
//   },
//   {
//     id: "5",
//     userId: "4",
//     userName: "Emily Davis",
//     action: "Logged mood",
//     timestamp: "2023-12-20T14:20:00",
//     details: "Mood: sad, Intensity: 2"
//   }
// ];

// const analyticsData: Analytics = {
//   totalUsers: 1250,
//   activeUsers: 890,
//   totalMoodEntries: 3450,
//   averageMoodScore: 3.6,
//   userGrowth: 12.5,
//   entriesGrowth: 8.3,
//   riskUsers: 23,
//   riskAlerts: 45
// };

// export default function AdminDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<User | null>(null);
//   const [darkMode, setDarkMode] = useState(false);
//   const [dateRange, setDateRange] = useState("week");
//   const [selectedStatus, setSelectedStatus] = useState("all");
//   const [selectedRole, setSelectedRole] = useState("all");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");

//   // Filtered users
//   const filteredUsers = useMemo(() => {
//     let filtered = [...mockUsers];
    
//     if (searchQuery) {
//       filtered = filtered.filter(user =>
//         user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }
    
//     if (selectedStatus !== "all") {
//       filtered = filtered.filter(user => user.status === selectedStatus);
//     }
    
//     if (selectedRole !== "all") {
//       filtered = filtered.filter(user => user.role === selectedRole);
//     }
    
//     // Sort
//     filtered.sort((a, b) => {
//       let aVal = a[sortBy as keyof User];
//       let bVal = b[sortBy as keyof User];
      
//       if (typeof aVal === "string" && typeof bVal === "string") {
//         return sortOrder === "asc" 
//           ? aVal.localeCompare(bVal)
//           : bVal.localeCompare(aVal);
//       }
      
//       return sortOrder === "asc" 
//         ? (aVal as number) - (bVal as number)
//         : (bVal as number) - (aVal as number);
//     });
    
//     return filtered;
//   }, [mockUsers, searchQuery, selectedStatus, selectedRole, sortBy, sortOrder]);

//   // Stats cards data
//   const statsCards = [
//     {
//       title: "Total Users",
//       value: analyticsData.totalUsers,
//       change: `+${analyticsData.userGrowth}%`,
//       icon: Users,
//       color: "from-blue-500 to-cyan-500",
//       bgColor: "bg-blue-50",
//       textColor: "text-blue-600"
//     },
//     {
//       title: "Active Users",
//       value: analyticsData.activeUsers,
//       change: `${((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}%`,
//       icon: UserCheck,
//       color: "from-green-500 to-emerald-500",
//       bgColor: "bg-green-50",
//       textColor: "text-green-600"
//     },
//     {
//       title: "Mood Entries",
//       value: analyticsData.totalMoodEntries,
//       change: `+${analyticsData.entriesGrowth}%`,
//       icon: Activity,
//       color: "from-purple-500 to-pink-500",
//       bgColor: "bg-purple-50",
//       textColor: "text-purple-600"
//     },
//     {
//       title: "Avg. Mood Score",
//       value: analyticsData.averageMoodScore,
//       change: "out of 5",
//       icon: TrendingUp,
//       color: "from-orange-500 to-red-500",
//       bgColor: "bg-orange-50",
//       textColor: "text-orange-600"
//     },
//     {
//       title: "At-Risk Users",
//       value: analyticsData.riskUsers,
//       change: `${analyticsData.riskAlerts} alerts`,
//       icon: AlertCircle,
//       color: "from-red-500 to-rose-500",
//       bgColor: "bg-red-50",
//       textColor: "text-red-600"
//     },
//     {
//       title: "Response Rate",
//       value: "71%",
//       change: "+5%",
//       icon: MessageCircle,
//       color: "from-indigo-500 to-purple-500",
//       bgColor: "bg-indigo-50",
//       textColor: "text-indigo-600"
//     }
//   ];

//   // Get mood color
//   const getMoodColor = (mood: string) => {
//     const colors: Record<string, string> = {
//       happy: "text-yellow-600 bg-yellow-100",
//       excited: "text-orange-600 bg-orange-100",
//       calm: "text-green-600 bg-green-100",
//       neutral: "text-gray-600 bg-gray-100",
//       tired: "text-purple-600 bg-purple-100",
//       anxious: "text-indigo-600 bg-indigo-100",
//       sad: "text-blue-600 bg-blue-100",
//       angry: "text-red-600 bg-red-100"
//     };
//     return colors[mood] || "text-gray-600 bg-gray-100";
//   };

//   // Get mood emoji
//   const getMoodEmoji = (mood: string) => {
//     const emojis: Record<string, string> = {
//       happy: "😊",
//       excited: "🎉",
//       calm: "😌",
//       neutral: "😐",
//       tired: "😴",
//       anxious: "😰",
//       sad: "😢",
//       angry: "😠"
//     };
//     return emojis[mood] || "😐";
//   };

//   // Handle user actions
//   const handleEditUser = (user: User) => {
//     setSelectedUser(user);
//     setShowUserModal(true);
//   };

//   const handleDeleteUser = (user: User) => {
//     setUserToDelete(user);
//     setShowDeleteModal(true);
//   };

//   const confirmDeleteUser = () => {
//     console.log("Delete user:", userToDelete?.id);
//     setShowDeleteModal(false);
//     setUserToDelete(null);
//   };

//   const handleExportData = () => {
//     console.log("Exporting data...");
//   };

//   const handleRefresh = () => {
//     console.log("Refreshing data...");
//   };

//   return (
//     <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'}`}>
//       {/* Sidebar */}
//       <motion.aside
//         initial={{ x: -280 }}
//         animate={{ x: sidebarOpen ? 0 : -280 }}
//         className={`fixed top-0 left-0 h-full w-72 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl z-50 transition-all duration-300`}
//       >
//         <div className="p-6">
//           {/* Logo */}
//           <div className="flex items-center justify-between mb-8">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
//                 <Heart className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>MoodFlow</h1>
//                 <p className="text-xs text-gray-500">Admin Dashboard</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setSidebarOpen(false)}
//               className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>

//           {/* Navigation */}
//           <nav className="space-y-2">
//             {[
//               { id: "overview", label: "Overview", icon: BarChart3 },
//               { id: "users", label: "Users", icon: Users },
//               { id: "mood-entries", label: "Mood Entries", icon: Activity },
//               { id: "analytics", label: "Analytics", icon: TrendingUp },
//               { id: "activity-logs", label: "Activity Logs", icon: ClockIcon },
//               { id: "settings", label: "Settings", icon: Settings }
//             ].map((item) => {
//               const Icon = item.icon;
//               const isActive = activeTab === item.id;
              
//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => setActiveTab(item.id)}
//                   className={`
//                     w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
//                     ${isActive 
//                       ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
//                       : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`
//                     }
//                   `}
//                 >
//                   <Icon className="w-5 h-5" />
//                   <span className="font-medium">{item.label}</span>
//                   {isActive && (
//                     <motion.div
//                       layoutId="active-nav"
//                       className="absolute left-0 w-1 h-8 bg-white rounded-r"
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* Bottom Section */}
//           <div className="absolute bottom-6 left-0 right-0 px-6">
//             <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} mb-4`}>
//               <div className="flex items-center gap-3 mb-3">
//                 <Shield className="w-8 h-8 text-purple-600" />
//                 <div>
//                   <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin Access</p>
//                   <p className="text-xs text-gray-500">Full system control</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setDarkMode(!darkMode)}
//                 className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${darkMode ? 'bg-gray-600 text-white' : 'bg-white text-gray-700'} shadow-sm`}
//               >
//                 {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//                 {darkMode ? "Light Mode" : "Dark Mode"}
//               </button>
//             </div>
            
//             <button className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-300 hover:bg-red-900/70' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
//               <LogOut className="w-4 h-4" />
//               <span>Logout</span>
//             </button>
//           </div>
//         </div>
//       </motion.aside>

//       {/* Main Content */}
//       <div className={`${sidebarOpen ? 'lg:ml-72' : 'ml-0'} transition-all duration-300`}>
//         {/* Header */}
//         <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-md shadow-sm`}>
//           <div className="px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <button
//                   onClick={() => setSidebarOpen(!sidebarOpen)}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <Menu className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                   {activeTab === "overview" && "Dashboard Overview"}
//                   {activeTab === "users" && "User Management"}
//                   {activeTab === "mood-entries" && "Mood Entries"}
//                   {activeTab === "analytics" && "Analytics & Reports"}
//                   {activeTab === "activity-logs" && "Activity Logs"}
//                   {activeTab === "settings" && "System Settings"}
//                 </h1>
//               </div>
              
//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={handleRefresh}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <RefreshCw className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <button
//                   onClick={handleExportData}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <Download className="w-5 h-5 text-gray-600" />
//                 </button>
//                 <div className="relative">
//                   <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
//                   <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
//                     3
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
//                   <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
//                     <span className="text-white text-sm font-semibold">A</span>
//                   </div>
//                   <div className="hidden sm:block">
//                     <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</p>
//                     <p className="text-xs text-gray-500">admin@moodflow.com</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="px-4 sm:px-6 lg:px-8 py-8">
//           {/* Overview Tab */}
//           {activeTab === "overview" && (
//             <div className="space-y-6">
//               {/* Stats Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//                 {statsCards.map((card, index) => {
//                   const Icon = card.icon;
//                   return (
//                     <motion.div
//                       key={card.title}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       transition={{ delay: index * 0.05 }}
//                       className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-5 hover:shadow-lg transition-all`}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <div className={`p-2 rounded-lg ${card.bgColor}`}>
//                           <Icon className={`w-5 h-5 ${card.textColor}`} />
//                         </div>
//                         <span className={`text-xs font-medium ${card.textColor} bg-opacity-20 px-2 py-1 rounded-full`}>
//                           {card.change}
//                         </span>
//                       </div>
//                       <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                         {card.value}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1">{card.title}</p>
//                     </motion.div>
//                   );
//                 })}
//               </div>

//               {/* Recent Mood Entries */}
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                     Recent Mood Entries
//                   </h2>
//                   <button
//                     onClick={() => setActiveTab("mood-entries")}
//                     className="text-purple-600 text-sm font-medium hover:text-purple-700"
//                   >
//                     View All →
//                   </button>
//                 </div>
//                 <div className="space-y-4">
//                   {mockMoodEntries.slice(0, 5).map((entry) => (
//                     <div key={entry.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                       <div className="flex items-center gap-3">
//                         <div className={`p-2 rounded-full ${getMoodColor(entry.mood)}`}>
//                           <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
//                         </div>
//                         <div>
//                           <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.userName}</p>
//                           <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <div className="flex items-center gap-1">
//                           {[1, 2, 3, 4, 5].map(i => (
//                             <div
//                               key={i}
//                               className={`w-2 h-2 rounded-full ${i <= entry.intensity ? 'bg-purple-500' : 'bg-gray-300'}`}
//                             />
//                           ))}
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">Intensity: {entry.intensity}/5</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Recent Activity & Quick Actions */}
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Activity */}
//                 <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//                   <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//                     Recent Activity
//                   </h2>
//                   <div className="space-y-4">
//                     {mockActivityLogs.slice(0, 4).map((log) => (
//                       <div key={log.id} className="flex items-start gap-3">
//                         <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                           <Activity className="w-4 h-4 text-purple-600" />
//                         </div>
//                         <div className="flex-1">
//                           <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                             <span className="font-medium">{log.userName}</span> {log.action}
//                           </p>
//                           <p className="text-xs text-gray-500 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Quick Actions */}
//                 <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//                   <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//                     Quick Actions
//                   </h2>
//                   <div className="grid grid-cols-2 gap-3">
//                     <button className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white hover:shadow-lg transition-all">
//                       <UserPlus className="w-6 h-6 mb-2 mx-auto" />
//                       <p className="text-sm font-medium">Add User</p>
//                     </button>
//                     <button className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl text-white hover:shadow-lg transition-all">
//                       <FileText className="w-6 h-6 mb-2 mx-auto" />
//                       <p className="text-sm font-medium">Generate Report</p>
//                     </button>
//                     <button className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white hover:shadow-lg transition-all">
//                       <Mail className="w-6 h-6 mb-2 mx-auto" />
//                       <p className="text-sm font-medium">Send Alert</p>
//                     </button>
//                     <button className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white hover:shadow-lg transition-all">
//                       <Shield className="w-6 h-6 mb-2 mx-auto" />
//                       <p className="text-sm font-medium">Risk Review</p>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Users Tab */}
//           {activeTab === "users" && (
//             <div className="space-y-6">
//               {/* Filters */}
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <div className="flex-1 relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Search users..."
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                       className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                     />
//                   </div>
                  
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => setSelectedStatus(e.target.value)}
//                     className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                   >
//                     <option value="all">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                     <option value="suspended">Suspended</option>
//                   </select>
                  
//                   <select
//                     value={selectedRole}
//                     onChange={(e) => setSelectedRole(e.target.value)}
//                     className={`px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
//                   >
//                     <option value="all">All Roles</option>
//                     <option value="admin">Admin</option>
//                     <option value="moderator">Moderator</option>
//                     <option value="user">User</option>
//                   </select>
                  
//                   <button
//                     onClick={() => {
//                       setSearchQuery("");
//                       setSelectedStatus("all");
//                       setSelectedRole("all");
//                     }}
//                     className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
//                   >
//                     <FilterX className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Users Table */}
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm overflow-hidden`}>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                       <tr>
//                         {["User", "Email", "Role", "Status", "Mood Entries", "Last Active", "Actions"].map((header, idx) => (
//                           <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             <button
//                               onClick={() => {
//                                 if (header === "User") {
//                                   setSortBy("name");
//                                   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//                                 } else if (header === "Mood Entries") {
//                                   setSortBy("moodEntries");
//                                   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//                                 } else if (header === "Last Active") {
//                                   setSortBy("lastActive");
//                                   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//                                 }
//                               }}
//                               className="flex items-center gap-1 hover:text-purple-600"
//                             >
//                               {header}
//                               {sortBy === "name" && <ArrowUpDown className="w-3 h-3" />}
//                             </button>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
//                       {filteredUsers.map((user) => (
//                         <tr key={user.id} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-3">
//                               <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
//                                 <span className="text-white font-semibold">{user.name.charAt(0)}</span>
//                               </div>
//                               <div>
//                                 <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
//                                 <p className="text-sm text-gray-500">ID: {user.id}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{user.email}</p>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               user.role === "admin" ? "bg-purple-100 text-purple-700" :
//                               user.role === "moderator" ? "bg-blue-100 text-blue-700" :
//                               "bg-gray-100 text-gray-700"
//                             }`}>
//                               {user.role}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                               user.status === "active" ? "bg-green-100 text-green-700" :
//                               user.status === "inactive" ? "bg-yellow-100 text-yellow-700" :
//                               "bg-red-100 text-red-700"
//                             }`}>
//                               {user.status}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {user.moodEntries}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {new Date(user.lastActive).toLocaleDateString()}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => handleEditUser(user)}
//                                 className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                               >
//                                 <Eye className="w-4 h-4 text-blue-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleEditUser(user)}
//                                 className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                               >
//                                 <Edit className="w-4 h-4 text-green-600" />
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteUser(user)}
//                                 className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
//                               >
//                                 <Trash2 className="w-4 h-4 text-red-600" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Mood Entries Tab */}
//           {activeTab === "mood-entries" && (
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//               <div className="space-y-4">
//                 {mockMoodEntries.map((entry) => (
//                   <div key={entry.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <div className={`p-2 rounded-full ${getMoodColor(entry.mood)}`}>
//                           <span className="text-xl">{getMoodEmoji(entry.mood)}</span>
//                         </div>
//                         <div>
//                           <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{entry.userName}</p>
//                           <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <div className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           entry.sentiment === "positive" ? "bg-green-100 text-green-700" :
//                           entry.sentiment === "negative" ? "bg-red-100 text-red-700" :
//                           "bg-gray-100 text-gray-700"
//                         }`}>
//                           {entry.sentiment}
//                         </div>
//                         <button className="p-1 hover:bg-gray-200 rounded-lg">
//                           <MoreVertical className="w-4 h-4 text-gray-500" />
//                         </button>
//                       </div>
//                     </div>
//                     <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-3`}>{entry.note}</p>
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center gap-1">
//                         {[1, 2, 3, 4, 5].map(i => (
//                           <div
//                             key={i}
//                             className={`w-2 h-2 rounded-full ${i <= entry.intensity ? 'bg-purple-500' : 'bg-gray-300'}`}
//                           />
//                         ))}
//                         <span className="text-xs text-gray-500 ml-1">Intensity: {entry.intensity}/5</span>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <Sparkles className="w-4 h-4 text-purple-600" />
//                         <span className="text-xs text-gray-500">Sentiment Score: {(entry.sentimentScore * 100).toFixed(0)}%</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Activity Logs Tab */}
//           {activeTab === "activity-logs" && (
//             <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//               <div className="space-y-4">
//                 {mockActivityLogs.map((log) => (
//                   <div key={log.id} className={`flex items-start gap-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
//                     <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
//                       <Activity className="w-5 h-5 text-purple-600" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between mb-1">
//                         <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
//                           {log.userName}
//                         </p>
//                         <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</p>
//                       </div>
//                       <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{log.action}</p>
//                       <p className="text-xs text-gray-500 mt-1">{log.details}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Settings Tab */}
//           {activeTab === "settings" && (
//             <div className="space-y-6">
//               <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6`}>
//                 <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
//                   System Settings
//                 </h2>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</p>
//                       <p className="text-sm text-gray-500">Toggle dark/light theme</p>
//                     </div>
//                     <button
//                       onClick={() => setDarkMode(!darkMode)}
//                       className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-300'}`}
//                     >
//                       <motion.div
//                         className="absolute top-1 w-4 h-4 bg-white rounded-full"
//                         animate={{ x: darkMode ? 24 : 4 }}
//                       />
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Email Notifications</p>
//                       <p className="text-sm text-gray-500">Receive system alerts via email</p>
//                     </div>
//                     <button className="relative w-12 h-6 rounded-full bg-purple-600">
//                       <motion.div className="absolute top-1 w-4 h-4 bg-white rounded-full" animate={{ x: 24 }} />
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center justify-between p-4 border rounded-lg">
//                     <div>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Auto Risk Detection</p>
//                       <p className="text-sm text-gray-500">Automatically flag at-risk users</p>
//                     </div>
//                     <button className="relative w-12 h-6 rounded-full bg-purple-600">
//                       <motion.div className="absolute top-1 w-4 h-4 bg-white rounded-full" animate={{ x: 24 }} />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </main>
//       </div>

//       {/* User Modal */}
//       <AnimatePresence>
//         {showUserModal && selectedUser && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowUserModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>User Details</h2>
//                   <button onClick={() => setShowUserModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>
                
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
//                       <span className="text-2xl text-white font-bold">{selectedUser.name.charAt(0)}</span>
//                     </div>
//                     <div>
//                       <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.name}</h3>
//                       <p className="text-sm text-gray-500">{selectedUser.email}</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-xs text-gray-500">Role</p>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.role}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Status</p>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} capitalize`}>{selectedUser.status}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Mood Entries</p>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.moodEntries}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500">Join Date</p>
//                       <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedUser.joinDate}</p>
//                     </div>
//                   </div>
                  
//                   <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
//                     Edit User
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Delete Confirmation Modal */}
//       <AnimatePresence>
//         {showDeleteModal && userToDelete && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
//             onClick={() => setShowDeleteModal(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-md w-full p-6`}
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="text-center">
//                 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <AlertCircle className="w-8 h-8 text-red-600" />
//                 </div>
//                 <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
//                   Delete User
//                 </h2>
//                 <p className="text-gray-500 mb-6">
//                   Are you sure you want to delete {userToDelete.name}? This action cannot be undone.
//                 </p>
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setShowDeleteModal(false)}
//                     className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={confirmDeleteUser}
//                     className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }