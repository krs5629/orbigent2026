import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Cpu, Activity, X, Plus, Sparkles, Download, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Electronics() {
  const location = useLocation();
  const isRobot = location.pathname.startsWith('/robot');
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [issueForm, setIssueForm] = useState({ title: '', desc: '', fix: '' });
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const dSnap = await getDocs(query(collection(db, 'electronics_diagrams'), orderBy('createdAt', 'desc')));
    setDiagrams(dSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    const iSnap = await getDocs(query(collection(db, 'electronics_issues'), orderBy('createdAt', 'desc')));
    setIssues(iSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDiagramUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `electronics_diagrams/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, 'electronics_diagrams'), { name: file.name, url, createdAt: new Date() });
      fetchData();
    } catch(e) { console.error(e); }
    setUploading(false);
  };

  const addIssue = async () => {
    if (issueForm.title && user) {
      await addDoc(collection(db, 'electronics_issues'), { ...issueForm, createdAt: new Date() });
      setIssueForm({ title: '', desc: '', fix: '' });
      fetchData();
    }
  };

  const deleteItem = async (col: string, id: string, url?: string) => {
    if (url) {
      try {
        await deleteObject(ref(storage, url));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, col, id));
    fetchData();
  };

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
          <span>{isRobot ? 'COMPETITION ROBOT • POWER & AVIONICS' : 'INNOVATION SYSTEM • POWER & AVIONICS'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {isRobot ? 'Competition Robot ' : ''}Electronics, Wiring &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Power Systems
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          {isRobot 
            ? '6S LiPo power distribution bus, brushless ESC telemetry, optical tachometers, and arena fail-safe switch architecture.'
            : 'Wiring schematics, power rail distribution, dual MPU-6050 IMU integration, and real-time hardware troubleshooting records.'}
        </p>
      </header>

      {/* Troubleshooting Section (Ridgevyn Card Style) */}
      <section className="bg-zinc-950/80 backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Hardware Debugging</div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="text-purple-400" size={22} />
              <span>Troubleshooting & Failure Analysis</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            {issues.length} LOGS
          </span>
        </div>

        <div className="space-y-6 flex-1 mb-8">
          {issues.length === 0 && (
            <p className="text-sm text-zinc-400 py-6 text-center">No troubleshooting logs recorded yet.</p>
          )}

          {issues.map(issue => (
            <div key={issue.id} className="relative pl-7 border-l-2 border-purple-500/40 group py-1">
              <div className="absolute w-3.5 h-3.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full -left-[8px] top-2 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              
              {user && (
                <button 
                  onClick={() => deleteItem('electronics_issues', issue.id)} 
                  className="absolute top-1 right-0 text-zinc-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X size={16} />
                </button>
              )}

              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle size={15} className="text-purple-400 shrink-0" />
                <h3 className="font-bold text-white text-base pr-6">{issue.title}</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed pl-5">{issue.desc}</p>
              
              {issue.fix && (
                <div className="mt-3 ml-5 text-xs bg-purple-950/40 text-purple-200 border border-purple-500/30 p-3.5 rounded-xl font-medium flex items-start gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-300 uppercase tracking-wider text-[10px] block mb-0.5">Implemented Solution:</span>
                    <span>{issue.fix}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {user && (
          <div className="bg-zinc-900/60 p-5 rounded-2xl border border-white/[0.08] flex flex-col gap-3">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-400">Add New Troubleshooting Entry</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input 
                type="text" 
                placeholder="Issue Title (e.g. Reverse Polarity)..." 
                className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                value={issueForm.title} 
                onChange={e => setIssueForm({...issueForm, title: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Description of failure..." 
                className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                value={issueForm.desc} 
                onChange={e => setIssueForm({...issueForm, desc: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Fix applied (e.g. XT90 keying)..." 
                className="w-full p-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                value={issueForm.fix} 
                onChange={e => setIssueForm({...issueForm, fix: e.target.value})} 
              />
            </div>
            <div className="flex justify-end mt-1">
              <button 
                onClick={addIssue} 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Plus size={16} /> 
                <span>Save Troubleshooting Log</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Wiring Diagrams Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Schematics & Pinouts</div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="text-purple-400" size={22} />
              <span>Wiring Diagrams & Harness Layouts</span>
            </h2>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {diagrams.length} Schematics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {user && (
            <div className="bg-zinc-950/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center">
              <Uploader label={uploading ? "Uploading..." : "Upload Schematic"} onUpload={handleDiagramUpload} accept="image/*,.pdf" />
            </div>
          )}

          {diagrams.map(diag => (
            <div 
              key={diag.id} 
              className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative group flex flex-col"
            >
              {user && (
                <button 
                  onClick={() => deleteItem('electronics_diagrams', diag.id, diag.url)} 
                  className="absolute top-3 right-3 bg-rose-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600"
                >
                  <X size={14}/>
                </button>
              )}

              {diag.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <div className="w-full h-48 overflow-hidden bg-black relative">
                  <img src={diag.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={diag.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
              ) : (
                <div className="w-full h-48 bg-zinc-900/50 flex flex-col items-center justify-center text-purple-400 p-6 text-center">
                  <Cpu size={32} className="mb-2 text-purple-300 opacity-80" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2">Wiring Document</span>
                  <a 
                    href={diag.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 hover:text-white"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>
                </div>
              )}

              <div className="p-4 border-t border-white/[0.08] bg-zinc-950/50 flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs truncate" title={diag.name}>{diag.name}</h3>
                <a href={diag.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 shrink-0 ml-2">
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}

          {diagrams.length === 0 && !user && (
            <div className="col-span-full p-12 text-center bg-zinc-950/60 border border-white/[0.08] rounded-3xl">
              <Cpu size={36} className="mx-auto text-purple-400/50 mb-3" />
              <p className="text-zinc-400 text-sm">Electrical schematics and wiring diagrams will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
