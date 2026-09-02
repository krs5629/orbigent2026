import { motion } from 'motion/react';
import { Mail, Linkedin, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { teamMembers as fallbackTeam } from '../data';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, 'team'));
        if (!snap.empty) {
          setTeamMembers(snap.docs.map(doc => doc.data() as any));
        } else {
          setTeamMembers([]);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTeam();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16"
    >
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Team & Mentors</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Building a combat robot takes a village. Meet the student engineers and industry mentors behind Team Apex.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Student Roster</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 ${member.color} shadow-sm group-hover:scale-105 transition-transform`}>
                {member.initials}
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 leading-tight">{member.name}</h3>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 mb-2 mt-1">{member.role}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{member.desc}</p>
                </div>
                <div className="flex gap-3 text-slate-400">
                  <a href="#" className="hover:text-indigo-600 transition-colors"><Linkedin size={16} /></a>
                  <a href="#" className="hover:text-indigo-600 transition-colors"><Github size={16} /></a>
                  <a href="#" className="hover:text-indigo-600 transition-colors"><Mail size={16} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="col-span-1 md:col-span-4 bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="absolute top-0 left-0 p-12 opacity-5 pointer-events-none">
          <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        </div>
        <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-slate-600 shrink-0 border-4 border-slate-700 shadow-xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider">Photo</span>
        </div>
        <div className="relative z-10 flex-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Mentors & Acknowledgments</h2>
          <h3 className="font-bold text-2xl mb-1">Ms. Padma Srinidhi</h3>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-6">AI Teacher & Lead Mentor</p>
          <div className="relative">
            <span className="absolute -top-4 -left-6 text-4xl text-slate-700 font-serif">"</span>
            <p className="text-slate-300 leading-relaxed italic relative z-10">
              Ms. Padma Srinidhi has been absolutely instrumental in our journey. Her guidance as our AI teacher helped us shape our autonomous programming strategies and taught us how to integrate intelligent systems into our design. Her unwavering support and dedication made this robot possible.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
