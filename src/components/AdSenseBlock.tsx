import React, { useEffect, useRef } from 'react';

interface AdSenseBlockProps {
  className?: string;
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export function AdSenseBlock({ 
  className = "", 
  slotId = "1234567890", // Placeholder slot ID, user can replace if needed
  format = "auto", 
  responsive = true 
}: AdSenseBlockProps) {
  const isLoaded = useRef(false);

  const [isInIframe, setIsInIframe] = React.useState(false);

  useEffect(() => {
    let inIframe = false;
    try {
      inIframe = window.self !== window.top;
    } catch (e) {
      inIframe = true;
    }
    setIsInIframe(inIframe);

    if (!isLoaded.current && !inIframe) {
      isLoaded.current = true;
      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.error('AdSense error', e);
      }
    }
  }, []);

  if (isInIframe) {
    return (
      <div className={`overflow-hidden flex flex-col justify-center items-center text-slate-400 text-sm ${className}`}>
        <span>Ad Placeholder</span>
        <span className="text-xs opacity-70">(Hidden in Preview)</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden flex justify-center items-center ${className}`}>
      <ins 
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-2166123231960021"
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
