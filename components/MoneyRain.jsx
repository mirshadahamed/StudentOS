'use client';

import React, { useMemo } from 'react';

const SYMBOLS = ['$', 'LKR', 'Rs', '💸', '💰', '🪙'];

export default function MoneyRain() {
  const drops = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        left: `${4 + i * 6}%`,
        delay: `${(i % 6) * 0.9}s`,
        duration: `${8 + (i % 4) * 1.5}s`,
        opacity: 0.16 + (i % 3) * 0.06,
        size: `${18 + (i % 4) * 6}px`,
        symbol: SYMBOLS[i % SYMBOLS.length],
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="absolute top-[-10%] font-black tracking-wider text-emerald-300 animate-[finance-fall_linear_infinite]"
          style={{
            left: drop.left,
            opacity: drop.opacity,
            fontSize: drop.size,
            animationDelay: drop.delay,
            animationDuration: drop.duration,
            textShadow: '0 0 28px rgba(16,185,129,0.3)',
            filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.2))',
          }}
        >
          {drop.symbol}
        </span>
      ))}
      <style jsx>{`
        @keyframes finance-fall {
          0% {
            transform: translate3d(0, -12vh, 0) rotate(0deg);
          }
          100% {
            transform: translate3d(0, 120vh, 0) rotate(18deg);
          }
        }
      `}</style>
    </div>
  );
}
