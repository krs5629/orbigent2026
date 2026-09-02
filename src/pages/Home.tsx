import { motion } from 'motion/react';
import { Rocket, Target, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16"
    >
      <header className="col-span-1 md:col-span-4 bg-indigo-600 rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl relative overflow-hidden min-h-[300px]">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-2">Team Orbigent 160</h1>
          <p className="text-indigo-100 max-w-sm">
            Pioneering next-gen robotics for the 2026 NRL Showcase. Bridging the gap between theory and industrial application.
          </p>
        </div>
        <div className="relative z-10 flex flex-wrap gap-4 items-end mt-12">
          <div className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-md border border-white/20 font-medium">EST. 2024</div>
          <div className="px-4 py-2 bg-white/10 rounded-full text-sm backdrop-blur-md border border-white/20 font-medium">12 CHALLENGES</div>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-400/30 rounded-full blur-3xl"></div>
      </header>

      <section className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
          <Target size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed flex-1">
          To design and build a combat robot that exemplifies robust engineering principles while pushing the boundaries of autonomous control and innovative material science. We strive to learn, adapt, and share our knowledge with the STEM community.
        </p>
      </section>

      <section className="col-span-1 md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
          <Rocket size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Why NRL?</h2>
        <p className="text-slate-600 leading-relaxed flex-1">
          The National Robotics League gives us the ultimate testing ground. It bridges the gap between theoretical classroom physics and real-world applied engineering. It's not just about winning battles; it's about mastering the manufacturing process.
        </p>
      </section>

      <section className="col-span-1 md:col-span-4 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        </div>
        <div className="relative z-10 space-y-6 max-w-2xl flex-1">
          <div className="flex justify-between items-start mb-2">
             <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">About Westside Tech</h2>
          </div>
          <h3 className="text-3xl font-bold">Fostering Technical Innovation</h3>
          <p className="text-slate-300 leading-relaxed text-lg">
            With access to state-of-the-art CNC machining and 3D printing labs, our robotics club was founded to give students hands-on experience in full-cycle product development. 
          </p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row flex-wrap gap-4 shrink-0">
          <Link to="/innovation" className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
            Explore Our Process <ArrowRight size={18} />
          </Link>
          <Link to="/mechanical" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            View CAD Models
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
