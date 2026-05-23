import React from 'react';
import { motion } from 'motion/react';

export function Logo({ className = "w-8 h-8", animated = false }: { className?: string, animated?: boolean }) {
  const pathData = "M 25 35 L 38 75 L 50 35 L 62 75 L 75 35"; // perfectly scaled for 100x100
  
  if (animated) {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <rect width="100" height="100" rx="25" fill="#080B14" />
        
        {/* Glow Effect */}
        <motion.path 
          d={pathData}
          stroke="#00E5FF" 
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="blur(5px)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Outer Stroke */}
        <motion.path 
          d={pathData}
          stroke="#00B8D9" 
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Inner Stroke (Neon) */}
        <motion.path 
          d={pathData}
          stroke="#B3FCFF" 
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />
      </svg>
    );
  }

  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="25" fill="#080B14" />
      
      {/* Glow Effect */}
      <path 
        d={pathData}
        stroke="#00E5FF" 
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
        filter="blur(5px)"
      />

      {/* Outer Stroke */}
      <path 
        d={pathData}
        stroke="#00B8D9" 
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round" 
      />

      {/* Inner Stroke (Neon) */}
      <path 
        d={pathData}
        stroke="#B3FCFF" 
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round" 
      />
    </svg>
  );
}

