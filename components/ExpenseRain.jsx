'use client';
/* eslint-disable react-hooks/purity */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Receipt, TrendingDown, Minus } from 'lucide-react';

export default function ExpenseRain() {
  const isClient = typeof window !== 'undefined';
  const elements = useMemo(() => {
    if (!isClient) return [];

    return Array.from({ length: 20 }).map((_, i) => {
      const types = ['receipt', 'arrow', 'minus'];
      return {
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 6 + Math.random() * 6,
        size: 16 + Math.random() * 24,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
        spin: Math.random() > 0.5 ? 180 : -180,
      };
    });
  }, [isClient]);

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
            opacity: [0, 1, 0.8, 0],
            rotate: el.rotation + el.spin
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
