import { NavLink, Link, Outlet, useLocation } from 'react-router-dom';
import { 
  Lightbulb, 
  Wrench, 
  Cpu, 
  Code, 
  Menu, 
  X, 
  Settings, 
  ChevronDown, 
  ArrowRight, 
  Sparkles,
  Bot
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Background from './Background';

const navItems = [
  { path: '/', label: 'Home' },
  { 
    label: 'Innovation', 
    id: 'innovation',
    dropdown: [
      { path: '/innovation', label: 'System Overview', icon: Lightbulb, desc: 'Wearable tremor suppression glove concept & feedback loop' },
      { path: '/innovation/mechanical', label: 'Mechanical & CAD', icon: Wrench, desc: 'A strong glove frame shaped for comfort, using lightweight materials that balance durability with everyday wear.' },
      { path: '/innovation/electronics', label: 'Electronics & Power', icon: Cpu, desc: 'Smart sensors and a safe power system combine to track hand motion accurately while keeping performance reliable.' },
      { path: '/innovation/programming', label: 'Programming & Logic', icon: Code, desc: 'Simple software separates tremors from real gestures, allowing natural movement to come through clearly.' },
    ]
  },
  { 
    label: 'Competition Robot', 
    id: 'robot',
    dropdown: [
      { path: '/robot/mechanical', label: 'Mechanical & CAD', icon: Wrench, desc: 'A tough robot frame with protective armor and strong parts designed to handle heavy hits in the arena.' },
      { path: '/robot/electronics', label: 'Electronics & Power', icon: Cpu, desc: 'Reliable batteries and smart circuits deliver steady power, keeping the robot’s motors and sensors running safely.' },
      { path: '/robot/programming', label: 'Programming & Logic', icon: Code, desc: 'Control software manages weapon spin and driving smoothly, while safety checks prevent system failures during matches.' },
    ]
  },
  { path: '/challenges', label: 'Challenges' },
  { path: '/blog', label: 'Season Blog' },
  { path: '/media', label: 'Media' },
  { path: '/team', label: 'Team & Mentors' },
  { path: '/resources', label: 'Resources' },
];

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Scroll detection for navbar blur depth
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown and scroll to top on navigation
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#06050a] text-zinc-100 font-sans flex flex-col relative selection:bg-purple-600 selection:text-white">
      <Background />

      {/* Floating / Sticky Top Navigation Bar (Ridgevyn Style) */}
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled 
            ? 'bg-[#07050d]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.8)]' 
            : 'bg-[#07050d]/70 backdrop-blur-lg border-b border-white/[0.05]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-purple-950/60 border border-purple-500/40 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:border-purple-400 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all">
              <img 
                src="/logo.jpeg" 
                alt="NRL Orbigent Logo" 
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.nextElementSibling?.classList.remove('hidden'); 
                }} 
              />
              <div className="w-full h-full hidden bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-lg items-center justify-center rounded-lg">
                O
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-purple-200 transition-colors">
                  NRL ORBIGENT
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-950/80 border border-purple-500/30 text-purple-300">
                  TEAM 160
                </span>
              </div>
              <span className="text-[11px] text-zinc-400 font-light tracking-wide">
                Season 2026 Showcase
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav 
            ref={navContainerRef}
            className="hidden xl:flex items-center gap-1 bg-black/40 border border-white/[0.08] p-1.5 rounded-full backdrop-blur-md"
          >
            {navItems.map((item) => {
              if (item.dropdown) {
                const isDropdownOpen = activeDropdown === item.label;
                const isItemActive = item.id === 'innovation'
                  ? location.pathname.startsWith('/innovation')
                  : item.id === 'robot'
                  ? location.pathname.startsWith('/robot')
                  : false;

                return (
                  <div 
                    key={item.label} 
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveDropdown(isDropdownOpen ? null : item.label)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                        isItemActive
                          ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                          : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown size={13} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-3 w-[22rem] bg-[#0c0915]/95 border border-white/10 rounded-2xl p-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 flex flex-col gap-1"
                        >
                          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-400 border-b border-white/[0.06] mb-1">
                            {item.label} Subsystems
                          </div>
                          {item.dropdown.map((sub) => {
                            const Icon = sub.icon;
                            const isSubActive = location.pathname === sub.path;
                            return (
                              <Link
                                key={sub.path}
                                to={sub.path}
                                onClick={() => setActiveDropdown(null)}
                                className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                                  isSubActive
                                    ? 'bg-purple-950/60 border border-purple-500/30 text-white'
                                    : 'hover:bg-white/[0.05] text-zinc-300 hover:text-white'
                                }`}
                              >
                                <div className="p-2 rounded-lg bg-purple-950/80 border border-purple-500/20 text-purple-300 shrink-0 mt-0.5">
                                  <Icon size={16} />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold">{sub.label}</span>
                                  <span className="text-[11px] text-zinc-400 font-light leading-snug mt-0.5">{sub.desc}</span>
                                </div>
                              </Link>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path!}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                      isActive
                        ? 'bg-purple-600/20 text-white border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                        : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Header Actions (Ridgevyn CTA Pill) */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/admin"
              className={`p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-purple-500/40 hover:bg-white/[0.04] transition-all ${
                location.pathname === '/admin' ? 'bg-purple-950/60 border-purple-500/40 text-purple-300' : ''
              }`}
              title="Admin Dashboard"
            >
              <Settings size={18} />
            </Link>

            <Link
              to="/challenges"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white font-medium text-xs tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles size={14} className="text-purple-200" />
              <span>Season Checkpoints</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile Menu Toggle (Visible below xl) */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/admin"
              className="sm:hidden p-2 rounded-full border border-white/10 text-zinc-300 hover:text-white"
              title="Admin Dashboard"
            >
              <Settings size={18} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-zinc-200 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden border-b border-white/10 bg-[#08060d]/95 backdrop-blur-2xl px-6 py-6 overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="flex flex-col space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                  Navigation
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => {
                    if (item.dropdown) return null;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path!}
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive
                              ? 'bg-purple-950/80 text-white border border-purple-500/40'
                              : 'text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:text-white hover:bg-white/[0.06]'
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    );
                  })}
                </div>

                {/* Innovation Section */}
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 pt-2 border-t border-white/[0.06]">
                  Innovation Subsystems
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NavLink
                    to="/innovation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Lightbulb size={16} className="text-purple-400" />
                    System Overview
                  </NavLink>
                  <NavLink
                    to="/innovation/mechanical"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Wrench size={16} className="text-purple-400" />
                    Mechanical & CAD
                  </NavLink>
                  <NavLink
                    to="/innovation/electronics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Cpu size={16} className="text-purple-400" />
                    Electronics & Power
                  </NavLink>
                  <NavLink
                    to="/innovation/programming"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Code size={16} className="text-purple-400" />
                    Programming & Logic
                  </NavLink>
                </div>

                {/* Competition Robot Section */}
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 pt-2 border-t border-white/[0.06]">
                  Competition Robot Subsystems
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NavLink
                    to="/robot/mechanical"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Wrench size={16} className="text-purple-400" />
                    Mechanical & CAD
                  </NavLink>
                  <NavLink
                    to="/robot/electronics"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Cpu size={16} className="text-purple-400" />
                    Electronics & Power
                  </NavLink>
                  <NavLink
                    to="/robot/programming"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06]"
                  >
                    <Code size={16} className="text-purple-400" />
                    Programming & Logic
                  </NavLink>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-xs font-semibold text-purple-300"
                  >
                    <Settings size={16} />
                    <span>Admin Dashboard</span>
                  </Link>

                  <Link
                    to="/challenges"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-medium"
                  >
                    <span>Checkpoints</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>

      {/* Ridgevyn-Inspired High-End Dark Footer */}
      <footer className="w-full relative z-10 border-t border-white/[0.08] bg-[#07050d] text-zinc-400 overflow-hidden">
        {/* Ambient Top Glow */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" 
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            
            {/* Brand Column */}
            <div className="lg:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl overflow-hidden bg-purple-950/60 border border-purple-500/40 p-0.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">NRL ORBIGENT 160</h3>
                  <p className="text-xs text-purple-400 font-medium">National Robotics League • 2026</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Combat robotics and wearable medical engineering at School of India.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/50 border border-purple-800/40 text-xs text-purple-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>NRL 2026 CONTENDER</span>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-purple-300 transition-colors">Home / About</Link></li>
                <li><Link to="/challenges" className="hover:text-purple-300 transition-colors">Season Challenges</Link></li>
                <li><Link to="/blog" className="hover:text-purple-300 transition-colors">Season Journey Blog</Link></li>
                <li><Link to="/media" className="hover:text-purple-300 transition-colors">Media Highlights</Link></li>
                <li><Link to="/team" className="hover:text-purple-300 transition-colors">Team & Mentors</Link></li>
                <li><Link to="/resources" className="hover:text-purple-300 transition-colors">Downloads & Binders</Link></li>
              </ul>
            </div>

            {/* Innovation Subsystems */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Innovation Glove</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/innovation" className="hover:text-purple-300 transition-colors">System Overview</Link></li>
                <li><Link to="/innovation/mechanical" className="hover:text-purple-300 transition-colors">Mechanical & CAD</Link></li>
                <li><Link to="/innovation/electronics" className="hover:text-purple-300 transition-colors">Electronics & Power</Link></li>
                <li><Link to="/innovation/programming" className="hover:text-purple-300 transition-colors">Programming & Logic</Link></li>
              </ul>
            </div>

            {/* Competition Robot Subsystems */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Competition Robot</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/robot/mechanical" className="hover:text-purple-300 transition-colors">Mechanical & CAD</Link></li>
                <li><Link to="/robot/electronics" className="hover:text-purple-300 transition-colors">Electronics & Power</Link></li>
                <li><Link to="/robot/programming" className="hover:text-purple-300 transition-colors">Programming & Logic</Link></li>
              </ul>
            </div>

            {/* Portal & Docs */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources & Portal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/admin" className="hover:text-purple-300 transition-colors flex items-center gap-1.5"><Settings size={14} /> Admin Access</Link></li>
                <li><Link to="/resources" className="hover:text-purple-300 transition-colors">Resources</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Divider & Copyright */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-zinc-500">
            <p>© {new Date().getFullYear()} Team Orbigent 160 • School of India Robotics Club. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="text-zinc-500">National Robotics League Showcase</span>
              <span className="text-purple-400 font-mono text-[11px]">HAAS CNC • ESP32 • SOLIDWORKS</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
