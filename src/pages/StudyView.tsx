import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, CheckCircle2, XCircle, RotateCcw, Flame, Target, Trophy } from 'lucide-react';
import { cn } from '../lib/utils';
import { generateQuiz, Question } from '../lib/mathGenerator';

type Language = 'en' | 'hi';

export function StudyView() {
  const [language, setLanguage] = useState<Language>('en');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // Stats System
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate exactly 75 non-repeating dynamic mathematical questions each time it loads
    setQuestions(generateQuiz(75));
  }, []);

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentIndex];
  const qStr = language === 'en' ? currentQuestion.questionEn : currentQuestion.questionHi;
  const optStr = language === 'en' ? currentQuestion.optionsEn : currentQuestion.optionsHi;

  const accuracy = answeredCount === 0 ? 0 : Math.round((score / answeredCount) * 100);

  const handleOptionSelect = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setAnsweredCount(prev => prev + 1);
    
    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        setMaxStreak(m => Math.max(m, next));
        return next;
      });
    } else {
      setStreak(0); // Break streak
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setIsComplete(true);
    }
  };

  const resetQuiz = () => {
    setQuestions(generateQuiz(75));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setAnsweredCount(0);
    setIsComplete(false);
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
          
          <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
            <button
              onClick={() => setLanguage('en')}
              className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", language === 'en' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900")}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-all", language === 'hi' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900")}
            >
              हिंदी
            </button>
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
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {language === 'en' 
                  ? `Great job! You answered ${score} out of 75 questions correctly. Your highest streak was ${maxStreak} and your final accuracy is ${accuracy}%.` 
                  : `बहुत बढ़िया! आपने 75 में से ${score} प्रश्नों के सही उत्तर दिए। आपकी सबसे लंबी स्ट्रीक ${maxStreak} थी और अंतिम सटीकता ${accuracy}% थी।`}
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

              <button
                onClick={resetQuiz}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto px-8 py-4 rounded-xl font-medium transition-colors shadow-sm"
              >
                <RotateCcw className="w-5 h-5" />
                {language === 'en' ? 'Play Again (New Questions)' : 'नए सवालों के साथ दोबारा खेलें'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
