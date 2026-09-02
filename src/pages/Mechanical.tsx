import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, FileBox, X, Plus } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Mechanical() {
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Mechanical Design</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Upload CAD renders, prototypes, and log design iterations.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2 px-2">
          <Layers className="text-indigo-500" /> CAD & Prototypes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {user && <Uploader label={uploading ? "Uploading..." : "Upload CAD or Photo"} onUpload={handleCadUpload} accept="image/*,.pdf,.step,.stl" />}
          {cads.map(cad => (
            <div key={cad.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group flex flex-col">
              {user && (
                <button onClick={() => deleteCad(cad.id, cad.url)} className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600">
                  <X size={14}/>
                </button>
              )}
              {cad.name?.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={cad.url} className="w-full h-48 object-cover bg-slate-100" alt={cad.name} />
              ) : (
                <div className="w-full h-48 bg-slate-50 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <FileBox size={32} className="mb-2 opacity-50 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-2">Document</span>
                  <a href={cad.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">Download</a>
                </div>
              )}
              <div className="p-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm truncate" title={cad.name}>{cad.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Design Evolution</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="p-4">Version</th>
                <th className="p-4">Major Changes</th>
                <th className="p-4">Reason for Change</th>
                <th className="p-4">Result</th>
                {user && <th className="p-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {evolutions.length === 0 && (
                <tr>
                  <td colSpan={user ? 5 : 4} className="p-8 text-center text-slate-400 text-sm">No evolutions logged yet.</td>
                </tr>
              )}
              {evolutions.map(evo => (
                <tr key={evo.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-indigo-600">{evo.version}</td>
                  <td className="p-4 text-slate-600">{evo.changes || evo.majorChanges}</td>
                  <td className="p-4 text-slate-600">{evo.reason}</td>
                  <td className="p-4 text-slate-600">{evo.result}</td>
                  {user && (
                    <td className="p-4 text-right">
                      <button onClick={() => deleteEvolution(evo.id)} className="text-rose-500 hover:text-rose-700"><X size={16} /></button>
                    </td>
                  )}
                </tr>
              ))}
              {user && (
                <tr className="bg-slate-50/50">
                  <td className="p-4"><input type="text" placeholder="e.g. Mk. 1" className="w-full p-2 rounded-lg border border-slate-200 text-xs" value={evoForm.version} onChange={e => setEvoForm({...evoForm, version: e.target.value})} /></td>
                  <td className="p-4"><input type="text" placeholder="Changes..." className="w-full p-2 rounded-lg border border-slate-200 text-xs" value={evoForm.changes} onChange={e => setEvoForm({...evoForm, changes: e.target.value})} /></td>
                  <td className="p-4"><input type="text" placeholder="Reason..." className="w-full p-2 rounded-lg border border-slate-200 text-xs" value={evoForm.reason} onChange={e => setEvoForm({...evoForm, reason: e.target.value})} /></td>
                  <td className="p-4"><input type="text" placeholder="Result..." className="w-full p-2 rounded-lg border border-slate-200 text-xs" value={evoForm.result} onChange={e => setEvoForm({...evoForm, result: e.target.value})} /></td>
                  <td className="p-4 text-right">
                    <button onClick={addEvolution} className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors flex justify-center w-full"><Plus size={16} /></button>
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
