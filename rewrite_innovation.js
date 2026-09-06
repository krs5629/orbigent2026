import fs from 'fs';
import path from 'path';

const filePath = path.join('src', 'pages', 'Innovation.tsx');

const newContent = `import { motion } from 'motion/react';
import { Activity, Cpu, Hand, Zap, RotateCcw, Crosshair } from 'lucide-react';

export default function Innovation() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16"
    >
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Innovation Showcase</h1>
        <p className="text-lg text-white max-w-3xl leading-relaxed break-words">
          Wearable Robotics for Parkinson’s Tremor Suppression: A wearable closed-loop robotic system that senses Parkinsonian hand tremor and uses active mechanical counterforce to reduce unwanted movement.
        </p>
      </header>

      {/* Idea / Concept */}
      <section className="col-span-1 md:col-span-4 bg-[#050506] text-white shadow-[0_0_10px_rgba(192,132,252,0.2)] rounded-3xl p-6 sm:p-10 border border-[#c084fc]/30 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Hand size={160} className="text-[#c084fc]" />
        </div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#c084fc]">The Idea</h2>
          <span className="text-[10px] bg-[#c084fc] shadow-[0_0_15px_rgba(192,132,252,0.5)]/20 text-[#e3e5ef] px-3 py-1 rounded-full border border-indigo-500/30 font-mono">PROJECT OVERVIEW</span>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-4xl">
          <h3 className="text-2xl font-bold mb-4 text-[#eee3e3]">Smart Tremor Suppression Glove</h3>
          <p className="text-[#e0d8d8] text-lg leading-relaxed break-words">
            A smart robotic glove designed to detect involuntary hand tremors associated with Parkinson’s disease and actively reduce them. Two motion sensors continuously measure the hand and forearm movement. An ESP32 processes the sensor data, identifies the tremor, and commands small servo motors to apply counteracting forces through a tendon mechanism. The goal is to reduce unwanted shaking while allowing the user to make intentional movements.
          </p>
        </div>
      </section>

      {/* How It Works Flowchart */}
      <section className="col-span-1 md:col-span-4 bg-zinc-950/80 backdrop-blur-sm rounded-3xl border border-[#c084fc]/30 p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Activity className="text-[#c084fc]" />
          How it Works: The Feedback Loop
        </h2>
        
        <p className="text-[#e0d8d8] leading-relaxed break-words mb-8">
          The system continuously measures the hand's movement, estimates the tremor component, applies an opposing mechanical force, and then measures the result again through a continuous feedback loop.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1. Detect', desc: 'Motion sensors capture real-time hand and forearm kinematics.', icon: Activity },
            { step: '2. Analyze', desc: 'ESP32 processes data to isolate tremor from intentional movement.', icon: Cpu },
            { step: '3. Counteract', desc: 'Servos apply precise opposing forces via the tendon mechanism.', icon: Crosshair },
            { step: '4. Re-measure', desc: 'Sensors evaluate the resulting stabilization in a closed loop.', icon: RotateCcw },
          ].map((item, i) => (
            <div key={i} className="relative flex flex-col bg-zinc-900/50 p-6 rounded-2xl border border-[#c084fc]/20 shadow-sm transition-all hover:bg-zinc-900/80">
              <div className="bg-indigo-950 text-[#c084fc] w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-[#c084fc]/30 shadow-[0_0_15px_rgba(192,132,252,0.2)]">
                <item.icon size={24} />
              </div>
              <h3 className="font-bold text-[#eee3e3] mb-2">{item.step}</h3>
              <p className="text-sm text-[#e0d8d8] leading-relaxed break-words">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Core Components */}
      <section className="col-span-1 md:col-span-4 bg-zinc-950/80 backdrop-blur-sm border border-[#c084fc]/30 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Zap className="text-[#c084fc]" />
          Core Components
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'ESP32 Microcontroller', desc: 'Handles central processing and motor control algorithms.' },
            { name: '2× MPU-6050', desc: 'IMU sensors to detect hand/forearm motion and identify tremors.' },
            { name: '5× MG90S Servos', desc: 'Actuators that generate the required mechanical counterforce.' },
            { name: 'Tendon System', desc: 'Transfers the servo force precisely to the fingers and hand.' },
            { name: 'Wearable Glove', desc: 'The physical platform that houses the mechanism comfortably.' },
            { name: 'Power Supply', desc: 'Provides portable, stable power to the electronics and actuators.' }
          ].map((comp, i) => (
            <div key={i} className="p-5 bg-[#09090b] rounded-2xl border border-[#c084fc]/20 shadow-sm flex flex-col justify-center min-h-[120px]">
              <h4 className="font-bold text-[#eee3e3] mb-2 text-sm uppercase tracking-wider">{comp.name}</h4>
              <p className="text-sm text-[#e0d8d8] leading-relaxed break-words">{comp.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </motion.div>
  );
}
`;

fs.writeFileSync(filePath, newContent, 'utf8');
