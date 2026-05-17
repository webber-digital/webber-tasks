/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './pages/DashboardView';
import { TasksView } from './pages/TasksView';
import { FocusTimerView } from './pages/FocusTimerView';
import { NotesView } from './pages/NotesView';
import { BlogsView, BlogPostView } from './pages/BlogsView';
import { StudyView } from './pages/StudyView';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/tasks" element={<TasksView />} />
          <Route path="/timer" element={<FocusTimerView />} />
          <Route path="/notes" element={<NotesView />} />
          <Route path="/blogs" element={<BlogsView />} />
          <Route path="/blogs/:slug" element={<BlogPostView />} />
          <Route path="/study" element={<StudyView />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AppLayout>
    </>
  );
}
