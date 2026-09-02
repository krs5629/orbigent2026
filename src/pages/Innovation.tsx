import { motion } from 'motion/react';
import { Lightbulb, Wrench, Search, ArrowRight } from 'lucide-react';

export default function Innovation() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16"
    >
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Innovation Showcase</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          The core of our strategy this year isn't just power, it's intelligent design. We focused on survivability, rapid field repairs, and unique kinetic energy transfer mechanisms.
        </p>
      </header>

      {/* Process Flowchart */}
      <section className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Wrench className="text-indigo-500" />
          Our Engineering Process
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '1. Research', desc: 'Analyzing past arena matches to identify common failure points in armor.', icon: Search },
            { step: '2. Ideate', desc: 'Brainstorming modular chassis designs that can be swapped in under 5 minutes.', icon: Lightbulb },
            { step: '3. Prototype', desc: '3D printing PLA mockups to test internal clearances and weight distribution.', icon: Wrench },
            { step: '4. Execute', desc: 'CNC machining final aluminum parts and assembling the competition bot.', icon: ArrowRight },
          ].map((item, i) => (
            <div key={i} className="relative flex flex-col bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center mb-4">
                <item.icon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{item.step}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Highlighted Innovation */}
      <section className="col-span-1 md:col-span-2 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Innovation Highlight</h2>
          <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 font-mono">FEATURED</span>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-4">The "Flex-Core" Chassis</h3>
          <p className="text-slate-300 leading-relaxed mb-6">
            Traditional rigid chassis designs absorb all kinetic shock, leading to sheared bolts. We innovated a semi-flexible internal mounting system utilizing high-durometer TPU gaskets.
          </p>
          <ul className="space-y-3 border-l-2 border-indigo-500 pl-4">
            {[
              "Reduces peak impact force by 30%",
              "Allows for slight chassis deformation",
              "Decreases weight of internal bracing"
            ].map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-sm text-indigo-100 leading-relaxed font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      
      <section className="col-span-1 md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Real-World Application</h2>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-slate-600 leading-relaxed mb-6">
            The shock-absorption principles we developed for the arena have direct applications beyond competition.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
              <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Industrial Drone Protection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Isolate sensitive camera gimbals and LIDAR sensors from drone motor vibrations.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
              <h4 className="font-bold text-slate-900 mb-2 text-sm uppercase tracking-wider">Automotive Crash Safety</h4>
              <p className="text-xs text-slate-600 leading-relaxed">Applying localized flex-zones in rigid battery enclosures for electric vehicles.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
