'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, Users, LogIn, LogOut, Smile, DollarSign, Calendar, Sparkles, Settings, Heart, ArrowRight, CheckCircle, Star, Zap, Shield } from 'lucide-react';

export default function HeroWithCards() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const featureTagClasses = {
    mood: "bg-[#4ADE80]/10 text-[#4ADE80]",
    finance: "bg-[#38BDF8]/10 text-[#38BDF8]",
    planning: "bg-[#2DD4BF]/10 text-[#2DD4BF]",
  };

  useEffect(() => {
    // Check if user is logged in and fetch user data
    const userId = localStorage.getItem('student_user_id');
    
    if (userId) {
      setIsLoggedIn(true);
      fetchUserData(userId);
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  }, []);

  const fetchUserData = async (userId) => {
    setIsLoadingUser(true);
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

  const getUserFirstName = () => {
    if (userData?.name) {
      return userData.name.split(' ')[0];
    }
    return 'Student';
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <main className="relative" onMouseMove={handleMouseMove}>
      {/* Header with Logo and User Profile Button */}
      <div className="absolute top-0 left-0 right-0 z-20 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-lg shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Sparkles className="w-6 h-6 text-white relative z-10" />
            </div>
            <h1 className="text-xl font-bold text-white drop-shadow-lg sm:text-2xl bg-gradient-to-r from-white to-[#4ADE80] bg-clip-text text-transparent">
              StudentOS
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3"
          >
            {isLoggedIn ? (
              <Link href="/Profile">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative flex items-center gap-3 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all rounded-full px-4 py-2 sm:px-5 sm:py-2.5 border border-white/20"
                >
                  {/* Avatar/Icon */}
                  <div className="relative">
                    <div className="p-1.5 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full">
                      {userData?.profileImage ? (
                        <Image
                          src={userData.profileImage}
                          alt={userData.name}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-white sm:w-5 sm:h-5" />
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#22C55E] rounded-full border-2 border-[#0F172A] animate-pulse" />
                  </div>
                  
                  {/* User Info */}
                  <div className="text-left">
                    {isLoadingUser ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-white/50 rounded-full animate-pulse" />
                        <div className="w-12 h-3 bg-white/50 rounded animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-white/70">Welcome back,</p>
                        <p className="text-sm font-semibold text-white">
                          {getUserFirstName()}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {/* Arrow indicator */}
                  <svg 
                    className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  
                  {/* Hover effect ring */}
                  <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                </motion.button>
              </Link>
            ) : (
              <Link href="/SignInpage">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all rounded-full px-4 py-2 text-white text-sm font-medium border border-white/20"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.div
          animate={{
            scale: 1.05,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="absolute inset-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Student studying with laptop"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#022C22]/90 via-[#0F172A]/85 to-[#020617]/90" />
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #22C55E 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#22C55E] rounded-full"
              initial={{
                y: 0,
                opacity: 0,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3 + (i % 5),
                repeat: Infinity,
                delay: i * 0.25,
                ease: "linear",
              }}
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 23) % 100}%`,
              }}
            />
          ))}
        </div>

        {/* Mouse Follow Glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 100,
          }}
          style={{
            background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pb-10 pt-28 text-center text-white sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl px-2 sm:px-4"
          >
            {/* Animated Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#22C55E] rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative flex items-center gap-2 px-4 py-2 bg-[#22C55E]/20 backdrop-blur-md rounded-full border border-[#22C55E]/30">
                  <Sparkles className="w-4 h-4 text-[#22C55E] animate-pulse" />
                  <span className="text-sm font-medium text-white">AI-Powered Student Platform</span>
                </div>
              </div>
            </motion.div>

            {/* Main Title with Enhanced Animation */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mb-6"
            >
              <h1 className="text-5xl font-bold leading-tight sm:text-6xl md:text-8xl">
                <span className="bg-gradient-to-r from-white via-[#4ADE80] to-[#22C55E] bg-clip-text text-transparent animate-gradient">
                  Your Personal
                </span>
                <br />
                <span className="relative inline-block mt-2">
                  <span className="bg-gradient-to-r from-[#22C55E] via-[#4ADE80] to-[#22C55E] bg-clip-text text-transparent animate-gradient">
                    Student OS
                  </span>
                  {/* Animated underline */}
                  <motion.div
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] to-[#4ADE80] rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </span>
              </h1>
            </motion.div>

            {/* Animated Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              {[
                { value: "10K+", label: "Active Students", icon: Users },
                { value: "98%", label: "Satisfaction Rate", icon: Star },
                { value: "24/7", label: "AI Support", icon: Zap },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
                  >
                    <Icon className="w-4 h-4 text-[#22C55E]" />
                    <span className="font-bold text-white">{stat.value}</span>
                    <span className="text-sm text-white/70">{stat.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8 max-w-2xl px-2 text-base text-white/90 sm:px-4 sm:text-lg md:text-xl"
            >
              Track your mood, manage finances, and plan your future — all in one intelligent platform designed for students.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#cards-section"
                className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[#22C55E] hover:bg-[#16A34A] px-8 py-3 text-base font-semibold text-white transition-all hover:shadow-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Get Started Free</span>
                <ArrowRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
              </motion.a>
              
              {/* <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 hover:border-[#22C55E] bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-3 text-base font-semibold text-white transition-all"
              >
                Watch Demo
                <Play className="w-4 h-4" />
              </motion.a> */}
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-2 bg-[#22C55E] rounded-full mt-2"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Rest of the component remains the same */}
      {/* Cards Section */}
      <section
        id="cards-section"
        className="bg-[#0F172A] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4 text-3xl font-bold bg-gradient-to-r from-[#22C55E] to-[#4ADE80] bg-clip-text text-transparent sm:text-4xl">
              Your Complete Student Toolkit
            </h2>
            <p className="text-[#9CA3AF] max-w-2xl mx-auto">
              Everything you need to thrive in your academic journey, all in one place
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                icon: Smile, 
                title: "Mood Tracker", 
                description: "Track your emotions and mental wellness. Get insights and personalized recommendations.",
                href: "/MoodLogin",
                gradient: "from-[#22C55E] to-[#16A34A]",
                bgGradient: "from-[#4ADE80]/5 to-[#22C55E]/5",
                features: ["Daily check-ins", "Mood patterns", "Wellness tips"],
                accentColor: "#22C55E",
                accentLight: "#4ADE80",
                tagColor: "mood",
                iconBg: "from-[#22C55E] to-[#16A34A]"
              },
              { 
                icon: DollarSign, 
                title: "Smart Finance", 
                description: "Take control of your finances with intelligent budgeting and expense tracking.",
                href: "/finance",
                gradient: "from-[#38BDF8] to-[#14B8A6]",
                bgGradient: "from-[#38BDF8]/5 to-[#14B8A6]/5",
                features: ["Budget planner", "Expense tracking", "Savings goals"],
                accentColor: "#38BDF8",
                accentLight: "#14B8A6",
                tagColor: "finance",
                iconBg: "from-[#38BDF8] to-[#14B8A6]"
              },
              { 
                icon: Calendar, 
                title: "Smart Planning", 
                description: "Organize your academic life with intelligent scheduling and goal setting.",
                href: "/productivity",
                gradient: "from-[#2DD4BF] to-[#A78BFA]",
                bgGradient: "from-[#2DD4BF]/5 to-[#A78BFA]/5",
                features: ["Task management", "Goal tracking", "Study planner"],
                accentColor: "#2DD4BF",
                accentLight: "#A78BFA",
                tagColor: "planning",
                iconBg: "from-[#2DD4BF] to-[#A78BFA]"
              },
            ].map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={card.href}>
                    <div
                      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#1F2937] p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 border border-[#374151] sm:p-8"
                      style={{
                        boxShadow: `0 0 0 0 ${card.accentColor}20`,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 30px ${card.accentColor}40`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 0 transparent';
                      }}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Decorative circle */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                      
                      <div className="relative z-10">
                        {/* Icon with animated gradient */}
                        <div className={`mb-6 inline-block p-3 rounded-2xl bg-gradient-to-br ${card.iconBg} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="mb-3 text-xl font-bold text-[#E5E7EB] sm:text-2xl">
                          {card.title}
                        </h3>
                        
                        <p className="text-[#9CA3AF] mb-4 leading-relaxed">
                          {card.description}
                        </p>
                        
                        {/* Feature tags with accent colors */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {card.features.map((feature, i) => (
                            <span
                              key={i}
                              className={`rounded-full px-2 py-1 text-xs font-medium ${featureTagClasses[card.tagColor]}`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Arrow indicator with accent color on hover */}
                        <div className="flex items-center gap-2 text-transparent group-hover:text-[${card.accentColor}] transition-all duration-300">
                          <span className="text-sm font-semibold">Explore now</span>
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* How It Works Section */}
          <motion.div
            id="how-it-works"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="text-center text-3xl font-bold text-[#E5E7EB] mb-4">
              How It Works
            </h2>
            <p className="text-center text-[#9CA3AF] mb-12 max-w-2xl mx-auto">
              Simple, intuitive, and designed for students
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Track Your Mood",
                  description: "Log your daily emotions and get personalized insights to improve your mental wellness.",
                  icon: Smile,
                  accentColor: "#22C55E"
                },
                {
                  step: "02",
                  title: "Manage Your Finances",
                  description: "Create budgets, track expenses, and reach your savings goals with ease.",
                  icon: DollarSign,
                  accentColor: "#38BDF8"
                },
                {
                  step: "03",
                  title: "Plan Your Future",
                  description: "Set goals, organize tasks, and stay on top of your academic journey.",
                  icon: Calendar,
                  accentColor: "#2DD4BF"
                }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-6 rounded-2xl bg-[#1F2937] border border-[#374151] hover:border-[#22C55E]/50 transition-all duration-300"
                    style={{
                      transition: 'all 0.3s ease',
                      borderColor: `#374151`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = `${item.accentColor}80`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#374151';
                    }}
                  >
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-xl mb-4 border"
                      style={{
                        backgroundColor: `${item.accentColor}10`,
                        color: item.accentColor,
                        borderColor: `${item.accentColor}30`
                      }}
                    >
                      {item.step}
                    </div>
                    <div 
                      className="mb-4 inline-flex p-3 rounded-xl"
                      style={{
                        backgroundColor: `${item.accentColor}10`
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.accentColor }} />
                    </div>
                    <h3 className="text-xl font-semibold text-[#E5E7EB] mb-2">{item.title}</h3>
                    <p className="text-[#9CA3AF] text-sm">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Additional CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-gradient-to-r from-[#022C22] to-[#0F172A] rounded-2xl p-6 text-white border border-[#22C55E]/20 sm:p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#22C55E]/10 via-transparent to-transparent" />
              <div className="relative z-10">
                <h3 className="mb-3 text-2xl font-bold md:text-3xl text-[#E5E7EB]">
                  Ready to transform your student life?
                </h3>
                <p className="text-[#9CA3AF] mb-6 max-w-2xl mx-auto">
                  Join thousands of students who are already using StudentOS to achieve their goals
                </p>
                <Link href="/MoodLogin">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative overflow-hidden rounded-full bg-[#22C55E] hover:bg-[#16A34A] px-8 py-3 font-semibold text-white transition-all hover:shadow-xl"
                  >
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative">Start Your Journey</span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

// Add missing Play icon import
const Play = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
