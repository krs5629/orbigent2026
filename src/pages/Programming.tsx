import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Terminal, Play, X, FileCode } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Programming() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [uploadingS, setUploadingS] = useState(false);
  const [uploadingV, setUploadingV] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const sSnap = await getDocs(query(collection(db, 'programming_logic'), orderBy('createdAt', 'desc')));
    setSnippets(sSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    const vSnap = await getDocs(query(collection(db, 'programming_media'), orderBy('createdAt', 'desc')));
    setVideos(vSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleUpload = async (file: File, isVideo: boolean) => {
    if (!user) return;
    const col = isVideo ? 'programming_media' : 'programming_logic';
    isVideo ? setUploadingV(true) : setUploadingS(true);
    try {
      const storageRef = ref(storage, `${col}/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, col), { name: file.name, url, createdAt: new Date() });
      fetchData();
    } catch(e) { console.error(e); }
    isVideo ? setUploadingV(false) : setUploadingS(false);
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Programming & Logic</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Upload control logic snippets and autonomous test videos.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-2">
          <Terminal className="text-indigo-500" size={16}/> Logic Snippets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user && <Uploader label={uploadingS ? "Uploading..." : "Upload Snippet"} onUpload={(f) => handleUpload(f, false)} accept=".cpp,.h,.py,.ino,image/*" />}
          {snippets.map(s => (
            <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group flex flex-col">
              {user && (
                <button onClick={() => deleteItem('programming_logic', s.id, s.url)} className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600">
                  <X size={14}/>
                </button>
              )}
              <div className="w-full h-32 bg-[#1e1e1e] flex flex-col items-center justify-center text-emerald-500 relative">
                <FileCode size={32} className="mb-2 opacity-50" />
                <span className="text-[10px] font-mono tracking-wider">{s.name?.split('.').pop()}</span>
              </div>
              <div className="p-4 border-t border-slate-100 flex-1 flex flex-col items-start justify-center">
                <h3 className="font-bold text-slate-900 text-xs truncate w-full" title={s.name}>{s.name}</h3>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-500 hover:underline mt-1">Download</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="col-span-1 md:col-span-4 space-y-4 mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-2">
          <Play className="text-rose-500" size={16}/> Test Videos & GIFs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user && <Uploader label={uploadingV ? "Uploading..." : "Upload Video/GIF"} onUpload={(f) => handleUpload(f, true)} accept="video/*,image/gif" />}
          {videos.map(v => (
            <div key={v.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group flex flex-col">
              {user && (
                <button onClick={() => deleteItem('programming_media', v.id, v.url)} className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600">
                  <X size={14}/>
                </button>
              )}
              <video src={v.url} className="w-full h-32 object-cover bg-slate-900" controls muted playsInline />
              <div className="p-4 border-t border-slate-100 flex-1 flex items-center">
                <h3 className="font-bold text-slate-900 text-xs truncate" title={v.name}>{v.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
