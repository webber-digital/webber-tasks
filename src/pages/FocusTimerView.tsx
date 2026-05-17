import React, { useState } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Settings, X, Coffee, Brain } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store';

export function FocusTimerView() {
  const { timerState, timerConfig, setTimerState, setTimerConfig } = useStore();
  
  const [showSettings, setShowSettings] = useState(false);
  const [tempWork, setTempWork] = useState(timerConfig.workDuration);
  const [tempBreak, setTempBreak] = useState(timerConfig.breakDuration);
  const [tempSoundEnabled, setTempSoundEnabled] = useState(timerConfig.soundEnabled);
  const [tempAlarmType, setTempAlarmType] = useState(timerConfig.alarmType);
  const [tempTheme, setTempTheme] = useState(timerConfig.theme);

  const THEMES = [
    { 
      id: 'indigo', name: 'Indigo Dream', 
      bg: 'bg-slate-900', border: 'border-slate-800', glow: 'shadow-indigo-900/40', ambient: 'bg-indigo-500', text: 'text-white', btnBg: 'bg-indigo-500', btnHover: 'hover:bg-indigo-600', ring: 'ring-indigo-500', accent: 'text-indigo-500',
      breakBg: 'bg-indigo-50', breakBorder: 'border-indigo-100', breakGlow: 'shadow-indigo-500/20', breakText: 'text-indigo-950', breakBtnBg: 'bg-indigo-500', breakBtnHover: 'hover:bg-indigo-600', breakTabBg: 'bg-indigo-200/50', breakTabInactiveText: 'text-indigo-700/60 hover:text-indigo-800'
    },
    { 
      id: 'rose', name: 'Rose Petal', 
      bg: 'bg-rose-950', border: 'border-rose-900', glow: 'shadow-rose-900/40', ambient: 'bg-rose-500', text: 'text-white', btnBg: 'bg-rose-600', btnHover: 'hover:bg-rose-700', ring: 'ring-rose-500', accent: 'text-rose-500',
      breakBg: 'bg-rose-50', breakBorder: 'border-rose-100', breakGlow: 'shadow-rose-500/20', breakText: 'text-rose-950', breakBtnBg: 'bg-rose-500', breakBtnHover: 'hover:bg-rose-600', breakTabBg: 'bg-rose-200/50', breakTabInactiveText: 'text-rose-700/60 hover:text-rose-800'
    },
    { 
      id: 'amber', name: 'Golden Hour', 
      bg: 'bg-amber-950', border: 'border-amber-900', glow: 'shadow-amber-900/40', ambient: 'bg-amber-500', text: 'text-amber-50', btnBg: 'bg-amber-500', btnHover: 'hover:bg-amber-600', ring: 'ring-amber-500', accent: 'text-amber-500',
      breakBg: 'bg-amber-50', breakBorder: 'border-amber-100', breakGlow: 'shadow-amber-500/20', breakText: 'text-amber-950', breakBtnBg: 'bg-amber-500', breakBtnHover: 'hover:bg-amber-600', breakTabBg: 'bg-amber-200/50', breakTabInactiveText: 'text-amber-700/60 hover:text-amber-800'
    },
    { 
      id: 'emerald', name: 'Forest Focus', 
      bg: 'bg-slate-900', border: 'border-slate-800', glow: 'shadow-emerald-900/40', ambient: 'bg-emerald-500', text: 'text-white', btnBg: 'bg-emerald-500', btnHover: 'hover:bg-emerald-600', ring: 'ring-emerald-500', accent: 'text-emerald-500',
      breakBg: 'bg-emerald-50', breakBorder: 'border-emerald-100', breakGlow: 'shadow-emerald-500/20', breakText: 'text-emerald-950', breakBtnBg: 'bg-emerald-500', breakBtnHover: 'hover:bg-emerald-600', breakTabBg: 'bg-emerald-200/50', breakTabInactiveText: 'text-emerald-700/60 hover:text-emerald-800'
    },
    { 
      id: 'sky', name: 'Deep Sky', 
      bg: 'bg-sky-950', border: 'border-sky-900', glow: 'shadow-sky-900/40', ambient: 'bg-sky-500', text: 'text-white', btnBg: 'bg-sky-500', btnHover: 'hover:bg-sky-600', ring: 'ring-sky-500', accent: 'text-sky-500',
      breakBg: 'bg-sky-50', breakBorder: 'border-sky-100', breakGlow: 'shadow-sky-500/20', breakText: 'text-sky-950', breakBtnBg: 'bg-sky-500', breakBtnHover: 'hover:bg-sky-600', breakTabBg: 'bg-sky-200/50', breakTabInactiveText: 'text-sky-700/60 hover:text-sky-800'
    },
  ];

  const playAlarmSound = (overrideType?: 'beep' | 'chime' | 'digital') => {
    if (!timerConfig.soundEnabled && !overrideType) return;
    const typeToPlay = overrideType || timerConfig.alarmType;
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

  const toggleTimer = () => setTimerState({ isActive: !timerState.isActive });

  const resetTimer = () => {
    setTimerState({
      isActive: false,
      targetTime: null,
      timeLeft: timerState.mode === 'work' ? timerConfig.workDuration * 60 : timerConfig.breakDuration * 60
    });
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setTimerState({
      mode: newMode,
      isActive: false,
      targetTime: null,
      timeLeft: newMode === 'work' ? timerConfig.workDuration * 60 : timerConfig.breakDuration * 60
    });
  };

  const saveSettings = () => {
    setTimerConfig({
      workDuration: tempWork,
      breakDuration: tempBreak,
      soundEnabled: tempSoundEnabled,
      alarmType: tempAlarmType,
      theme: tempTheme
    });
    setShowSettings(false);
    setTimerState({
      isActive: false,
      targetTime: null,
      timeLeft: timerState.mode === 'work' ? tempWork * 60 : tempBreak * 60
    });
  };

  const openSettings = () => {
     setTempWork(timerConfig.workDuration);
     setTempBreak(timerConfig.breakDuration);
     setTempSoundEnabled(timerConfig.soundEnabled);
     setTempAlarmType(timerConfig.alarmType);
     setTempTheme(timerConfig.theme);
     setShowSettings(true);
  };

  const minutes = Math.floor(timerState.timeLeft / 60);
  const seconds = timerState.timeLeft % 60;
  
  const currentTotalTime = timerState.mode === 'work' ? timerConfig.workDuration * 60 : timerConfig.breakDuration * 60;
  const percentage = currentTotalTime > 0 ? (timerState.timeLeft / currentTotalTime) * 100 : 0;
  
  const activeTheme = THEMES.find(t => t.id === timerConfig.theme) || THEMES[0];

  return (
    <div className="flex flex-col flex-1 space-y-4 md:space-y-6 animate-in fade-in duration-500 max-w-xl mx-auto w-full pt-4 md:pt-16 pb-24 md:pb-0 relative">
      <div className="text-center space-y-2 md:hidden">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Focus Timer</h1>
        <p className="text-sm text-slate-500 px-4">Stay productive with Pomodoro sessions</p>
      </div>

      <div className={cn(
        "p-8 md:p-12 rounded-[2rem] border shadow-2xl flex flex-col items-center relative overflow-hidden transition-all duration-700 mx-4 md:mx-0",
        timerState.mode === 'work' 
          ? cn(activeTheme.bg, activeTheme.border, activeTheme.glow, activeTheme.text) 
          : cn(activeTheme.breakBg, activeTheme.breakBorder, activeTheme.breakGlow, activeTheme.breakText)
      )}>
        
        {/* Decorative ambient background */}
        {timerState.mode === 'work' && (
          <div className={cn("absolute -top-32 -right-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse", activeTheme.ambient)}></div>
        )}
        {timerState.mode === 'break' && (
          <div className={cn("absolute -bottom-32 -left-32 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse", activeTheme.ambient)}></div>
        )}

        <button 
          onClick={openSettings}
          className={cn(
            "absolute top-6 right-6 p-2 rounded-full transition-colors z-20",
            timerState.mode === 'work' ? "text-slate-400 hover:text-white hover:bg-white/10" : cn(activeTheme.accent, "hover:opacity-80")
          )}
        >
          <Settings className="h-5 w-5" />
        </button>

        {/* Mode Selector */}
        <div className={cn(
          "flex p-1.5 rounded-2xl z-10 mb-12",
          timerState.mode === 'work' ? "bg-slate-800/60 backdrop-blur-md" : activeTheme.breakTabBg
        )}>
          <button 
            onClick={() => switchMode('work')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              timerState.mode === 'work' ? cn(activeTheme.btnBg, activeTheme.text) : cn("shadow-none", activeTheme.breakTabInactiveText)
            )}
          >
            <Brain className="h-4 w-4" /> Focus
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2",
              timerState.mode === 'break' ? cn(activeTheme.breakBtnBg, "text-white") : "text-slate-400 shadow-none hover:text-slate-300"
            )}
          >
            <Coffee className="h-4 w-4" /> Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center w-full z-10 my-8">
           <span className={cn(
             "text-6xl md:text-[8rem] font-black tracking-tighter leading-none font-mono",
             timerState.mode === 'work' ? activeTheme.text : activeTheme.breakText
           )}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <div className="w-full max-w-[80%] mt-12 bg-black/10 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-linear",
                    timerState.mode === 'work' ? activeTheme.ambient : activeTheme.breakBtnBg
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
              timerState.mode === 'work' ? "bg-slate-800/60 text-slate-300 hover:bg-slate-700" : "bg-emerald-100/70 text-emerald-700 hover:bg-emerald-200"
            )}
          >
            <RotateCcw className="h-6 w-6" />
          </button>
          <button
            onClick={toggleTimer}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl",
              timerState.mode === 'work' ? cn(activeTheme.btnBg, activeTheme.text, "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)]") : "bg-emerald-500 text-white shadow-emerald-500/30",
              timerState.isActive && "scale-95 shadow-inner"
            )}
          >
            {timerState.isActive ? (
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
                
                <div className="py-2 border-t border-slate-100 mt-6 pt-6">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-700">Timer Theme</h3>
                    <p className="text-xs text-slate-500">Pick a color scheme for Focus mode</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => setTempTheme(theme.id)}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center",
                          tempTheme === theme.id ? "border-indigo-600 scale-110" : "border-transparent opacity-70 hover:opacity-100 hover:scale-105",
                          theme.ambient
                        )}
                        title={theme.name}
                      >
                        {tempTheme === theme.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </button>
                    ))}
                  </div>
                </div>
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
