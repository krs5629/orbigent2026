import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Download, X, File } from 'lucide-react';
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Resources & Downloads</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Upload documents, PDFs, and configuration files for easy access.
        </p>
      </header>

      <div className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {user && (
          <div className="col-span-1 md:col-span-1">
            <Uploader label={uploading ? "Uploading..." : "Upload Resource"} onUpload={handleUpload} />
          </div>
        )}
        
        <div className={`col-span-1 ${user ? 'md:col-span-3' : 'md:col-span-4'} bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col`}>
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Files</h2>
            <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-wider">{resources.length} FILES</span>
          </div>
          <ul className="divide-y divide-slate-100 flex-1">
            {resources.length === 0 && <li className="p-8 text-center text-slate-400 text-sm">No resources uploaded yet.</li>}
            {resources.map((res) => (
              <li key={res.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
                    <File size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{res.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{res.size} • Document</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <a href={res.url} target="_blank" rel="noreferrer" className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Download">
                    <Download size={18} />
                  </a>
                  {user && (
                    <button onClick={() => deleteItem(res.id, res.url)} className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Remove">
                      <X size={18} />
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
