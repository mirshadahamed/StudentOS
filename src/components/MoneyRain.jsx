'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MoneyRain() {
  const [mounted, setMounted] = useState(false);
  const [drops, setDrops] = useState([]);

  useEffect(() => {
    const newDrops = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: Math.random() * 4 + 4, 
      animationDelay: Math.random() * 5, 
      opacity: Math.random() * 0.6 + 0.2,
      size: Math.random() * 24 + 16, 
      symbol: ['💵', '💸', '💰', '🪙', '💹'][Math.floor(Math.random() * 5)]
    }));
    
    setDrops(newDrops);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          initial={{ y: -100, rotate: 0 }}
          animate={{ y: '120vh', rotate: 360 }}
          transition={{ 
            duration: drop.animationDuration, 
            delay: drop.animationDelay, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute drop-shadow-2xl"
          style={{ 
            left: drop.left, 
            opacity: drop.opacity, 
            fontSize: `${drop.size}px` 
          }}
        >
          {drop.symbol}
        </motion.div>
      ))}
    </div>
  );
}
