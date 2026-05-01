"use client";

import { motion } from "framer-motion";

const stars = [
  { top: "8%", left: "12%", size: 2.5, delay: 0.2, duration: 3.8 },
  { top: "14%", left: "76%", size: 3.5, delay: 1.1, duration: 4.6 },
  { top: "19%", left: "58%", size: 2.5, delay: 2.2, duration: 5.1 },
  { top: "24%", left: "28%", size: 2.5, delay: 0.7, duration: 4.2 },
  { top: "31%", left: "88%", size: 2.5, delay: 1.8, duration: 3.9 },
  { top: "36%", left: "8%", size: 4, delay: 0.4, duration: 4.8 },
  { top: "42%", left: "67%", size: 2.5, delay: 2.7, duration: 5.4 },
  { top: "48%", left: "21%", size: 2.5, delay: 1.5, duration: 4.1 },
  { top: "53%", left: "82%", size: 3.5, delay: 0.9, duration: 4.9 },
  { top: "59%", left: "42%", size: 2.5, delay: 2.1, duration: 5.6 },
  { top: "64%", left: "14%", size: 2.5, delay: 0.3, duration: 4.4 },
  { top: "69%", left: "73%", size: 2.5, delay: 1.6, duration: 3.7 },
  { top: "74%", left: "54%", size: 4, delay: 2.5, duration: 5.2 },
  { top: "81%", left: "30%", size: 2.5, delay: 1.2, duration: 4.3 },
  { top: "86%", left: "91%", size: 2.5, delay: 0.6, duration: 4.7 },
  { top: "11%", left: "45%", size: 2, delay: 2.9, duration: 5.3 },
  { top: "27%", left: "48%", size: 2, delay: 1.9, duration: 3.6 },
  { top: "46%", left: "94%", size: 2, delay: 0.5, duration: 4.5 },
  { top: "62%", left: "61%", size: 2, delay: 2.4, duration: 5.5 },
  { top: "78%", left: "6%", size: 2, delay: 1.4, duration: 4.0 },
  { top: "17%", left: "22%", size: 4.5, delay: 0.8, duration: 4.4 },
  { top: "33%", left: "51%", size: 3, delay: 2.6, duration: 5.0 },
  { top: "57%", left: "90%", size: 4, delay: 1.7, duration: 4.2 },
  { top: "72%", left: "39%", size: 3, delay: 0.9, duration: 5.1 },
  { top: "89%", left: "18%", size: 4.5, delay: 2.3, duration: 4.6 },
];

export default function StarfieldBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((star, index) => (
        <motion.span
          key={`${star.top}-${star.left}-${index}`}
          className="absolute rounded-full bg-white"
          initial={{ opacity: 0.35, scale: 0.9 }}
          animate={{
            opacity: [0.35, 1, 0.45],
            scale: [0.9, 1.45, 1],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: "0 0 18px rgba(255,255,255,0.95), 0 0 30px rgba(191,219,254,0.5)",
          }}
        />
      ))}
    </div>
  );
}
