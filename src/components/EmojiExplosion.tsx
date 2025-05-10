'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const emojis = [
  '⚽', '🏀', '🏈', '⚾', '🏉', '🍆',
  '👶', '💙', '🧢', '🚙', '🍆',
  '💙', '🎉', '🎊', '💙',
  '🏎️', '🍆', '🐳', '🧢', '💙',
  '💪', '🌭'
];

interface EmojiBurst {
  id: number;
  created: number;
  isInitial?: boolean;
}

interface EmojiExplosionProps {
  origin: { x: number; y: number };
  showMessage?: boolean;
}

const BURST_INTERVAL = 2250; // ms
const EMOJIS_PER_BURST = 30;
const INITIAL_EMOJIS = 30; // Special initial burst
const EMOJI_LIFETIME = 15000; // ms

export default function EmojiExplosion({ origin, showMessage }: EmojiExplosionProps) {
  const [bursts, setBursts] = useState<EmojiBurst[]>([]);
  const burstId = useRef(0);
  const hasInitialBurst = useRef(false);

  // Start emitting bursts when showMessage is true
  useEffect(() => {
    if (!showMessage) return;
    
    // Add initial burst with more emojis
    if (!hasInitialBurst.current) {
      setBursts([{ id: burstId.current++, created: Date.now(), isInitial: true }]);
      hasInitialBurst.current = true;
    }
    
    const interval = setInterval(() => {
      setBursts((prev) => [
        ...prev,
        { id: burstId.current++, created: Date.now() },
      ]);
    }, BURST_INTERVAL);
    return () => clearInterval(interval);
  }, [showMessage]);

  // Remove old bursts less frequently
  useEffect(() => {
    const timeout = setInterval(() => {
      setBursts((prev) => prev.filter(b => Date.now() - b.created < EMOJI_LIFETIME));
    }, 2000);
    return () => clearInterval(timeout);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {bursts.map((burst) => {
        // Each burst sprays emojis upward with some spread
        const numEmojis = burst.isInitial ? INITIAL_EMOJIS : EMOJIS_PER_BURST;
        const burstEmojis = Array.from({ length: numEmojis }, (_, i) => {
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          // Create a spread angle between -45 and 45 degrees for initial burst, -30 to 30 for others
          const maxAngle = burst.isInitial ? 45 : 30;
          const angle = -maxAngle + (i * (maxAngle * 2)) / (numEmojis - 1);
          const distance = burst.isInitial ? 1000 + Math.random() * 300 : 800 + Math.random() * 200;
          const x = Math.sin((angle * Math.PI) / 180) * distance;
          const y = -Math.cos((angle * Math.PI) / 180) * distance;
          const rotation = Math.random() * 360;
          const delay = Math.random() * (burst.isInitial ? 0.6 : 0.4);
          return (
            <motion.div
              key={burst.id + '-' + i}
              className="absolute text-4xl"
              initial={{ x: origin.x, y: origin.y, opacity: 1, rotate: 0 }}
              animate={{
                x: origin.x + x,
                y: origin.y + y,
                opacity: 0,
                rotate: rotation,
              }}
              transition={{
                duration: EMOJI_LIFETIME / 1000,
                delay,
                ease: [0.2, 0.8, 0.2, 1],
                opacity: {
                  duration: EMOJI_LIFETIME / 1000,
                  delay: (EMOJI_LIFETIME / 1000) * 0.8,
                }
              }}
              style={{ left: 0, top: 0 }}
            >
              {emoji}
            </motion.div>
          );
        });
        return burstEmojis;
      })}
    </div>
  );
} 