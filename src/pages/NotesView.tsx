import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Tag, StickyNote } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export function NotesView() {
  const { notes, addNote, deleteNote } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const colors = ['bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-pink-100', 'bg-purple-100', 'bg-orange-100', 'bg-indigo-100'];

  const handleSave = () => {
    if (!newTitle.trim() && !newContent.trim()) return;
    addNote({
      title: newTitle.trim() || 'Untitled Note',
      content: newContent.trim(),
      tags: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 md:hidden">Quick Notes</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm ml-auto"
        >
          <Plus className="h-4 w-4" /> New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          
          {/* Add New Note Card */}
          {isAdding && (
            <div className="bg-white border rounded-2xl p-5 shadow-lg shadow-black/5 ring-2 ring-indigo-500 relative flex flex-col min-h-[250px] animate-in zoom-in-95 duration-200">
              <input
                type="text"
                placeholder="Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="text-lg font-bold text-slate-900 placeholder:text-slate-400 bg-transparent border-0 focus:ring-0 p-0 mb-3 outline-none"
                autoFocus
              />
              <textarea
                placeholder="Write your note here..."
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                className="flex-1 resize-none bg-transparent border-0 focus:ring-0 p-0 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Save Note
                </button>
              </div>
            </div>
          )}

          {notes.length === 0 && !isAdding ? (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
              <StickyNote className="h-12 w-12 text-slate-200 mb-3" />
              <p>No notes yet. Click the button above or tell the AI to create one!</p>
            </div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id} 
                className={cn(
                  "rounded-2xl p-5 shadow-sm transition-all hover:shadow-md relative group flex flex-col min-h-[200px]",
                  note.color.replace('bg-', 'bg-').replace('-100', '-50 border border-t-2') // Let's make it look slightly more polished
                )}
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-slate-900 pr-8">{note.title}</h3>
                  <button 
                    onClick={() => deleteNote(note.id)}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-500 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity bg-white/50 rounded-lg hover:bg-white pb-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-slate-800 text-sm whitespace-pre-wrap flex-1 mb-4">
                  {note.content}
                </p>

                <div className="mt-auto flex items-center justify-between">
                   <div className="flex flex-wrap gap-1">
                     {note.tags.map(tag => (
                       <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/60 text-slate-700">
                         {tag}
                       </span>
                     ))}
                   </div>
                   <span className="text-[10px] text-slate-500 font-medium">
                     {format(note.createdAt, 'MMM d, yyyy')}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
