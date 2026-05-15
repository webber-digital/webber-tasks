import React from 'react';

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="100" height="100" rx="22" fill="white" />
      
      {/* Left side of W (outline) */}
      <path 
        d="M22 28 L38 80 L56 46 L46 28 Z" 
        stroke="#CBD5E1" 
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="white"
      />
      
      {/* Small top caps for the outline */}
      <path 
        d="M20 28 L32 28 M43 28 L52 28" 
        stroke="#CBD5E1" 
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M26 28 L46 28" stroke="white" strokeWidth="5" />

      {/* Right side checkmark */}
      <path 
        d="M49 52 L61 76 L84 28 L71 28 L57 58 L49 52 Z"
        fill="#FACC15"
        stroke="#FACC15"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
    </svg>
  );
}
