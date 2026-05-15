export type Priority = 'low' | 'medium' | 'high';
export type ViewMode = 'dashboard' | 'tasks' | 'calendar' | 'timer' | 'notes' | 'blogs';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  tags: string[];
  folder?: string;
  dueDate?: Date | null;
  completed: boolean;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  time?: string;
  location?: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
