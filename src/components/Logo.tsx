import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="#040b1c" />
      <circle cx="50" cy="50" r="50" fill="url(#bgGrad)" opacity="0.3" />
      
      {/* Glow Effect */}
      <path 
        d="M 24 38 L 38 74 L 50 48 L 60 74 L 84 34" 
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
        d="M 24 38 L 38 74 L 50 48 L 60 74 L 84 34" 
        stroke="url(#blueGrad)" 
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round" 
      />

      {/* Fold details to make it look like continuous ribbon from user's image */}
      <path 
        d="M 38 74 L 50 48 L 60 74 L 84 34" 
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

