import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Layers, FileBox, X, Plus, Sparkles, Download, ArrowRight } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Mechanical() {
  const location = useLocation();
  const isRobot = location.pathname.startsWith('/robot');
  const [cads, setCads] = useState<any[]>([]);
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [evoForm, setEvoForm] = useState({ version: '', changes: '', reason: '', result: '' });
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchCads();
    fetchEvolutions();
    return unsub;
  }, []);

  const fetchCads = async () => {
    const snap = await getDocs(query(collection(db, 'mechanical_cad'), orderBy('createdAt', 'desc')));
    setCads(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchEvolutions = async () => {
    const snap = await getDocs(query(collection(db, 'mechanical_evolution'), orderBy('createdAt', 'asc')));
    setEvolutions(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleCadUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `mechanical_cad/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, 'mechanical_cad'), { name: file.name, url, createdAt: new Date() });
      fetchCads();
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const deleteCad = async (id: string, url?: string) => {
    if (url) {
      try {
        await deleteObject(ref(storage, url));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, 'mechanical_cad', id));
    fetchCads();
  };

  const addEvolution = async () => {
    if (evoForm.version && user) {
      await addDoc(collection(db, 'mechanical_evolution'), { ...evoForm, createdAt: new Date() });
      setEvoForm({ version: '', changes: '', reason: '', result: '' });
      fetchEvolutions();
    }
  };

  const deleteEvolution = async (id: string) => {
    await deleteDoc(doc(db, 'mechanical_evolution', id));
    fetchEvolutions();
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
          <span>{isRobot ? 'COMPETITION ROBOT • MECHANICAL & CAD' : 'INNOVATION SYSTEM • MECHANICAL & CAD'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {isRobot ? 'Competition Robot ' : ''}Mechanical Design &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            CAD Iterations
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          {isRobot 
            ? 'Weapon geometry FEA, CNC titanium chassis milling, drive pods, and physical evolution logs for the 2026 NRL arena combat bot.'
            : 'Precision CAD renders, physical CNC prototypes, finite element analysis, and structural evolution logs for the 2026 innovation build.'}
        </p>
      </header>

      {/* CAD & Prototypes Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers size={20} />
            </div>
            <span>CAD Renders & Prototypes</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {cads.length} Models Logged
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {user && (
            <div className="bg-zinc-950/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center">
              <Uploader label={uploading ? "Uploading..." : "Upload CAD or Photo"} onUpload={handleCadUpload} accept="image/*,.pdf,.step,.stl" />
            </div>
          )}

          {cads.map(cad => (
            <div 
              key={cad.id} 
              className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative group flex flex-col"
            >
              {user && (
                <button 
                  onClick={() => deleteCad(cad.id, cad.url)} 
                  className="absolute top-3 right-3 bg-rose-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600"
                >
                  <X size={14}/>
                </button>
              )}

              {cad.name?.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <div className="w-full h-52 overflow-hidden bg-black relative">
                  <img src={cad.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={cad.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
              ) : (
                <div className="w-full h-52 bg-zinc-900/50 flex flex-col items-center justify-center text-purple-400 p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-3">
                    <FileBox size={28} className="text-purple-300" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 mb-2">CAD Document</span>
                  <a 
                    href={cad.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 hover:text-white hover:bg-purple-900/60 transition-colors"
                  >
                    <Download size={13} />
                    <span>Download File</span>
                  </a>
                </div>
              )}

              <div className="p-5 border-t border-white/[0.08] bg-zinc-950/50 flex items-center justify-between">
                <h3 className="font-semibold text-white text-sm truncate" title={cad.name}>{cad.name}</h3>
                <a href={cad.url} target="_blank" rel="noreferrer" className="text-purple-400 hover:text-purple-300 text-xs shrink-0 ml-2">
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>
          ))}

          {cads.length === 0 && !user && (
            <div className="col-span-full p-12 text-center bg-zinc-950/60 border border-white/[0.08] rounded-3xl">
              <FileBox size={36} className="mx-auto text-purple-400/50 mb-3" />
              <p className="text-zinc-400 text-sm">CAD files and assembly models will be displayed here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Design Evolution Table (Ridgevyn Card Style) */}
      <section className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-white/[0.08] shadow-xl overflow-hidden flex flex-col">
        <div className="p-6 sm:p-8 border-b border-white/[0.08] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Iteration Log</div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Design Evolution History</h2>
          </div>
          <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            NRL BINDER SECTION 4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[650px]">
            <thead>
              <tr className="bg-zinc-900/50 text-purple-300 text-xs font-bold uppercase tracking-wider border-b border-white/[0.08]">
                <th className="p-4 sm:p-5">Version</th>
                <th className="p-4 sm:p-5">Major Changes</th>
                <th className="p-4 sm:p-5">Reason for Change</th>
                <th className="p-4 sm:p-5">Result</th>
                {user && <th className="p-4 sm:p-5 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {evolutions.length === 0 && (
                <tr>
                  <td colSpan={user ? 5 : 4} className="p-8 text-center text-zinc-400 text-sm">
                    No evolutions logged yet.
                  </td>
                </tr>
              )}
              {evolutions.map(evo => (
                <tr key={evo.id} className="hover:bg-purple-950/10 transition-colors">
                  <td className="p-4 sm:p-5 font-mono font-bold text-purple-400 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-xs">
                      {evo.version}
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-zinc-200">{evo.changes || evo.majorChanges}</td>
                  <td className="p-4 sm:p-5 text-zinc-400">{evo.reason}</td>
                  <td className="p-4 sm:p-5 text-zinc-300">{evo.result}</td>
                  {user && (
                    <td className="p-4 sm:p-5 text-right">
                      <button onClick={() => deleteEvolution(evo.id)} className="text-rose-400 hover:text-rose-300 p-1">
                        <X size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}

              {user && (
                <tr className="bg-zinc-900/80">
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="e.g. Mk. 1" 
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                      value={evoForm.version} 
                      onChange={e => setEvoForm({...evoForm, version: e.target.value})} 
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="Changes..." 
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                      value={evoForm.changes} 
                      onChange={e => setEvoForm({...evoForm, changes: e.target.value})} 
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="Reason..." 
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                      value={evoForm.reason} 
                      onChange={e => setEvoForm({...evoForm, reason: e.target.value})} 
                    />
                  </td>
                  <td className="p-4">
                    <input 
                      type="text" 
                      placeholder="Result..." 
                      className="w-full p-2 rounded-lg bg-black/60 border border-white/20 text-white text-xs focus:border-purple-500 focus:outline-none" 
                      value={evoForm.result} 
                      onChange={e => setEvoForm({...evoForm, result: e.target.value})} 
                    />
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={addEvolution} 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-2 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-colors flex justify-center w-full"
                    >
                      <Plus size={16} />
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
}
