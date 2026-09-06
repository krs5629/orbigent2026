import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, Circle, FileText, X, Sparkles, Plus, Clock } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Challenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [cForm, setCForm] = useState({ date: '', title: '', desc: '', status: 'current' });
  const [user, setUser] = useState<User | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(query(collection(db, 'challenges'), orderBy('createdAt', 'asc')));
    setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const addChallenge = async () => {
    if (cForm.title && user) {
      await addDoc(collection(db, 'challenges'), { ...cForm, createdAt: new Date() });
      setCForm({ date: '', title: '', desc: '', status: 'current' });
      fetchData();
    }
  };

  const deleteChallenge = async (id: string, fileUrl?: string) => {
    if (fileUrl) {
      try {
        await deleteObject(ref(storage, fileUrl));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, 'challenges', id));
    fetchData();
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (!user) return;
    setUploadingId(id);
    try {
      const storageRef = ref(storage, `challenges/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await updateDoc(doc(db, 'challenges', id), { fileUrl: url, fileName: file.name, status: 'completed' });
      fetchData();
    } catch(e) { console.error(e); }
    setUploadingId(null);
  };

  const removeFile = async (id: string, fileUrl: string) => {
    if (!user) return;
    try {
      await deleteObject(ref(storage, fileUrl));
    } catch (e) {
      console.error("Failed to delete from storage", e);
    }
    await updateDoc(doc(db, 'challenges', id), { fileUrl: null, fileName: null, status: 'current' });
    fetchData();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-16"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 backdrop-blur-md">
          <Sparkles size={14} className="text-purple-400" />
          <span>ROAD TO ARENA • SEASON 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          NRL Checkpoints &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Submissions
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          Tracking the 12 competitive milestones, engineering design binder uploads, safety inspections, and autonomous testing documentation.
        </p>
      </header>

      <section className="bg-[#0e0b18]/80 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-6 sm:p-12 shadow-2xl overflow-hidden relative">
        {/* Glowing Timeline Line */}
        <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500/60 before:via-purple-500/30 before:to-transparent mb-12">
          {challenges.length === 0 && (
            <p className="text-center text-zinc-500 text-sm py-12">No challenges added yet.</p>
          )}

          {challenges.map(item => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              
              {/* Status Icon on the Spine */}
              <div 
                className={`flex items-center justify-center w-11 h-11 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg relative z-10 transition-transform group-hover:scale-110 ${
                  item.status === 'completed' 
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : item.status === 'current' 
                    ? 'bg-purple-900/90 border-purple-400 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.6)] ring-4 ring-purple-500/20 animate-pulse' 
                    : 'bg-[#120e20] border-white/10 text-zinc-500'
                }`}
              >
                {item.status === 'completed' ? (
                  <CheckCircle2 size={18} />
                ) : item.status === 'current' ? (
                  <Target size={18} />
                ) : (
                  <Clock size={16} />
                )}
              </div>

              {/* Challenge Card */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-white/[0.08] bg-[#120e22]/70 hover:bg-[#161229]/90 hover:border-purple-500/40 backdrop-blur-md shadow-xl transition-all duration-300 relative group/card">
                {user && (
                  <button 
                    onClick={() => deleteChallenge(item.id, item.fileUrl)} 
                    className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400 transition-colors p-1"
                  >
                    <X size={16}/>
                  </button>
                )}
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/30">
                    {item.date || 'Season 2026'}
                  </span>
                  <span 
                    className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-semibold border ${
                      item.status === 'completed'
                        ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                        : item.status === 'current'
                        ? 'bg-purple-950/80 border-purple-500/40 text-purple-200'
                        : 'bg-white/[0.03] border-white/10 text-zinc-400'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <h3 className="font-bold text-lg sm:text-xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-300 mb-5 leading-relaxed font-light break-words">{item.desc}</p>
                
                {item.fileUrl ? (
                  <div className="flex items-center justify-between bg-[#08060f]/90 border border-purple-500/20 p-3.5 rounded-xl hover:border-purple-500/40 transition-colors">
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2.5 overflow-hidden group/link"
                    >
                      <FileText size={18} className="text-purple-400 shrink-0 group-hover/link:text-purple-300" />
                      <span className="text-xs font-semibold text-zinc-200 truncate group-hover/link:text-white">
                        {item.fileName || 'Official Submission PDF'}
                      </span>
                    </a>
                    {user && (
                      <button 
                        onClick={() => removeFile(item.id, item.fileUrl)} 
                        className="text-zinc-500 hover:text-rose-400 p-1 shrink-0 ml-2"
                      >
                        <X size={15}/>
                      </button>
                    )}
                  </div>
                ) : user ? (
                  <div className="h-28">
                    <Uploader 
                      label={uploadingId === item.id ? "Uploading..." : "Attach Official Deliverable"} 
                      onUpload={(f) => handleFileUpload(item.id, f)} 
                    />
                  </div>
                ) : (
                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                    <span>Awaiting deliverable submission</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {user && (
          <div className="bg-[#120e24]/80 p-6 sm:p-8 rounded-3xl border border-purple-500/30 max-w-2xl mx-auto w-full mt-10 backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider text-purple-300 mb-4 flex items-center gap-2">
              <Plus size={16} /> Add New Season Checkpoint
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Checkpoint Title" 
                className="col-span-2 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500" 
                value={cForm.title} 
                onChange={e => setCForm({...cForm, title: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Date (e.g. Oct 15, 2025)" 
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500" 
                value={cForm.date} 
                onChange={e => setCForm({...cForm, date: e.target.value})} 
              />
              <select 
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500" 
                value={cForm.status} 
                onChange={e => setCForm({...cForm, status: e.target.value})}
              >
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="completed">Completed</option>
              </select>
              <textarea 
                placeholder="Detailed Checkpoint Description and Guidelines" 
                className="col-span-2 p-3.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-zinc-500 text-sm h-24 focus:outline-none focus:border-purple-500" 
                value={cForm.desc} 
                onChange={e => setCForm({...cForm, desc: e.target.value})} 
              />
            </div>
            <button 
              onClick={addChallenge} 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs uppercase tracking-wider py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer"
            >
              Save Milestone Checkpoint
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
