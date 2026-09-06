import { motion } from 'motion/react';
import { 
  Rocket, 
  Target, 
  ArrowRight, 
  Wrench, 
  Cpu, 
  Code, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-16 sm:space-y-24 pb-16"
    >
      {/* =========================================================================
          1. HERO SECTION (Ridgevyn Monumental Headline + Pill Badge + Actions)
         ========================================================================= */}
      <section className="relative pt-6 sm:pt-12 text-center flex flex-col items-center max-w-4xl mx-auto">
        
        {/* Top Eyebrow Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white">TEAM ORBIGENT 160</span>
          <span className="text-purple-400">•</span>
          <span className="text-zinc-300">NRL 2026 SHOWCASE</span>
        </div>

        {/* Monumental Headline with Purple Gradient */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1] mb-6">
          Pioneering Next-Gen Robotics for the{' '}
          <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
            2026 NRL Arena
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed mb-10 font-light">
          We are pushing robotics beyond competition by building two breakthrough systems: high‑performance battle bots for the NRL arena, and a wearable glove that stabilizes hand tremors. Together, these projects bridge fun, high‑energy engineering with real‑world medical impact, showing how robotics can fight in the arena and heal in daily life..
        </p>

        {/* CTA Button Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md sm:max-w-none">
          <Link
            to="/innovation"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white text-sm sm:text-base font-semibold tracking-wide shadow-[0_0_25px_rgba(168,85,247,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Explore Innovation Process</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/innovation/mechanical"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-purple-500/40 text-sm sm:text-base font-medium tracking-wide transition-all backdrop-blur-md cursor-pointer"
          >
            <Layers size={18} className="text-purple-300" />
            <span>View Robot CAD Models</span>
          </Link>
        </div>

        {/* 4 Metric / Highlight Cards (Ridgevyn Signature Style) */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full mt-14 sm:mt-18 text-center">
  {[
    { metric: 'TEAM JOURNEY' },
    { metric: 'ROBOT ENGINEERING' },
    { metric: 'INNOVATION PROJECTS' },
    { metric: 'TECHNICAL RESOURCES' },
  ].map((stat, idx) => (
    <div 
      key={idx}
      className="flex items-center justify-center p-6 rounded-2xl bg-[#0e0b18]/70 border border-white/[0.08] hover:border-purple-500/30 transition-all backdrop-blur-xl shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]"
    >
      <div className="text-lg sm:text-xl font-bold text-white tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
        {stat.metric}
      </div>
    </div>
  ))}
</div>




      </section>

      {/* =========================================================================
          2. CORE MISSION & FOUNDATION (2 High-Contrast Ridgevyn Feature Cards)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400">Our Foundation</div>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">Engineering Driven by Purpose</h2>
          <p className="text-sm text-zinc-400 font-light">Combining competitive combat robotics with impactful biomedical innovation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Our Mission */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0e0b18]/80 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-105 transition-transform">
                <Target size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">Our Mission</h3>
                <p className="text-zinc-300 leading-relaxed text-base font-light">
                  To design and build a combat robot that exemplifies robust engineering principles while pushing the boundaries of autonomous control and innovative material science. We strive to learn, adapt, and share our knowledge with the STEM community.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/[0.06]">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">Material Science</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">Autonomous Control</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">STEM Knowledge Sharing</span>
            </div>
          </div>

          {/* Card 2: Why NRL? */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#0e0b18]/80 border border-white/[0.08] hover:border-purple-500/40 transition-all duration-300 backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col justify-between group">
            <div className="space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.25)] group-hover:scale-105 transition-transform">
                <Rocket size={28} />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-white tracking-tight">Why NRL?</h3>
                <p className="text-zinc-300 leading-relaxed text-base font-light">
                  The National Robotics League gives us the ultimate testing ground. It bridges the gap between theoretical classroom physics and real-world applied engineering. It's not just about winning battles; it's about mastering the manufacturing process.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 mt-6 border-t border-white/[0.06]">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">Design-to-Fabrication</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">Precision CNC Machining</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-950/50 border border-purple-500/20 text-purple-300">Real-World Rigor</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. ABOUT WESTSIDE TECH (Ridgevyn Feature Banner Card)
         ========================================================================= */}
     <section className="relative rounded-3xl bg-gradient-to-br from-[#120a24] via-[#0d071a] to-[#080510] border border-purple-500/30 p-8 sm:p-14 overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)]">
  {/* Subtle decorative purple glow orbs */}
  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
  <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
    <div className="lg:col-span-8 space-y-5">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs font-semibold uppercase tracking-wider text-purple-300">
        <Sparkles size={13} />
        <span>About School of India Team</span>
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
       From Ideas to Action
      </h2>

      <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl">
        We are a student team from School of India, working together to design and build robots for the NRL 2026 Arena. 
        Our focus is on learning, experimenting, and creating — from early CAD sketches to working machines ready for competition.
      </p>

      <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-purple-300">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Team Collaboration</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Creative Engineering</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Competition Ready</span>
        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Innovation Spirit</span>
      </div>
    </div>

    <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
      <Link
        to="/innovation"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all text-center"
      >
        <span>Explore Our Process</span>
        <ArrowRight size={16} />
      </Link>

      <Link
        to="/innovation/mechanical"
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-purple-500/40 text-sm font-medium transition-all text-center backdrop-blur-md"
      >
        <span>View CAD Models</span>
      </Link>
    </div>
  </div>
</section>


      {/* =========================================================================
          4. ROBOT & INNOVATION SUBSYSTEMS (Ridgevyn 3-Column Architecture)
         ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400">Engineering Disciplines</div>
            <h2 className="text-3xl font-semibold text-white tracking-tight mt-1">Core Subsystem Architecture For Smart Tremor Suppression Glove</h2>
          </div>
          <Link
            to="/innovation"
            className="inline-flex items-center gap-1 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span>View Full System Overview</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Subsystem 1: Mechanical */}
          <Link
            to="/innovation/mechanical"
            className="group p-6 sm:p-8 rounded-3xl bg-[#0e0b18]/70 border border-white/[0.08] hover:border-purple-500/50 hover:bg-[#130f24]/80 transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                <Wrench size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Mechanical & CAD</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  Billet 6061-T6 aluminum chassis, CNC toolpaths, and tendon pulleys engineered for maximum impact absorption.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 pt-6 mt-6 border-t border-white/[0.06] group-hover:translate-x-1 transition-transform">
              <span>Explore CAD revisions</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Subsystem 2: Electronics */}
          <Link
            to="/innovation/electronics"
            className="group p-6 sm:p-8 rounded-3xl bg-[#0e0b18]/70 border border-white/[0.08] hover:border-purple-500/50 hover:bg-[#130f24]/80 transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                <Cpu size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Electronics & Power</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  Dual MPU-6050 6-axis IMUs, custom power buses, and high-frequency PWM motor controllers with safety fail-safes.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 pt-6 mt-6 border-t border-white/[0.06] group-hover:translate-x-1 transition-transform">
              <span>View schematics & logs</span>
              <ArrowRight size={14} />
            </div>
          </Link>

          {/* Subsystem 3: Programming */}
          <Link
            to="/innovation/programming"
            className="group p-6 sm:p-8 rounded-3xl bg-[#0e0b18]/70 border border-white/[0.08] hover:border-purple-500/50 hover:bg-[#130f24]/80 transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all shadow-md">
                <Code size={22} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">Programming & Logic</h3>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                  Real-time ESP32 firmware executing predictive PID loops to decouple voluntary intentional gestures from tremor noise.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 pt-6 mt-6 border-t border-white/[0.06] group-hover:translate-x-1 transition-transform">
              <span>Inspect algorithms</span>
              <ArrowRight size={14} />
            </div>
          </Link>
        </div>
      </section>

      {/* =========================================================================
          5. CALL TO ACTION / CHECKPOINTS JUMP (Ridgevyn Footer CTA)
         ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0e0b18]/90 border border-purple-500/20 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold text-white">Track Our Season Progress</h3>
          <p className="text-zinc-400 text-sm font-light">
            Stay updated on all 12 NRL challenges, build blogs, and engineering milestones.
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/challenges"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs sm:text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:scale-[1.02] transition-all"
          >
            <span>View 12 Challenges</span>
            <ArrowRight size={15} />
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs sm:text-sm font-medium transition-all"
          >
            <span>Read Season Blog</span>
          </Link>
        </div>
      </section>

    </motion.div>
  );
}
