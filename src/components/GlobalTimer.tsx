import React, { useEffect } from 'react';
import { useStore } from '../store';

export function GlobalTimer() {
  const { timerState, timerConfig, setTimerState } = useStore();
  const { isActive, targetTime, timeLeft, mode } = timerState;
  const { soundEnabled, alarmType } = timerConfig;

  const playAlarmSound = (typeToPlay: 'beep' | 'chime' | 'digital') => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq: number, type: OscillatorType, startTime: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + Math.min(0.05, duration/2));
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      if (typeToPlay === 'beep') {
        playTone(880, 'sine', now, 0.2);
        playTone(880, 'sine', now + 0.3, 0.2);
        playTone(880, 'sine', now + 0.6, 0.2);
      } else if (typeToPlay === 'chime') {
        playTone(523.25, 'sine', now, 0.4);      
        playTone(659.25, 'sine', now + 0.15, 0.4); 
        playTone(783.99, 'sine', now + 0.3, 0.4);  
        playTone(1046.50, 'sine', now + 0.45, 0.8);
      } else if (typeToPlay === 'digital') {
        playTone(1200, 'square', now, 0.1);
        playTone(1200, 'square', now + 0.15, 0.1);
        playTone(1200, 'square', now + 0.4, 0.1);
        playTone(1200, 'square', now + 0.55, 0.1);
      }
    } catch (e) {
      console.error('Failed to play alarm', e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      const currentTarget = targetTime || (Date.now() + timeLeft * 1000);
      if (!targetTime) {
        setTimerState({ targetTime: currentTarget });
      }

      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.round((currentTarget - now) / 1000);

        if (remaining <= 0) {
          setTimerState({ timeLeft: 0, isActive: false, targetTime: null });
          if (soundEnabled) {
            playAlarmSound(alarmType);
          }
          
          let hasPermission = false;
          try {
            if ('Notification' in window) {
              hasPermission = Notification.permission === 'granted';
            }
          } catch (e) {}

          if (hasPermission) {
            const title = mode === 'work' ? 'Focus Session Complete!' : 'Break Over!';
            const body = mode === 'work' ? 'Time to take a well-deserved break.' : 'Ready to focus again?';
            try {
              const notif = new Notification(title, { body });
              notif.onclick = () => window.focus();
            } catch (e) {
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(reg => {
                  if (reg) reg.showNotification(title, { body });
                });
              }
            }
          }
        } else {
          setTimerState({ timeLeft: remaining });
        }
      }, 500);
    } else if (!isActive && targetTime) {
      setTimerState({ targetTime: null });
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, timeLeft, targetTime, soundEnabled, alarmType, setTimerState]);

  return null; // This component doesn't render anything
}
