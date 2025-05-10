'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from '@/components/GiftBox';
import Countdown from '@/components/Countdown';
import EmojiExplosion from '@/components/EmojiExplosion';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [explosionOrigin, setExplosionOrigin] = useState({ x: 0, y: 0 });
  const boxRef = useRef<HTMLDivElement>(null);

  const handleGiftClick = () => {
    if (isOpen || showCountdown) return;
    
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setExplosionOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height * 0.2,
      });
    }
    
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setIsOpen(true);
    setTimeout(() => {
      setShowMessage(true);
    }, 100);
  };

  return (
    <motion.main 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      initial={{ background: 'linear-gradient(to bottom, rgb(255, 192, 203, 0.2), rgb(216, 191, 216, 0.2))' }}
      animate={{ 
        background: showMessage 
          ? 'linear-gradient(to bottom, rgb(147, 197, 253, 0.4), rgb(96, 165, 250, 0.4))'
          : 'linear-gradient(to bottom, rgb(255, 192, 203, 0.2), rgb(216, 191, 216, 0.2))'
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
    >
      <AnimatePresence mode="wait">
        {!showCountdown && !showMessage && (
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
              Gender Reveal
            </h1>
            <p className="text-xl md:text-2xl text-gray-600">
              Click the gift box to reveal the surprise!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={boxRef} className="relative">
        <GiftBox onClick={handleGiftClick} isOpen={isOpen} />
        <AnimatePresence mode="wait">
          {showCountdown && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Countdown onComplete={handleCountdownComplete} />
            </motion.div>
          )}
          {showMessage && (
            <motion.div
              key="message"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute -left-[200%] right-[-200%] top-[90%] text-8xl font-bold text-blue-600 whitespace-nowrap text-center"
            >
              It's a Boy! 👶
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showMessage && (
        <EmojiExplosion origin={explosionOrigin} showMessage={showMessage} />
      )}
    </motion.main>
  );
}
