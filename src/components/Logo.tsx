import React from 'react';

import { motion } from 'motion/react';

export function Logo({ className = "w-8 h-8", animated = false }: { className?: string, animated?: boolean }) {
  const pathData = "M 24 38 L 38 74 L 50 48 L 60 74 L 84 34";
  
  if (animated) {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Removed Background Circle for transparent web logo */}
        
        {/* Glow Effect */}
        <motion.path 
          d={pathData}
          stroke="#00A3FF" 
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="blur(6px)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Main Logo Path (W + Checkmark) */}
        <motion.path 
          d={pathData}
          stroke="url(#blueGrad)" 
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        {/* Fold details */}
        <motion.path 
          d={pathData}
          stroke="url(#blueGradLight)" 
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round" 
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
        />

        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100">
            <stop stopColor="#0033aa"/>
            <stop offset="1" stopColor="#000000" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="blueGrad" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0055ff"/>
            <stop offset="0.5" stopColor="#00aaff"/>
            <stop offset="1" stopColor="#00d2ff"/>
          </linearGradient>
          <linearGradient id="blueGradLight" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#66aaff"/>
            <stop offset="1" stopColor="#b3e5ff"/>
          </linearGradient>
        </defs>
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
      {/* Removed Background Circle for transparent web logo */}
      
      {/* Glow Effect */}
      <path 
        d={pathData}
        stroke="#00A3FF" 
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
        filter="blur(6px)"
      />

      {/* Main Logo Path (W + Checkmark) */}
      <path 
        d={pathData}
        stroke="url(#blueGrad)" 
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round" 
      />

      {/* Fold details to make it look like continuous ribbon from user's image */}
      <path 
        d={pathData}
        stroke="url(#blueGradLight)" 
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round" 
        opacity="0.8"
      />

      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100">
          <stop stopColor="#0033aa"/>
          <stop offset="1" stopColor="#000000" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0055ff"/>
          <stop offset="0.5" stopColor="#00aaff"/>
          <stop offset="1" stopColor="#00d2ff"/>
        </linearGradient>
        <linearGradient id="blueGradLight" x1="20" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop stopColor="#66aaff"/>
          <stop offset="1" stopColor="#b3e5ff"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

