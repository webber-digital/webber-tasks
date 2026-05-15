import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, CheckCircle2, Circle, Calendar, Tag, Trash2, Folder, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { Priority } from '../types';

export function TasksView() {
  const { tasks, addTask, toggleTaskCompletion, deleteTask } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  
  // Advanced Task State
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    tags: '',
    folder: '',
    dueDate: ''
  });

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
    
    setNewTask({ title: '', description: '', priority: 'medium', tags: '', folder: '', dueDate: '' });
    setIsAdding(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col relative">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 md:hidden">Tasks</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm ml-auto"
        >
          <Plus className="h-4 w-4" /> Add Task
        </button>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <h3 className="font-bold flex items-center gap-2 text-slate-900">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            Active Tasks
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {tasks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <CheckCircle2 className="h-12 w-12 text-slate-200" />
              <p>No tasks yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={cn(
                    "group flex items-start gap-4 p-3 rounded-xl transition-colors border",
                    task.completed 
                      ? "bg-slate-50/50 border-transparent opacity-60" 
                      : "bg-white border-slate-100 hover:border-indigo-200"
                  )}
                >
                  <button 
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5 focus:outline-none flex-shrink-0"
                  >
                    {task.completed ? (
                      <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center text-white text-[10px]">✓</div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 rounded group-hover:border-indigo-400 transition-colors"></div>
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium",
                      task.completed ? "text-slate-500 line-through" : "text-slate-900"
                    )}>
                      {task.title}
                    </p>
                    
                    {task.description && !task.completed && (
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded font-bold uppercase",
                        task.priority === 'high' ? "bg-red-50 text-red-600" :
                        task.priority === 'medium' ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        {task.priority === 'high' ? 'High Priority' : task.priority}
                      </span>
                      {task.folder && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {task.folder}
                        </span>
                      )}
                      {task.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-2">
                    {task.dueDate && !task.completed && (
                      <p className={cn(
                        "text-xs font-medium",
                        task.dueDate < new Date() ? "text-red-600" : "text-slate-400"
                      )}>
                        {format(task.dueDate, 'MMM d, h:mm a')}
                      </p>
                    )}
                    {task.completed && <p className="text-xs text-emerald-600 font-bold">Done</p>}
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Task Creator Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50 text-slate-900">
              <h2 className="font-bold text-lg">Create Advanced Task</h2>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date (Optional)</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Folder (Optional)</label>
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
                <button 
                  type="button" 
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={!newTask.title.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
