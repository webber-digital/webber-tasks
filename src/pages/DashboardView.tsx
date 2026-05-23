import { useStore } from '../store';
import { cn } from '../lib/utils';
import { CheckCircle2, Clock, Circle, GraduationCap, Sparkles, ChevronRight } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function DashboardView() {
  const { tasks, updateTask } = useStore();
  const navigate = useNavigate();

  // Show all uncompleted tasks, sorted by newest
  const activeTasks = tasks.filter(t => !t.completed).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
  const completedToday = tasks.filter(t => t.completed && isToday(t.createdAt));

  const toggleTask = (id: string, currentStatus: boolean) => {
    updateTask(id, { completed: !currentStatus });
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 w-full">
      <div className="md:hidden">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Overview of your day.</p>
      </div>

      {/* Hero Premium Banner - The "Unskippable" Element */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-indigo-900/20 group border border-slate-800"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/20 via-transparent to-indigo-900/40 mix-blend-screen pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#00E5FF] rounded-full mix-blend-multiply opacity-10 filter blur-[80px] pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 filter blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/50 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> Study Space
            </span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Master your knowledge. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#0088FF]">Zero distractions.</span>
            </h2>
            <p className="text-slate-300 text-base md:text-lg max-w-lg mt-2 font-medium">
              Dive into our dynamic Math Quiz space. 100% Free. English & Hindi. Supercharge your brain before tackling tasks.
            </p>
          </div>
          
          <div className="shrink-0 w-full md:w-auto mt-4 md:mt-0">
            <Link 
              to="/study" 
              className="flex items-center justify-center gap-2 w-full md:w-auto bg-[#00E5FF] text-slate-950 hover:bg-[#B3FCFF] font-black py-4 px-8 rounded-2xl shadow-[0_0_40px_-10px_#00E5FF] hover:shadow-[0_0_60px_-15px_#00E5FF] transition-all duration-300 scale-100 hover:scale-105 active:scale-95"
            >
              Start Studying Now <ChevronRight className="w-5 h-5 -mr-1" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Grid Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <CheckCircle2 className="w-32 h-32 text-indigo-600" />
          </div>
          <div className="relative z-10">
            <div className="h-14 w-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100/50">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Active Tasks</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{activeTasks.length}</p>
              <p className="text-slate-400 font-medium pb-1">pending</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col justify-center relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 pointer-events-none">
             <Clock className="w-32 h-32 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="h-14 w-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100/50">
              <Clock className="h-7 w-7" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Completed Today</p>
            <div className="flex items-baseline gap-2">
              <p className="text-5xl font-black text-slate-900 tracking-tighter">{completedToday.length}</p>
              <p className="text-slate-400 font-medium pb-1">done</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {/* Active Tasks Premium Widget */}
        <motion.div 
           initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}
           className="md:col-span-12 bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col"
        >
          <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              Top Priority Tasks
            </h3>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-sm font-bold text-[#0088FF] hover:text-[#0055ff] hover:bg-[#0088FF]/10 px-4 py-2 rounded-full transition-colors flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-4 md:p-6 flex-1 flex flex-col gap-3 md:gap-4 bg-slate-50/30">
            {activeTasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-10 w-10 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-900">Your plate is clean!</p>
                <p className="text-slate-500 mt-1">You have no active tasks remaining.</p>
              </div>
            ) : (
              activeTasks.slice(0, 5).map((task, i) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3, delay: i * 0.1 }}
                  key={task.id} 
                  onClick={() => toggleTask(task.id, task.completed)}
                  className="flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl hover:border-[#00B8D9] hover:shadow-lg hover:shadow-[#00E5FF]/10 transition-all duration-300 cursor-pointer group"
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 group-hover:border-[#00B8D9] flex items-center justify-center transition-colors">
                       <Circle className="w-4 h-4 text-transparent group-hover:text-[#00B8D9]/20" fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base md:text-lg font-bold text-slate-800 truncate group-hover:text-slate-900 transition-colors">{task.title}</p>
                    <div className="flex gap-2 mt-1.5 items-center flex-wrap">
                      {task.priority && (
                        <span className={cn(
                          "text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider",
                          task.priority === 'high' ? "bg-rose-100 text-rose-700" :
                          task.priority === 'medium' ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                        )}>
                          {task.priority === 'high' ? 'High Priority' : task.priority}
                        </span>
                      )}
                      {task.folder && (
                        <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md">
                          {task.folder}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className={cn(
                           "text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-md",
                           isToday(task.dueDate) ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                        )}>
                          {isToday(task.dueDate) ? 'Due Today' : format(task.dueDate, 'MMM d')}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
