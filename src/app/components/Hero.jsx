'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, LogIn, LogOut, Activity, TrendingUp, Smile, DollarSign, Calendar, Sparkles } from 'lucide-react';

export default function HeroWithCards() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('student_user_id');
    if (userId) {
      setIsLoggedIn(true);
      // You can fetch user name from your API if needed
      setUserName('Student');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('student_user_id');
    setIsLoggedIn(false);
    setUserName('');
    // Redirect to login page or refresh
    window.location.href = '/';
  };

  return (
    <main className="relative">
      {/* Header with Logo and Login Button */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">
            StudentOS
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2">
                <div className="p-1 bg-white/20 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-sm font-medium">Welcome, {userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all rounded-full px-4 py-2 text-white text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <Link href="/SignInpage">
              <button className="flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all rounded-full px-4 py-2 text-white text-sm font-medium">
                <LogIn className="w-4 h-4" />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen w-full">
        <Image
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Student studying with laptop"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-indigo-900/60 to-pink-900/70" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="px-4"
          >
            <div className="inline-block p-2 bg-white/20 backdrop-blur-md rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-4 text-5xl font-bold md:text-7xl bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Your Personal Student OS
            </h1>
            <p className="mb-8 max-w-2xl px-4 text-xl text-white/90">
              Track your mood, manage finances, and plan your future — all in one intelligent platform designed for students.
            </p>
            <a
              href="#cards-section"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
            >
              Get Started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section
        id="cards-section"
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 py-20 px-6"
      >
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Your Complete Student Toolkit
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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
                gradient: "from-purple-500 to-pink-500",
                bgGradient: "from-purple-50 to-pink-50",
                features: ["Daily check-ins", "Mood patterns", "Wellness tips"],
                color: "purple"
              },
              { 
                icon: DollarSign, 
                title: "Smart Finance", 
                description: "Take control of your finances with intelligent budgeting and expense tracking.",
                href: "/finance",
                gradient: "from-green-500 to-emerald-500",
                bgGradient: "from-green-50 to-emerald-50",
                features: ["Budget planner", "Expense tracking", "Savings goals"],
                color: "green"
              },
              { 
                icon: Calendar, 
                title: "Smart Planning", 
                description: "Organize your academic life with intelligent scheduling and goal setting.",
                href: "/planning",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient: "from-blue-50 to-cyan-50",
                features: ["Task management", "Goal tracking", "Study planner"],
                color: "blue"
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
                      className={`group relative overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer`}
                    >
                      {/* Background gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                      
                      {/* Decorative circle */}
                      <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${card.gradient} opacity-10 rounded-full group-hover:scale-150 transition-transform duration-500`} />
                      
                      <div className="relative z-10">
                        {/* Icon with animated gradient */}
                        <div className={`mb-6 inline-block p-3 rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="mb-3 text-2xl font-bold text-gray-900">
                          {card.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {card.description}
                        </p>
                        
                        {/* Feature tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {card.features.map((feature, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full bg-${card.color}-50 text-${card.color}-600 font-medium`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Arrow indicator on hover */}
                        <div className="flex items-center gap-2 text-transparent group-hover:text-purple-600 transition-all duration-300">
                          <span className="text-sm font-semibold">Explore now</span>
                          <svg 
                            className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Additional CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 md:p-12 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to transform your student life?
              </h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                Join thousands of students who are already using StudentOS to achieve their goals
              </p>
              <Link href="/MoodLogin">
                <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:scale-105">
                  Start Your Journey
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}