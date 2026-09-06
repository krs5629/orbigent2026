import { motion } from 'motion/react';
import { Mail, Linkedin, Github, Sparkles, Users, Award, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { teamMembers as fallbackTeam } from '../data';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<any[]>(fallbackTeam);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, 'team'));
        if (!snap.empty) {
          setTeamMembers(snap.docs.map(doc => doc.data() as any));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchTeam();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-12"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 backdrop-blur-md">
          <Sparkles size={14} className="text-purple-400" />
          <span>ROSTER & FACULTY LEADERSHIP</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Engineering Team &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Mentors
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          Building a high-performance combat robot takes relentless discipline. Meet the student innovators and faculty advisors behind Team Orbigent 160.
        </p>
      </header>

      {/* Student Roster Section */}
      <section className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/[0.08] shadow-xl">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="text-purple-400" size={22} />
            <span>Student Engineering Roster</span>
          </h2>
          <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            NRL 2026 DIVISION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.name} 
              className="flex flex-col sm:flex-row gap-5 p-6 bg-zinc-900/40 rounded-2xl border border-white/[0.08] hover:border-purple-500/40 hover:bg-purple-950/10 transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:scale-105 transition-transform">
                {member.initials}
              </div>

              <div className="flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">{member.name}</h3>
                  <div className="inline-block text-[11px] font-mono uppercase tracking-wider text-purple-400 font-semibold mb-2">
                    {member.role}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{member.desc}</p>
                </div>
                
                <div className="flex gap-4 text-zinc-400 mt-4 pt-3 border-t border-white/[0.05]">
                  <a href="#" className="hover:text-purple-400 transition-colors"><Linkedin size={16} /></a>
                  <a href="#" className="hover:text-purple-400 transition-colors"><Github size={16} /></a>
                  <a href="#" className="hover:text-purple-400 transition-colors"><Mail size={16} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mentor & Advisor Showcase Banner */}
      <section className="bg-gradient-to-br from-[#120924] via-[#090712] to-[#050508] rounded-3xl p-8 sm:p-12 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.15)] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-24 h-24 rounded-2xl bg-purple-950/80 border-2 border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_25px_rgba(168,85,247,0.3)]">
          <Award size={40} className="text-purple-400" />
        </div>

        <div className="relative z-10 flex-1 text-center md:text-left space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold uppercase tracking-wider text-purple-300">
            <Heart size={12} className="text-purple-400" />
            <span>Mentors & Acknowledgments</span>
          </div>
          <h3 className="font-extrabold text-2xl sm:text-3xl text-white">Ms. Padma Srinidhi</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400">AI Teacher & Lead Technical Mentor</p>
          <div className="pt-2">
            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed italic font-light">
              "Ms. Padma Srinidhi has been absolutely instrumental in our journey. Her guidance as our AI teacher helped us shape our autonomous programming strategies and taught us how to integrate intelligent systems into our design. Her unwavering support and dedication made this robot possible."
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
