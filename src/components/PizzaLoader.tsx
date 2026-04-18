import React from 'react';
import { motion } from 'framer-motion';

const PizzaLoader = ({ size = 'large' }: { size?: 'small' | 'large' }) => {
  const containerSize = size === 'large' ? 'w-40 h-40' : 'w-20 h-20';
  
  // 6 slices
  const slices = Array.from({ length: 6 });

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <motion.div 
        className={`relative ${containerSize}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <defs>
            <clipPath id="pizza-slice">
              <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" />
            </clipPath>
          </defs>

          {slices.map((_, i) => {
            const rotation = i * 60;
            return (
              <motion.g
                key={i}
                style={{ transformOrigin: '50px 50px', transform: `rotate(${rotation}deg)` }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
              >
                {/* A single animated slice that gets "eaten" or placed */}
                <motion.g
                  animate={{ 
                    transform: ['translate(0px, 0px)', 'translate(5px, -5px)', 'translate(0px, 0px)'],
                    opacity: [1, 0.8, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.5,
                    times: [0, 0.5, 1]
                  }}
                >
                  <path d="M50 50 L50 0 A50 50 0 0 1 93.3 25 Z" fill="#eab308" stroke="#a16207" strokeWidth="1" />
                  {/* Crust */}
                  <path d="M50 0 A50 50 0 0 1 93.3 25 L88 30 A43 43 0 0 0 50 6 Z" fill="#ca8a04" />
                  {/* Cheese detail */}
                  <path d="M50 50 L50 6 A43 43 0 0 1 88 30 Z" fill="#facc15" />
                  
                  {/* Pepperonis */}
                  <circle cx="65" cy="20" r="4" fill="#dc2626" />
                  <circle cx="75" cy="35" r="3" fill="#b91c1c" />
                  <circle cx="60" cy="40" r="4.5" fill="#ef4444" />
                </motion.g>
              </motion.g>
            );
          })}
        </svg>
      </motion.div>

      <div className="flex flex-col items-center">
        <motion.h2 
          className="text-2xl font-serif font-bold text-[#8B4513]"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Firing up the oven...
        </motion.h2>
        <p className="text-sm text-[#8B4513]/70 mt-2 font-medium">Baking your experience</p>
      </div>
    </div>
  );
};

export default PizzaLoader;
