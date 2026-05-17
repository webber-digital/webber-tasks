import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Event, Note, ViewMode, Priority } from './types';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface TimerConfig {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
  alarmType: 'beep' | 'chime' | 'digital';
  theme: string;
}

interface TimerState {
  isActive: boolean;
  mode: 'work' | 'break';
  timeLeft: number;
  targetTime: number | null;
}

interface AppState {
  currentView: ViewMode;
  setCurrentView: (view: ViewMode) => void;
  
  timerConfig: TimerConfig;
  setTimerConfig: (config: Partial<TimerConfig>) => void;
  timerState: TimerState;
  setTimerState: (updates: Partial<TimerState>) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;

  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;

  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  activeModal: 'task' | 'event' | 'note' | null;
  setActiveModal: (modal: 'task' | 'event' | 'note' | null) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentView: 'dashboard',
      setCurrentView: (currentView) => set({ currentView }),

      timerConfig: {
    workDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
    alarmType: 'beep',
    theme: 'indigo',
  },
  setTimerConfig: (config) => set((state) => ({ timerConfig: { ...state.timerConfig, ...config } })),
  
  timerState: {
    isActive: false,
    mode: 'work',
    timeLeft: 25 * 60,
    targetTime: null,
  },
  setTimerState: (updates) => set((state) => ({ timerState: { ...state.timerState, ...updates } })),
  
  activeModal: null,
      setActiveModal: (activeModal) => set({ activeModal }),

      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [{ ...task, id: generateId(), createdAt: new Date() }, ...state.tasks] })),
      updateTask: (id, updates) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t) })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
      toggleTaskCompletion: (id) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),

      events: [],
      addEvent: (event) => set((state) => ({ events: [{ ...event, id: generateId(), createdAt: new Date() }, ...state.events] })),
      updateEvent: (id, updates) => set((state) => ({ events: state.events.map(e => e.id === id ? { ...e, ...updates } : e) })),
      deleteEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),

      notes: [],
      addNote: (note) => set((state) => ({ notes: [{ ...note, id: generateId(), createdAt: new Date(), updatedAt: new Date() }, ...state.notes] })),
      updateNote: (id, updates) => set((state) => ({ notes: state.notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n) })),
      deleteNote: (id) => set((state) => ({ notes: state.notes.filter(n => n.id !== id) })),
    }),
    {
      name: 'wavedo-tasks-storage',
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          ...persistedState,
          tasks: persistedState.tasks?.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            dueDate: t.dueDate ? new Date(t.dueDate) : null
          })) ?? currentState.tasks,
          events: persistedState.events?.map((e: any) => ({
            ...e,
            createdAt: new Date(e.createdAt),
            date: new Date(e.date)
          })) ?? currentState.events,
          notes: persistedState.notes?.map((n: any) => ({
            ...n,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt)
          })) ?? currentState.notes,
        };
      }
    }
  )
);
