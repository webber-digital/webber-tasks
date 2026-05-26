/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from './components/layout/AppLayout';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';

// Lazy load pages for faster initial load
const DashboardView = React.lazy(() => import('./pages/DashboardView').then(m => ({ default: m.DashboardView })));
const TasksView = React.lazy(() => import('./pages/TasksView').then(m => ({ default: m.TasksView })));
const FocusTimerView = React.lazy(() => import('./pages/FocusTimerView').then(m => ({ default: m.FocusTimerView })));
const NotesView = React.lazy(() => import('./pages/NotesView').then(m => ({ default: m.NotesView })));
const BlogsView = React.lazy(() => import('./pages/BlogsView').then(m => ({ default: m.BlogsView })));
const BlogPostView = React.lazy(() => import('./pages/BlogsView').then(m => ({ default: m.BlogPostView })));
const StudyView = React.lazy(() => import('./pages/StudyView').then(m => ({ default: m.StudyView })));

function PageSkeleton() {
  return (
    <div className="w-full h-full p-4 md:p-8 space-y-8 animate-pulse">
      {/* Title skeleton */}
      <div className="w-1/3 h-10 bg-slate-200 rounded-xl"></div>
      
      {/* Hero card skeleton */}
      <div className="w-full h-64 bg-slate-200 rounded-[2rem]"></div>
      
      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full h-32 bg-slate-200 rounded-[2rem]"></div>
        <div className="w-full h-32 bg-slate-200 rounded-[2rem]"></div>
      </div>
      
      {/* List skeleton */}
      <div className="space-y-4">
        <div className="w-full h-20 bg-slate-200 rounded-2xl"></div>
        <div className="w-full h-20 bg-slate-200 rounded-2xl"></div>
        <div className="w-full h-20 bg-slate-200 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <AppLayout>
        <Suspense fallback={<PageSkeleton />}>
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
        </Suspense>
      </AppLayout>
    </>
  );
}
