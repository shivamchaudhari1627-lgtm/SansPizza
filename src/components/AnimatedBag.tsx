import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBag = () => {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#DAA520" 
          strokeWidth="2" 
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 drop-shadow-[0_0_8px_rgba(218,165,32,0.8)]"
        >
          {/* Bag Body */}
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" 
          />
          {/* Top Line */}
          <motion.line 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            x1="3" y1="6" x2="21" y2="6" 
          />
          {/* Handle */}
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            d="M16 10a4 4 0 0 1-8 0" 
          />
        </svg>

        {/* Futuristic Scanning Line */}
        <motion.div 
          className="absolute left-[15%] right-[15%] h-[2px] bg-white rounded-full shadow-[0_0_10px_#fff]"
          animate={{ y: [0, 20, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
          style={{ top: "4px" }}
        />
        
        {/* Floating aesthetic particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#DAA520] rounded-full"
            initial={{ opacity: 0, scale: 0, x: 0, y: 15 }}
            animate={{ 
              opacity: [0, 1, 0], 
              scale: [0, 1.5, 0],
              y: [-10 * i, -20 * i - 10]
            }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
            style={{ left: `${30 + i * 20}%` }}
          />
        ))}
      </motion.div>
      <motion.span 
        initial={{ opacity: 0, filter: "blur(4px)", x: -10 }}
        animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="font-bold text-[#DAA520] tracking-widest uppercase text-sm drop-shadow-[0_0_2px_rgba(218,165,32,0.8)]"
      >
        Menu Ready
      </motion.span>
    </div>
  );
};

export default AnimatedBag;
