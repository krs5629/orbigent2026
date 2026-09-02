import { NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  Lightbulb, 
  Wrench, 
  Cpu, 
  Code, 
  Target, 
  BookOpen, 
  Image, 
  Users, 
  Download,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const navItems = [
  { path: '/', label: 'Home / About', icon: Home },
  { path: '/innovation', label: 'Innovation Showcase', icon: Lightbulb },
  { path: '/mechanical', label: 'Mechanical', icon: Wrench },
  { path: '/electronics', label: 'Electronics', icon: Cpu },
  { path: '/programming', label: 'Programming', icon: Code },
  { path: '/challenges', label: 'Challenges', icon: Target },
  { path: '/blog', label: 'Season Blog', icon: BookOpen },
  { path: '/media', label: 'Media', icon: Image },
  { path: '/team', label: 'Team & Mentors', icon: Users },
  { path: '/resources', label: 'Resources', icon: Download },
  { path: '/admin', label: 'Admin Dashboard', icon: Settings },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900 overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center z-50 flex-shrink-0">
        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-base">O</div>
          NRL ORBIGENT
        </div>
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 left-0 w-64 bg-slate-900 flex flex-col p-6 space-y-6 z-50 md:hidden shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">O</div>
                  <span className="text-white font-bold tracking-tight text-lg">NRL ORBIGENT</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="flex flex-col space-y-1 overflow-y-auto pr-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md gap-3 ${
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="mt-auto pt-6 border-t border-slate-800">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Season 2026</p>
                <p className="text-xs text-slate-400">NRL Innovation Showcase</p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 flex-col p-6 space-y-6 flex-shrink-0 z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white text-xl">O</div>
          <span className="text-white font-bold tracking-tight text-lg leading-tight">NRL ORBIGENT</span>
        </div>
        <nav className="flex flex-col space-y-1 overflow-y-auto pr-2 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md gap-3 ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="opacity-80" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-800">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Season 2026</p>
          <p className="text-xs text-slate-400">NRL Innovation Showcase</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-full overflow-y-auto p-4 md:p-6">
        <div className="min-h-full w-full max-w-7xl mx-auto flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
