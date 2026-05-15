import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Settings, X, Coffee, Brain } from 'lucide-react';
import { cn } from '../lib/utils';

export function FocusTimerView() {
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmType, setAlarmType] = useState<'beep' | 'chime' | 'digital'>('beep');
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempWork, setTempWork] = useState(25);
  const [tempBreak, setTempBreak] = useState(5);
  const [tempSoundEnabled, setTempSoundEnabled] = useState(true);
  const [tempAlarmType, setTempAlarmType] = useState<'beep' | 'chime' | 'digital'>('beep');

  const targetTimeRef = useRef<number | null>(null);

  const playAlarmSound = (overrideType?: 'beep' | 'chime' | 'digital') => {
    if (!soundEnabled && !overrideType) return;
    const typeToPlay = overrideType || alarmType;
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
        gain.gain.linearRampToValueAtTime(0.3, startTime + Math.min(0.05, duration/2)); // Fade in
        gain.gain.linearRampToValueAtTime(0, startTime + duration); // Fade out
        
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

  const handlePreviewSound = (type: 'beep' | 'chime' | 'digital') => {
    setTempAlarmType(type);
    playAlarmSound(type);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      if (!targetTimeRef.current) {
        targetTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.round((targetTimeRef.current! - now) / 1000);

        if (remaining <= 0) {
          setTimeLeft(0);
          setIsActive(false);
          targetTimeRef.current = null;
          playAlarmSound();
          
          let hasPermission = false;
          try {
            if ('Notification' in window) {
              hasPermission = Notification.permission === 'granted';
            }
          } catch (e) {
            // Ignore cross-origin security errors
          }

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
          setTimeLeft(remaining);
        }
      }, 500); // Check multiple times per second for accuracy
    } else if (!isActive) {
      targetTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode]); // Only re-run when mode or isActive changes

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    targetTimeRef.current = null;
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    targetTimeRef.current = null;
    setTimeLeft(newMode === 'work' ? workDuration * 60 : breakDuration * 60);
  };

  const saveSettings = () => {
    setWorkDuration(tempWork);
    setBreakDuration(tempBreak);
    setSoundEnabled(tempSoundEnabled);
    setAlarmType(tempAlarmType);
    setShowSettings(false);
    setIsActive(false);
    targetTimeRef.current = null;
    setTimeLeft(mode === 'work' ? tempWork * 60 : tempBreak * 60);
  };

  const openSettings = () => {
     setTempWork(workDuration);
     setTempBreak(breakDuration);
     setTempSoundEnabled(soundEnabled);
     setTempAlarmType(alarmType);
     setShowSettings(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const currentTotalTime = mode === 'work' ? workDuration * 60 : breakDuration * 60;
  const percentage = currentTotalTime > 0 ? (timeLeft / currentTotalTime) * 100 : 0;

  return (
    <div className="flex flex-col flex-1 space-y-4 md:space-y-6 animate-in fade-in duration-500 max-w-xl mx-auto w-full pt-4 md:pt-16 pb-24 md:pb-0 relative">
      <div className="text-center space-y-2 md:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Focus Timer</h1>
        <p className="text-sm text-slate-500 px-4">Stay productive with Pomodoro sessions</p>
      </div>

      <div className={cn(
        "p-8 md:p-12 rounded-[2rem] border shadow-2xl flex flex-col items-center relative overflow-hidden transition-all duration-700 mx-4 md:mx-0",
        mode === 'work' 
          ? "bg-slate-900 border-slate-800 shadow-indigo-900/40 text-white" 
          : "bg-emerald-50 border-emerald-100 shadow-emerald-500/20 text-emerald-950"
      )}>
        
        {/* Decorative ambient background */}
        {mode === 'work' && (
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        )}
        {mode === 'break' && (
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        )}

        <button 
          onClick={openSettings}
          className={cn(
            "absolute top-6 right-6 p-2 rounded-full transition-colors z-20",
            mode === 'work' ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-emerald-600 hover:bg-emerald-200/50"
          )}
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Mode Selector */}
        <div className={cn(
          "flex p-1.5 rounded-2xl z-10 mb-12",
          mode === 'work' ? "bg-slate-800/60 backdrop-blur-md" : "bg-emerald-200/50"
        )}>
          <button 
            onClick={() => switchMode('work')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              mode === 'work' ? "bg-indigo-500 text-white" : "text-emerald-700/60 shadow-none hover:text-emerald-800"
            )}
          >
            <Brain className="h-4 w-4" /> Focus
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              mode === 'break' ? "bg-emerald-500 text-white" : "text-slate-400 shadow-none hover:text-slate-300"
            )}
          >
            <Coffee className="h-4 w-4" /> Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center w-full z-10 my-8">
           <span className={cn(
             "text-6xl md:text-[8rem] font-black tracking-tighter leading-none font-mono",
             mode === 'work' ? "text-white" : "text-emerald-950"
           )}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <div className="w-full max-w-[80%] mt-12 bg-black/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-linear",
                    mode === 'work' ? "bg-indigo-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${percentage}%` }}
                />
            </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8 md:mt-12 z-10 w-full justify-center">
          <button
            onClick={resetTimer}
            className={cn(
              "p-4 rounded-full transition-colors flex items-center justify-center backdrop-blur-md",
              mode === 'work' ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700" : "bg-emerald-100/70 text-emerald-700 hover:bg-emerald-200"
            )}
          >
            <RotateCcw className="h-6 w-6" />
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl",
              mode === 'work' ? "bg-indigo-500 text-white shadow-indigo-500/30" : "bg-emerald-500 text-white shadow-emerald-500/30",
              isActive && "scale-95 shadow-inner"
            )}
          >
            {isActive ? (
              <Pause className="h-10 w-10 fill-current" />
            ) : (
              <Play className="h-10 w-10 fill-current ml-2" />
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-start gap-3 mt-4 mx-4 md:mx-0 shadow-sm">
        <AlertCircle className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-indigo-800 leading-relaxed">
          <strong>Pro Tip:</strong> Keep a notepad nearby to log passing thoughts directly without breaking your flow state.
        </p>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 border border-slate-100">
            <div className="flex justify-between items-center p-6 pb-2">
              <h2 className="font-extrabold text-xl">Timer Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-indigo-600 bg-slate-50 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700">Focus Duration</label>
                    <span className="text-sm font-bold text-indigo-600">{tempWork} min</span>
                  </div>
                  <input 
                    type="range" min="5" max="120" step="5"
                    value={tempWork} onChange={e => setTempWork(parseInt(e.target.value))}
                    className="w-full accent-indigo-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div>
                   <div className="flex justify-between mb-2">
                    <label className="text-sm font-bold text-slate-700">Break Duration</label>
                    <span className="text-sm font-bold text-emerald-600">{tempBreak} min</span>
                  </div>
                  <input 
                    type="range" min="1" max="60" step="1"
                    value={tempBreak} onChange={e => setTempBreak(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="flex items-center justify-between py-2 border-t border-slate-100 mt-6 pt-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-700">Alarm Sound</h3>
                    <p className="text-xs text-slate-500">Play an alert when timer ends</p>
                  </div>
                  <button
                    onClick={() => setTempSoundEnabled(!tempSoundEnabled)}
                    className={cn(
                      "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shrink-0",
                      tempSoundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                        tempSoundEnabled ? 'translate-x-6' : 'translate-x-1'
                      )}
                    />
                  </button>
                </div>

                {tempSoundEnabled && (
                  <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                    {(['beep', 'chime', 'digital'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handlePreviewSound(type)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-bold capitalize border transition-all",
                          tempAlarmType === type 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm" 
                            : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button 
                  onClick={saveSettings}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
