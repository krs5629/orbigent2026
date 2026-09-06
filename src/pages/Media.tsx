import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, ExternalLink, Play, Image as ImageIcon } from 'lucide-react';
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
      await addDoc(collection(db, 'media_highlights'), { 
        name: file.name, 
        url, 
        type: file.type, 
        createdAt: new Date() 
      });
      fetchData();
    } catch(e) { 
      console.error(e); 
    }
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
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-16"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 backdrop-blur-md">
          <Sparkles size={14} className="text-purple-400" />
          <span>GALLERY & ARCHIVE • SEASON 2026</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Media Highlights &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Outreach
          </span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed font-light">
          High-resolution tournament footage, CNC workshop fabrication reels, CAD wireframes, and community STEM demonstrations.
        </p>
      </header>

      <section className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {user && (
            <div className="bg-[#0e0b18]/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center backdrop-blur-xl">
              <Uploader 
                label={uploading ? "Processing Upload..." : "Add Photo or Video"} 
                onUpload={handleUpload} 
                accept="image/*,video/*" 
              />
            </div>
          )}

          {media.map(m => {
            const isVideo = m.type?.startsWith('video');
            return (
              <div 
                key={m.id} 
                className="bg-[#0e0b18]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-300 relative group flex flex-col"
              >
                {user && (
                  <button 
                    onClick={() => deleteItem(m.id, m.url)} 
                    className="absolute top-3 right-3 bg-rose-600/90 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-rose-700 shadow-md"
                  >
                    <X size={14}/>
                  </button>
                )}

                <div className="w-full h-56 bg-black relative overflow-hidden flex items-center justify-center">
                  {isVideo ? (
                    <video 
                      src={m.url} 
                      className="w-full h-full object-cover" 
                      controls 
                      muted 
                      playsInline 
                    />
                  ) : (
                    <img 
                      src={m.url} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={m.name} 
                    />
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase text-purple-300 flex items-center gap-1.5">
                    {isVideo ? <Play size={10} /> : <ImageIcon size={10} />}
                    <span>{isVideo ? 'Video' : 'Photo'}</span>
                  </div>
                </div>

                <div className="p-5 border-t border-white/[0.08] bg-[#120e22]/50 flex items-center justify-between">
                  <h3 className="font-medium text-white text-xs truncate max-w-[170px]" title={m.name}>
                    {m.name}
                  </h3>
                  <a 
                    href={m.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-purple-400 hover:text-purple-300 inline-flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>View</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}

          {media.length === 0 && !user && (
            <div className="col-span-full p-12 text-center bg-[#0e0b18]/60 border border-white/[0.08] rounded-3xl text-zinc-400 font-light">
              No media items uploaded yet. Check back soon for competition photos and workshop build videos.
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
