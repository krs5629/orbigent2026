import { motion } from 'motion/react';
import { Activity, Cpu, Hand, Zap, RotateCcw, Crosshair, ArrowRight, ShieldCheck, Sparkles, Wrench, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Innovation() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-12"
    >
      {/* Header section with Ridgevyn style */}
      <header className="space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 backdrop-blur-md">
          <Sparkles size={14} className="text-purple-400" />
          <span>INNOVATION SHOWCASE • SEASON 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Wearable Robotics for{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Tremor Suppression
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-4xl leading-relaxed font-light">
          A wearable closed-loop robotic system that senses Parkinsonian hand tremor and uses active mechanical counterforce to reduce unwanted movement in real-time.
        </p>

        {/* Quick Discipline Sub-tabs */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link 
            to="/innovation/mechanical" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-purple-950/40 border border-white/[0.08] hover:border-purple-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <Wrench size={14} className="text-purple-400" />
            <span>Mechanical Counterforce</span>
            <ArrowRight size={12} />
          </Link>
          <Link 
            to="/innovation/electronics" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-purple-950/40 border border-white/[0.08] hover:border-purple-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <Cpu size={14} className="text-purple-400" />
            <span>Dual IMU Kinematics</span>
            <ArrowRight size={12} />
          </Link>
          <Link 
            to="/innovation/programming" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-purple-950/40 border border-white/[0.08] hover:border-purple-500/40 text-xs font-semibold text-zinc-300 hover:text-white transition-all"
          >
            <Code size={14} className="text-purple-400" />
            <span>Real-Time Filtering</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </header>

      {/* Idea / Concept Hero Card */}
      <section className="bg-gradient-to-br from-[#120924] via-[#090712] to-[#050508] rounded-3xl p-8 sm:p-12 border border-purple-500/30 shadow-[0_0_35px_rgba(168,85,247,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Hand size={180} className="text-purple-400" />
        </div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold uppercase tracking-wider text-purple-300">
            Project Overview
          </div>
          <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/20">
            ACTIVE PROTOTYPE
          </span>
        </div>
        <div className="relative z-10 max-w-4xl space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Smart Tremor Suppression Glove
          </h2>
          <p className="text-zinc-300 text-base sm:text-lg leading-relaxed font-light">
            A smart robotic glove designed to detect involuntary hand tremors associated with Parkinson’s disease and actively reduce them. Two motion sensors continuously measure the hand and forearm movement. An ESP32 processes the sensor data, identifies the tremor, and commands small servo motors to apply counteracting forces through a tendon mechanism. The goal is to reduce unwanted shaking while allowing the user to make intentional movements.
          </p>
          <div className="pt-4 flex items-center gap-2 text-sm text-purple-400 font-medium">
            <ShieldCheck size={18} />
            <span>Closed-loop negative feedback with intentional motion pass-through</span>
          </div>
        </div>
      </section>

      {/* How It Works Flowchart */}
      <section className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-purple-500/30 p-8 sm:p-10 shadow-xl transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Control Architecture</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Activity className="text-purple-400" />
              How it Works: The Feedback Loop
            </h2>
          </div>
        </div>
        
        <p className="text-zinc-300 leading-relaxed text-base sm:text-lg mb-8 max-w-3xl">
          The system continuously measures the hand's movement, estimates the tremor component, applies an opposing mechanical force, and then measures the result again through a continuous feedback loop.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { step: '1. Detect', desc: 'Motion sensors capture real-time hand and forearm kinematics.', icon: Activity },
            { step: '2. Analyze', desc: 'ESP32 processes data to isolate tremor from intentional movement.', icon: Cpu },
            { step: '3. Counteract', desc: 'Servos apply precise opposing forces via the tendon mechanism.', icon: Crosshair },
            { step: '4. Re-measure', desc: 'Sensors evaluate the resulting stabilization in a closed loop.', icon: RotateCcw },
          ].map((item, i) => (
            <div key={i} className="relative flex flex-col bg-zinc-900/40 p-6 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-300 group">
              <div className="bg-purple-500/10 text-purple-400 w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-105 transition-transform">
                <item.icon size={22} />
              </div>
              <h3 className="font-bold text-white mb-2 text-base">{item.step}</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Core Components Grid */}
      <section className="bg-zinc-950/80 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-xl transition-all">
        <div className="mb-6">
          <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">Hardware Breakdown</div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Zap className="text-purple-400" />
            Core Components
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { name: 'ESP32 Microcontroller', desc: 'Handles central processing and motor control algorithms.' },
            { name: '2× MPU-6050', desc: 'IMU sensors to detect hand/forearm motion and identify tremors.' },
            { name: '5× MG90S Servos', desc: 'Actuators that generate the required mechanical counterforce.' },
            { name: 'Tendon System', desc: 'Transfers the servo force precisely to the fingers and hand.' },
            { name: 'Wearable Glove', desc: 'The physical platform that houses the mechanism comfortably.' },
            { name: 'Power Supply', desc: 'Provides portable, stable power to the electronics and actuators.' }
          ].map((comp, i) => (
            <div key={i} className="p-6 bg-zinc-900/40 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-950/10 transition-all flex flex-col justify-center">
              <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider text-purple-200">{comp.name}</h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
