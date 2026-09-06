import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, X, File, Sparkles, FileText, ArrowDownToLine } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(query(collection(db, 'resources'), orderBy('createdAt', 'desc')));
    setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const size = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
      const storageRef = ref(storage, `resources/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, 'resources'), { name: file.name, size, url, createdAt: new Date() });
      fetchData();
    } catch(e) { console.error(e); }
    setUploading(false);
  };

  const deleteItem = async (id: string, url?: string) => {
    if (url) {
      try {
        await deleteObject(ref(storage, url));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, 'resources', id));
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
          <span>OFFICIAL DOCUMENTATION</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Engineering Resources &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Downloads
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          Official NRL rulebook compliance checklists, bill of materials (BOM), CAD exports, and team presentation slide decks.
        </p>
      </header>

      <div className="space-y-6">
        {user && (
          <div className="bg-zinc-950/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center">
            <Uploader label={uploading ? "Uploading..." : "Upload Resource Document"} onUpload={handleUpload} />
          </div>
        )}
        
        <div className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-white/[0.08] hover:border-purple-500/30 overflow-hidden shadow-xl flex flex-col transition-all">
          <div className="p-6 sm:p-8 border-b border-white/[0.08] bg-zinc-900/40 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">Available Technical Documents</h2>
            <span className="text-xs font-mono text-purple-300 bg-purple-950/60 border border-purple-500/30 px-3 py-1 rounded-full font-semibold">
              {resources.length} FILES
            </span>
          </div>

          <ul className="divide-y divide-white/[0.06] flex-1">
            {resources.length === 0 && (
              <li className="p-12 text-center text-zinc-400 text-sm">
                No resources published yet.
              </li>
            )}
            {resources.map((res) => (
              <li key={res.id} className="p-5 sm:px-8 flex items-center justify-between hover:bg-purple-950/10 transition-colors group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.15)] group-hover:scale-105 transition-transform">
                    <FileText size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white truncate text-sm sm:text-base group-hover:text-purple-300 transition-colors">
                      {res.name}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono mt-0.5">
                      {res.size} • PDF / Technical Asset
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <a 
                    href={res.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-900/60 text-xs font-medium transition-all" 
                    title="Download"
                  >
                    <ArrowDownToLine size={14} />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                  {user && (
                    <button 
                      onClick={() => deleteItem(res.id, res.url)} 
                      className="p-2 text-zinc-500 hover:text-rose-400 transition-colors" 
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
