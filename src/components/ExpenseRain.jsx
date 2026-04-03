'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Receipt, TrendingDown, Minus } from 'lucide-react';

export default function ExpenseRain() {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    // We generate these on the client side so they don't cause Next.js hydration errors
    const generatedElements = Array.from({ length: 20 }).map((_, i) => {
      const types = ['receipt', 'arrow', 'minus'];
      return {
        id: i,
        x: Math.random() * 100, // Random horizontal position (0-100vw)
        delay: Math.random() * 5, // Random start time
        duration: 6 + Math.random() * 6, // Random fall speed
        size: 16 + Math.random() * 24, // Random size
        type: types[Math.floor(Math.random() * types.length)], // Random icon
        rotation: Math.random() * 360,
      };
    });
    setElements(generatedElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ 
            y: -100, 
            x: `${el.x}vw`, 
            opacity: 0, 
            rotate: el.rotation 
          }}
          animate={{
            y: '100vh',
            opacity: [0, 1, 0.8, 0], // Fades in, then fades out at the bottom
            rotate: el.rotation + (Math.random() > 0.5 ? 180 : -180) // Spins slowly
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute"
        >
          {/* Render the correct icon based on random type */}
          {el.type === 'receipt' && <Receipt className="text-rose-500/20" size={el.size} />}
          {el.type === 'arrow' && <TrendingDown className="text-orange-500/20" size={el.size} />}
          {el.type === 'minus' && <Minus className="text-red-500/30" size={el.size} />}
        </motion.div>
      ))}
    </div>
  );
}