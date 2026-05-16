/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppLayout } from './components/layout/AppLayout';
import { useStore } from './store';
import { DashboardView } from './pages/DashboardView';
import { TasksView } from './pages/TasksView';
import { CalendarView } from './pages/CalendarView';
import { FocusTimerView } from './pages/FocusTimerView';
import { NotesView } from './pages/NotesView';
import { BlogsView } from './pages/BlogsView';
import { Logo } from './components/Logo';

export default function App() {
  const currentView = useStore((state) => state.currentView);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'tasks': return <TasksView />;
      case 'calendar': return <CalendarView />;
      case 'timer': return <FocusTimerView />;
      case 'notes': return <NotesView />;
      case 'blogs': return <BlogsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#040b1c] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                duration: 1,
                delay: 0.1
              }}
            >
              <Logo className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-8 text-2xl font-bold bg-gradient-to-r from-[#0055ff] via-[#00aaff] to-[#00d2ff] bg-clip-text text-transparent tracking-widest uppercase shadow-sm"
            >
              Webber
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
      <AppLayout>
        {renderView()}
      </AppLayout>
    </>
  );
}
