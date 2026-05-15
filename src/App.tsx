/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppLayout } from './components/layout/AppLayout';
import { useStore } from './store';
import { DashboardView } from './pages/DashboardView';
import { TasksView } from './pages/TasksView';
import { CalendarView } from './pages/CalendarView';
import { FocusTimerView } from './pages/FocusTimerView';
import { NotesView } from './pages/NotesView';

export default function App() {
  const currentView = useStore((state) => state.currentView);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'tasks': return <TasksView />;
      case 'calendar': return <CalendarView />;
      case 'timer': return <FocusTimerView />;
      case 'notes': return <NotesView />;
      default: return <DashboardView />;
    }
  };

  return (
    <AppLayout>
      {renderView()}
    </AppLayout>
  );
}
