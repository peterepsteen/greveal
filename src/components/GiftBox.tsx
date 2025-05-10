'use client';

import { motion } from 'framer-motion';

interface GiftBoxProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function GiftBox({ onClick, isOpen }: GiftBoxProps) {
  return (
    <motion.div
      className="relative cursor-pointer select-none mt-32"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="text-[200px]"
        animate={{
          rotate: isOpen ? [0, 10, -10, 0] : 0,
          y: isOpen ? -20 : 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        🎁
      </motion.div>
    </motion.div>
  );
} 