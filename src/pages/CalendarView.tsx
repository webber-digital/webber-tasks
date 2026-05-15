import React, { useState } from 'react';
import { useStore } from '../store';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Event } from '../types';

export function CalendarView() {
  const { events, addEvent, deleteEvent } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Event Widget State
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '', location: '' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEventsForDay = (day: Date) => {
    return events.filter(e => isSameDay(e.date, day));
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    
    addEvent({
      ...newEvent,
      date: newEvent.date ? new Date(newEvent.date) : new Date(),
    });
    
    setNewEvent({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '', location: '' });
    setIsAddingEvent(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 md:hidden">Calendar</h1>
        <button
          onClick={() => setIsAddingEvent(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm ml-auto"
        >
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden p-4">
        {/* Calendar Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 pl-2 text-sm">
            {format(currentDate, dateFormat)}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-900">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded transition-colors text-slate-900">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-2 font-bold uppercase">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, ix) => (
            <span key={ix}>{day}</span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-auto gap-1 text-center text-xs">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toString()} 
                onClick={() => {
                  setNewEvent({ title: '', date: format(day, 'yyyy-MM-dd'), time: '', location: '' });
                  setIsAddingEvent(true);
                }}
                className={cn(
                  "p-2 flex flex-col min-h-[80px] hover:bg-slate-50 transition-colors border-slate-100 cursor-pointer border rounded-lg",
                  !isCurrentMonth ? "text-slate-300" : "text-slate-700"
                )}
              >
                <div className="flex justify-center mb-1">
                  <span className={cn(
                    "text-xs font-semibold h-7 w-7 flex items-center justify-center rounded-full",
                    isToday ? "bg-indigo-600 text-white shadow-md font-bold" : "",
                    !isToday && isCurrentMonth ? "font-semibold text-slate-700" : ""
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-1 no-scrollbar pt-1 w-full flex flex-col text-left px-1">
                  {dayEvents.map(event => (
                    <button 
                      key={event.id}
                      onClick={(e) => { e.stopPropagation(); setViewingEvent(event); }}
                      className="px-1.5 py-0.5 text-[9px] md:text-[10px] leading-tight rounded bg-indigo-50 text-indigo-700 font-bold truncate text-left w-full hover:bg-indigo-100 transition-colors"
                      title={event.title}
                    >
                      {event.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg">Event Details</h2>
              <button onClick={() => setViewingEvent(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-xl">{viewingEvent.title}</h3>
                <div className="text-slate-500 text-sm mt-3 space-y-2">
                   <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400" /> {format(viewingEvent.date, 'PPPP')} {viewingEvent.time && `at ${viewingEvent.time}`}</div>
                   {viewingEvent.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {viewingEvent.location}</div>}
                </div>
              </div>

              <div className="pt-4 mt-6 flex justify-end">
                <button 
                  onClick={() => { deleteEvent(viewingEvent.id); setViewingEvent(null); }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Event Widget Modal */}
      {isAddingEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg">Create New Event</h2>
              <button onClick={() => setIsAddingEvent(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title</label>
                <input 
                  required autoFocus
                  value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Project Sync"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" required
                    value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Time (Optional)</label>
                  <input 
                    type="time" 
                    value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    placeholder="e.g. Google Meet or Office"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAddingEvent(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
