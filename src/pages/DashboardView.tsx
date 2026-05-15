import { useStore } from '../store';
import { cn } from '../lib/utils';
import { CheckCircle2, Clock, Calendar as CalendarIcon, ArrowRight, Circle } from 'lucide-react';
import { format, isToday } from 'date-fns';

export function DashboardView() {
  const { tasks, events, setCurrentView } = useStore();

  const todayTasks = tasks.filter(t => !t.completed && t.dueDate && isToday(t.dueDate));
  const upcomingEvents = events.filter(e => isToday(e.date) || e.date > new Date()).slice(0, 3);
  const completedToday = tasks.filter(t => t.completed && isToday(t.createdAt)); // simplification

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 md:hidden">Morning Dashboard</h1>
        <p className="text-slate-500 mt-1 md:hidden">Here is the overview of your day.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Tasks Due</p>
            <p className="text-2xl font-bold text-slate-900">{todayTasks.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Completed</p>
            <p className="text-2xl font-bold text-slate-900">{completedToday.length}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Events</p>
            <p className="text-2xl font-bold text-slate-900">{upcomingEvents.length}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Today's Tasks Component */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
            <h3 className="font-bold flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
              Active Tasks
            </h3>
            <button 
              onClick={() => setCurrentView('tasks')}
              className="text-sm text-indigo-600 font-semibold hover:underline"
            >
              + New Task
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-3">
            {todayTasks.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <CheckCircle2 className="h-12 w-12 text-slate-200 mb-2" />
                <p className="text-slate-500">All caught up for today!</p>
              </div>
            ) : (
              todayTasks.slice(0, 4).map(task => (
                <div key={task.id} className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-xl hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div className="mt-0.5">
                    <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                    <div className="flex gap-2 mt-1 items-center">
                      {task.priority && (
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                          task.priority === 'high' ? "bg-red-50 text-red-600" :
                          task.priority === 'medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {task.priority === 'high' ? 'High Priority' : task.priority}
                        </span>
                      )}
                      {task.folder && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {task.folder}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Due Today</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Events Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
            <h3 className="font-bold flex items-center gap-2 text-slate-900">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              Upcoming Events
            </h3>
            <button 
              onClick={() => setCurrentView('calendar')}
              className="text-sm text-indigo-600 font-semibold hover:underline"
            >
              Calendar
            </button>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {upcomingEvents.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <CalendarIcon className="h-12 w-12 text-slate-200 mb-2" />
                <p className="text-slate-500">No upcoming events.</p>
              </div>
            ) : (
              upcomingEvents.map(event => (
                <div key={event.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 flex flex-col items-center justify-center min-w-[3.5rem]">
                    <span className="text-xs font-bold text-indigo-500 uppercase">{format(event.date, 'MMM')}</span>
                    <span className="text-lg font-bold text-slate-800 leading-none">{format(event.date, 'd')}</span>
                  </div>
                  <div className="pl-2 border-l-2 border-transparent">
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Upcoming Event</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{event.title}</p>
                    <p className="text-[11px] text-slate-500 mt-1 flex gap-2 items-center">
                       {event.location && <span>{event.location}</span>}
                    </p>
                    <p className="text-xs font-semibold text-indigo-600 mt-2">{event.time || "All Day"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
