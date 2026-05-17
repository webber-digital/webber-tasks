import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Flame, Target, Trophy, Clock, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateQuiz, Question } from '../lib/mathGenerator';
import { useStore } from '../store';

const TIME_LIMITS = [
  { label: '5 min', value: 5 * 60 },
  { label: '10 min', value: 10 * 60 },
  { label: '15 min', value: 15 * 60 },
  { label: 'No Limit', value: null },
];

export function StudyView() {
  const { studyState, setStudyState, resetStudyState } = useStore();
  const fallbackStudyState = { 
    language: 'en' as const, questions: [], currentIndex: 0, selectedAnswer: null, 
    score: 0, streak: 0, maxStreak: 0, answeredCount: 0, isComplete: false,
    timeRemaining: null, initialTimeLimit: null, isTimerActive: false 
  };
  const { 
    language, questions, currentIndex, selectedAnswer, 
    score, streak, maxStreak, answeredCount, isComplete,
    timeRemaining, initialTimeLimit, isTimerActive 
  } = studyState || fallbackStudyState;

  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  // GlobalTimer handles the countdown state sync across unmounts/views!
  
  const startQuiz = () => {
    resetStudyState(generateQuiz(75), selectedTime);
  };

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden items-center justify-center p-6">
        <Helmet>
          <title>Study Space - Setup | Wavedo</title>
        </Helmet>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <GraduationCap className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Setup</h2>
          <p className="text-slate-500 mb-8">Select a time limit for your math session or practice without limits.</p>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {TIME_LIMITS.map(limit => (
              <button
                key={limit.label}
                onClick={() => setSelectedTime(limit.value)}
                className={cn(
                  "py-3 px-4 rounded-xl border-2 font-medium transition-all",
                  selectedTime === limit.value 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700" 
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200"
                )}
              >
                {limit.label}
              </button>
            ))}
          </div>

          <button
            onClick={startQuiz}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-5 h-5" /> Start Now
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const qStr = language === 'en' ? currentQuestion.questionEn : currentQuestion.questionHi;
  const optStr = language === 'en' ? currentQuestion.optionsEn : currentQuestion.optionsHi;

  const accuracy = answeredCount === 0 ? 0 : Math.round((score / answeredCount) * 100);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setStudyState({ selectedAnswer: idx, answeredCount: answeredCount + 1 });
    
    if (idx === currentQuestion.correctAnswerIndex) {
      const nextStreak = streak + 1;
      setStudyState({ 
        score: score + 1, 
        streak: nextStreak,
        maxStreak: Math.max(maxStreak, nextStreak)
      });
    } else {
      setStudyState({ streak: 0 }); // Break streak
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setStudyState({ currentIndex: currentIndex + 1, selectedAnswer: null });
    } else {
      setStudyState({ isComplete: true, isTimerActive: false });
    }
  };

  const resetQuiz = () => {
    setStudyState({ questions: [] });
  };

  const getOptionStateClass = (idx: number) => {
    if (selectedAnswer === null) return 'bg-white hover:bg-slate-50 border-slate-200';
    
    if (idx === currentQuestion.correctAnswerIndex) {
      return 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm';
    }
    
    if (idx === selectedAnswer) {
      return 'bg-red-50 border-red-500 text-red-900 shadow-sm';
    }
    
    return 'bg-slate-50 border-slate-200 opacity-50';
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      <Helmet>
        <title>Study Space - Quiz & Learning | Wavedo</title>
        <meta name="description" content="Enhance your knowledge with interactive Math quizzes. Practice in English or Hindi on Wavedo's ad-free study environment." />
      </Helmet>

      <header className="px-4 sm:px-6 py-6 sm:py-8 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Study Space</h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">Interactive Quizzes (Ad-Free)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {initialTimeLimit !== null && (
              <div className={cn("flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg font-mono font-medium", timeRemaining && timeRemaining < 30 ? "text-red-500 bg-red-50" : "text-slate-700")}>
                <Clock className="w-4 h-4" />
                {timeRemaining !== null ? formatTime(timeRemaining) : '0:00'}
              </div>
            )}
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              <button
                onClick={() => setStudyState({ language: 'en' })}
                className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", language === 'en' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900")}
              >
                English
              </button>
              <button
                onClick={() => setStudyState({ language: 'hi' })}
                className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", language === 'hi' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900")}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto w-full p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          {!isComplete ? (
            <>
              {/* Stats HUD System */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <Target className="w-5 h-5 text-indigo-500 mb-1" />
                  <span className="text-2xl font-bold text-slate-900">{accuracy}%</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Accuracy</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <Flame className={cn("w-5 h-5 mb-1", streak > 2 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-orange-400")} />
                  <span className="text-2xl font-bold text-slate-900">{streak}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Current Streak</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500 mb-1" />
                  <span className="text-2xl font-bold text-slate-900">{score}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">Score</span>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-emerald-500 mb-1" />
                  <span className="text-2xl font-bold text-slate-900">{currentIndex + 1}</span>
                  <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">of {questions.length} Qs</span>
                </div>
              </div>

              {/* Quiz Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-1.5 bg-slate-100 w-full">
                  <div 
                    className="h-full bg-indigo-500 transition-all duration-300" 
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
                  />
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-8 mt-2 leading-relaxed text-center sm:text-left">
                  {qStr}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2">
                  {optStr.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={selectedAnswer !== null}
                      onClick={() => handleOptionSelect(idx)}
                      className={cn(
                        "w-full text-center sm:text-left px-5 py-4 rounded-xl border-2 transition-all flex justify-between items-center",
                        getOptionStateClass(idx),
                        selectedAnswer === null && "hover:border-indigo-200 cursor-pointer hover:shadow-md"
                      )}
                    >
                      <span className="font-semibold text-lg">{opt}</span>
                      
                      {selectedAnswer !== null && idx === currentQuestion.correctAnswerIndex && (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 ml-2" />
                      )}
                      
                      {selectedAnswer === idx && idx !== currentQuestion.correctAnswerIndex && (
                        <XCircle className="w-6 h-6 text-red-500 shrink-0 ml-2" />
                      )}
                    </button>
                  ))}
                </div>
                
                {selectedAnswer !== null && (
                  <div className="flex justify-center sm:justify-end mt-8 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2">
                    <button
                      onClick={handleNext}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-sm w-full sm:w-auto"
                    >
                      {currentIndex < questions.length - 1 
                        ? (language === 'en' ? 'Next Question →' : 'अगला प्रश्न →') 
                        : (language === 'en' ? 'See Final Results' : 'परिणाम देखें')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-lg mx-auto animate-in zoom-in-95">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-indigo-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                {language === 'en' ? 'Quiz Completed!' : 'क्विज समाप्त!'}
              </h2>
              {initialTimeLimit !== null && timeRemaining === 0 && (
                <p className="text-red-500 font-medium mb-2">Time's Up! / समय समाप्त!</p>
              )}
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {language === 'en' 
                  ? `Great job! You answered ${score} out of ${questions.length} questions correctly. Your highest streak was ${maxStreak} and your final accuracy is ${accuracy}%.` 
                  : `बहुत बढ़िया! आपने ${questions.length} में से ${score} प्रश्नों के सही उत्तर दिए। आपकी सबसे लंबी स्ट्रीक ${maxStreak} थी और अंतिम सटीकता ${accuracy}% थी।`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-sm text-slate-500 font-medium mb-1">Max Streak</span>
                  <span className="text-2xl font-bold flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-orange-500" /> {maxStreak}
                  </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="block text-sm text-slate-500 font-medium mb-1">Final Score</span>
                  <span className="text-2xl font-bold text-indigo-600">{score}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <RotateCcw className="w-5 h-5" />
                  {language === 'en' ? 'New Session' : 'नया सेशन'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
