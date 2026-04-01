"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";

export default function AnimatedSignUp() {
  const canvasRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  // Error timeout
  const errorTimeout = useRef(null);

  // Show error message
  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setShowError(true);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => {
      setShowError(false);
      setTimeout(() => setErrorMessage(""), 300);
    }, 5000);
  };

  // Particle animation effect (same as login page)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle
        ctx.fillStyle = "rgba(139, 92, 246, 0.5)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (errorTimeout.current) clearTimeout(errorTimeout.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (showError) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Validate Name (minimum 3 characters)
    if (formData.name.trim().length < 3) {
      showErrorMessage("Please enter your full name (at least 3 characters)");
      return;
    }

    // 2️⃣ Email Domain Validation - Must be @gmail.com
    if (!formData.email.endsWith("@gmail.com")) {
      showErrorMessage("Please use a valid Gmail address (must end with @gmail.com)");
      return;
    }

    // 3️⃣ Phone Number Validation - Trusted person's phone number (10 digits)
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      showErrorMessage("Trusted person's phone number must be exactly 10 digits");
      return;
    }

    // 4️⃣ Password Strength Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      showErrorMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character (@$!%*?&)"
      );
      return;
    }

    // 5️⃣ Confirm Password Match
    if (formData.password !== formData.confirmPassword) {
      showErrorMessage("Passwords do not match. Please try again.");
      return;
    }

    // Proceed with registration
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showErrorMessage(data.message || "Registration failed. Please try again.");
      } else {
        alert("Registration successful 🎉");
        window.location.href = "/SignInpage";
      }
    } catch (error) {
      console.error("Registration error:", error);
      showErrorMessage("Network error. Please check your connection and try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 overflow-hidden">
      {/* Error Toast Notification */}
      {showError && errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -100, x: "-50%" }}
          animate={{ opacity: 1, y: 20, x: "-50%" }}
          exit={{ opacity: 0, y: -100, x: "-50%" }}
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 transform"
        >
          <div className="flex items-start gap-3 rounded-xl border border-red-400 bg-red-500/90 px-4 py-3 shadow-lg backdrop-blur-md">
            <div className="p-1 bg-red-600 rounded-full">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm text-white flex-1">{errorMessage}</p>
            <button
              onClick={() => setShowError(false)}
              className="p-1 hover:bg-red-600 rounded-lg transition-colors"
            >
              <EyeOff className="w-4 h-4 text-white" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ filter: "blur(2px)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-lg sm:p-8"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block p-4 bg-purple-600/30 rounded-full mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">Create Account</h2>
            <p className="text-white/60">Join us to start your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Full Name <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4
                           text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500
                           transition-colors"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <p className="text-xs text-white/40 mt-1">Minimum 3 characters</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Email Address <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4
                           text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500
                           transition-colors"
                  placeholder="yourname@gmail.com"
                  required
                />
              </div>
              <p className="text-xs text-white/40 mt-1">Must be a valid Gmail address (@gmail.com)</p>
            </div>

            {/* Trusted Person's Phone Number */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Trusted Person&apos;s Phone Number <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4
                           text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500
                           transition-colors"
                  placeholder="Enter trusted person's 10-digit phone number"
                  required
                />
              </div>
              <p className="text-xs text-white/40 mt-1">
                This person will be contacted in case of emergency. Must be exactly 10 digits.
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Password <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12
                           text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500
                           transition-colors"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password <span className="text-purple-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12
                           text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500
                           transition-colors"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
              <p className="text-xs font-semibold text-white/60 mb-2">Password Requirements:</p>
              <ul className="text-xs text-white/40 space-y-1">
                <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-400' : ''}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  At least 8 characters
                </li>
                <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-400' : ''}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  At least one uppercase letter
                </li>
                <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-400' : ''}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  At least one number
                </li>
                <li className={`flex items-center gap-2 ${/[@$!%*?&]/.test(formData.password) ? 'text-green-400' : ''}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  At least one special character (@$!%*?&)
                </li>
              </ul>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="rounded bg-white/5 border-white/10 text-purple-600 focus:ring-purple-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-white/60">
                I agree to the{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Sign Up Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg
                       font-semibold mt-6 hover:shadow-lg transition-all"
            >
              Sign Up
            </motion.button>

            {/* Sign In Link */}
            <p className="text-center text-white/60 mt-4">
              Already have an account?{" "}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-semibold">
                Sign in
              </a>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
