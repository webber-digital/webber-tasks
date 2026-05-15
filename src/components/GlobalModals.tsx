import React, { useState } from 'react';
import { useStore } from '../store';
import { X, ChevronDown, Folder, Tag, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Priority } from '../types';

export function GlobalModals() {
  const { activeModal, setActiveModal, addTask, addEvent, addNote } = useStore();

  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'medium' as Priority, tags: '', folder: '', dueDate: ''
  });
  
  const [newEvent, setNewEvent] = useState({ 
    title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '', location: '' 
  });

  const [newNote, setNewNote] = useState({ title: '', content: '' });

  const colors = ['bg-blue-100', 'bg-emerald-100', 'bg-amber-100', 'bg-pink-100', 'bg-purple-100', 'bg-indigo-100'];

  if (!activeModal) return null;

  const handleClose = () => {
    setActiveModal(null);
    // Reset forms
    setNewTask({ title: '', description: '', priority: 'medium', tags: '', folder: '', dueDate: '' });
    setNewEvent({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '', location: '' });
    setNewNote({ title: '', content: '' });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    const tagList = newTask.tags.split(',').map(t => t.trim()).filter(Boolean);
    addTask({
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      priority: newTask.priority,
      tags: tagList,
      folder: newTask.folder.trim() || 'Inbox',
      completed: false,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null
    });
    handleClose();
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    
    addEvent({
      ...newEvent,
      date: newEvent.date ? new Date(newEvent.date) : new Date(),
    });
    handleClose();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    addNote({
      title: newNote.title.trim() || 'Untitled Note',
      content: newNote.content.trim(),
      tags: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      
      {activeModal === 'task' && (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 text-slate-900">
            <h2 className="font-bold text-lg">Create Task</h2>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddTask} className="p-5 space-y-4 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Title <span className="text-red-500">*</span></label>
              <input 
                required autoFocus
                value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
              <textarea 
                value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none h-20 text-slate-900"
                placeholder="More details here..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="datetime-local" 
                  value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <div className="relative">
                  <select 
                    value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value as Priority})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all appearance-none text-slate-900"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Folder</label>
                <div className="relative">
                  <Folder className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    value={newTask.folder} onChange={e => setNewTask({...newTask, folder: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900"
                    placeholder="e.g. Work"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input 
                    value={newTask.tags} onChange={e => setNewTask({...newTask, tags: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900"
                    placeholder="e.g. urgent, health"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 mt-auto">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                Cancel
              </button>
              <button type="submit" disabled={!newTask.title.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'event' && (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-lg">Create Event</h2>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddEvent} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title <span className="text-red-500">*</span></label>
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
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                Cancel
              </button>
              <button type="submit" disabled={!newEvent.title.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
                Save Event
              </button>
            </div>
          </form>
        </div>
      )}

      {activeModal === 'note' && (
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900">
          <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-lg">Create Quick Note</h2>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleAddNote} className="p-5 space-y-4">
            <input 
              autoFocus
              value={newNote.title} onChange={e => setNewNote({...newNote, title: e.target.value})}
              className="w-full text-lg font-bold bg-transparent border-0 focus:ring-0 p-0 mb-2 outline-none placeholder:text-slate-400"
              placeholder="Note Title"
            />
            <textarea 
              required
              value={newNote.content} onChange={e => setNewNote({...newNote, content: e.target.value})}
              className="w-full resize-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-40 text-slate-800 placeholder:text-slate-400"
              placeholder="What's on your mind?"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">
                Cancel
              </button>
              <button type="submit" disabled={!newNote.title.trim() && !newNote.content.trim()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
