import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Media() {
  const [media, setMedia] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(query(collection(db, 'media_highlights'), orderBy('createdAt', 'desc')));
    setMedia(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `media_highlights/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, 'media_highlights'), { name: file.name, url, type: file.type, createdAt: new Date() });
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
    await deleteDoc(doc(db, 'media_highlights', id));
    fetchData();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Media & Outreach</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Upload photos, videos, and graphics for your portfolio.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user && <Uploader label={uploading ? "Uploading..." : "Upload Media"} onUpload={handleUpload} accept="image/*,video/*" />}
          {media.map(m => (
            <div key={m.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group flex flex-col">
              {user && (
                <button onClick={() => deleteItem(m.id, m.url)} className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600 shadow-sm">
                  <X size={14}/>
                </button>
              )}
              {m.type?.startsWith('video') ? (
                <video src={m.url} className="w-full h-40 object-cover bg-slate-900" controls muted playsInline />
              ) : (
                <img src={m.url} className="w-full h-40 object-cover bg-slate-100" alt={m.name} />
              )}
              <div className="p-4 border-t border-slate-100 flex-1 flex flex-col items-start justify-center">
                <h3 className="font-bold text-slate-900 text-xs truncate w-full" title={m.name}>{m.name}</h3>
                <a href={m.url} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-500 hover:underline mt-1">Open Original</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
