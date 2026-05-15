import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../store';
import { ViewMode } from '../../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Clock, 
  StickyNote,
  Menu,
  X,
  Plus,
  ChevronDown,
  Bell,
  BellRing
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { GlobalModals } from '../GlobalModals';
import { motion } from 'motion/react';
import { AdSenseBlock } from '../AdSenseBlock';

function NotificationButton() {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported ? window.Notification.permission : 'default'
  );
  const [showMessage, setShowMessage] = useState('');
  
  const handleRequestPermission = () => {
    if (!isSupported) {
      setShowMessage("Notifications are not supported in this browser.");
      return;
    }

    // Check if running in an iframe (like AI Studio preview environment)
    const isInIframe = window.self !== window.top;
    
    if (permission === 'granted') {
      try {
        const notif = new Notification('Webber.Tasks', {
          body: 'Notifications are working!',
        });
        notif.onclick = () => window.focus();
      } catch (e) {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistration().then((reg) => {
            if (reg) {
              reg.showNotification('Webber.Tasks', { body: 'Notifications are working!' });
            } else {
              setShowMessage("Please open the app in a new tab to receive notifications.");
            }
          });
        } else {
          setShowMessage("Couldn't show notification. Try opening in a new tab.");
        }
      }
      return;
    }

    if (isInIframe) {
      setShowMessage("Please click the 'Open in new tab' button at the top right of the preview to enable notifications.");
      return;
    }

    try {
      Notification.requestPermission().then((perm) => {
        setPermission(perm);
        if (perm === 'granted') {
          try {
            new Notification('Notifications Enabled!', {
              body: 'You will now receive updates here.',
            });
          } catch(e) {
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) reg.showNotification('Notifications Enabled!');
              });
            }
          }
          setShowMessage('');
        } else if (perm === 'denied' && !isInIframe) {
           setShowMessage('Notifications are blocked in your browser settings.');
        }
      }).catch((e) => {
         setShowMessage("Could not request permissions. Try opening in a new tab.");
      });
    } catch (e) {
       setShowMessage("Could not request permissions. Try opening in a new tab.");
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRequestPermission}
        className={cn(
          "relative p-2.5 rounded-full transition-colors flex items-center justify-center",
          permission === 'granted' ? "text-indigo-600 bg-indigo-50 hover:bg-indigo-100" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        )}
        title={isSupported ? (permission === 'granted' ? "Notifications Enabled" : "Enable Notifications") : "Notifications Not Supported"}
      >
        {permission === 'granted' ? (
          <>
            <BellRing className="h-5 w-5" />
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-[6px] right-[6px] w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-indigo-50"
            />
          </>
        ) : (
          <Bell className="h-5 w-5" />
        )}
      </motion.button>

      {showMessage && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full right-0 mt-3 w-64 bg-slate-800 text-white p-3 rounded-xl shadow-xl z-50 text-sm"
        >
          <div className="flex justify-between items-start gap-2">
            <p className="leading-tight">{showMessage}</p>
            <button onClick={() => setShowMessage('')} className="text-slate-400 hover:text-white shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  view: ViewMode;
  isActive: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, view, isActive, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        isActive 
          ? "bg-indigo-50 text-indigo-700 font-medium" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-indigo-700" : "text-slate-400")} />
      <span>{label}</span>
    </button>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentView, setCurrentView, setActiveModal } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const navItems: { icon: React.ElementType; label: string; view: ViewMode }[] = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: CheckSquare, label: 'Tasks', view: 'tasks' },
    { icon: CalendarIcon, label: 'Calendar', view: 'calendar' },
    { icon: Clock, label: 'Focus Timer', view: 'timer' },
    { icon: StickyNote, label: 'Notes', view: 'notes' },
  ];

  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const AddMenuDropdown = ({ className }: { className?: string }) => (
    <div className={cn("absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-50 py-1 overflow-hidden", className)}>
      <button 
        onClick={() => { setActiveModal('task'); setIsAddMenuOpen(false); }}
        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <CheckSquare className="h-4 w-4 text-indigo-500" /> New Task
      </button>
      <button 
        onClick={() => { setActiveModal('event'); setIsAddMenuOpen(false); }}
        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
      >
        <CalendarIcon className="h-4 w-4 text-emerald-500" /> New Event
      </button>
      <button 
        onClick={() => { setActiveModal('note'); setIsAddMenuOpen(false); }}
        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 border-t border-slate-100"
      >
        <StickyNote className="h-4 w-4 text-amber-500" /> Quick Note
      </button>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
        <div className="font-bold text-xl text-indigo-600 flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 -ml-2 mr-1">
            {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
          </button>
          <div className="w-6 h-6 bg-indigo-600 rounded-md flex items-center justify-center shrink-0">
            <div className="w-3 h-3 bg-white rounded-sm"></div>
          </div>
          Webber.Tasks
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationButton />
          <div className="relative" ref={addMenuRef}>
            <button 
              onClick={() => setIsAddMenuOpen(!isAddMenuOpen)} 
              className="p-2 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
            {isAddMenuOpen && <AddMenuDropdown className="top-full right-0 mt-2" />}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:static md:translate-x-0 flex flex-col shrink-0",
        isMobileMenuOpen ? "translate-x-0 pt-16" : "-translate-x-full"
      )}>
        <div className="hidden md:flex items-center gap-3 p-6 shrink-0 border-b border-slate-50">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Webber.Tasks</span>
        </div>
        
        <div className="p-4 hidden md:block relative z-40">
           <button 
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="w-full bg-indigo-600 text-white rounded-xl py-2.5 px-4 font-semibold text-sm flex items-center justify-center gap-2 shadow-sm hover:bg-indigo-700 transition-colors"
           >
             <Plus className="h-4 w-4" /> Create New <ChevronDown className="h-4 w-4 ml-1 opacity-70" />
           </button>
           {isAddMenuOpen && <AddMenuDropdown className="top-full left-0 mt-2 w-full origin-top" />}
        </div>

        <nav className="flex-1 px-4 space-y-1 py-4 md:py-0 overflow-y-auto relative z-50">
          {navItems.map((item) => (
            <SidebarItem
              key={item.view}
              {...item}
              isActive={currentView === item.view}
              onClick={() => handleNavClick(item.view)}
            />
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0">
          <div className="flex flex-1 items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 capitalize">
              {currentView === 'dashboard' ? 'Morning Dashboard' : currentView}
            </h2>
            <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationButton />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-semibold text-slate-900">Guest User</p>
                <p className="text-xs text-slate-500">Pro Member</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold">
                G
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full relative p-4 pt-20 md:pt-6 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl min-h-full flex flex-col w-full gap-6">
            {/* Top Ad Block */}
            <div className="w-full shrink-0">
              <AdSenseBlock className="w-full min-h-[90px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden" format="auto" />
            </div>

            <div className="flex-1">
              {children}
            </div>

            {/* Bottom Ad Blocks */}
            <div className="mt-auto pt-8 pb-4 shrink-0 flex justify-center">
               <div className="w-full max-w-md">
                 <AdSenseBlock className="w-full min-h-[90px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden" format="auto" />
               </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Creation Modals */}
      <GlobalModals />
    </div>
  );
}
