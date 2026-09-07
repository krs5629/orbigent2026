import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { Terminal, Play, X, FileCode, Sparkles, Download, ArrowRight, Code } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth, isAuthorizedAdmin } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Programming() {
  const location = useLocation();
  const isRobot = location.pathname.startsWith('/robot');
  const [snippets, setSnippets] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [uploadingS, setUploadingS] = useState(false);
  const [uploadingV, setUploadingV] = useState(false);

  const isAdmin = isAuthorizedAdmin(user?.email);

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
    if (!isAdmin) return;
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
    <motion.div 
      initial={{ opacity: 0, y: 15 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-12 sm:space-y-16 pb-12"
    >
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-950/40 text-xs sm:text-sm font-medium tracking-wide text-purple-300 backdrop-blur-md">
          <Sparkles size={14} className="text-purple-400" />
          <span>{isRobot ? 'COMPETITION ROBOT • FIRMWARE & AUTONOMY' : 'INNOVATION SYSTEM • FIRMWARE & LOGIC'}</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          {isRobot ? 'Competition Robot ' : ''}Programming, Logic &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Control Algorithms
          </span>
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 max-w-4xl leading-relaxed font-light">
          {isRobot
            ? 'Control software manages weapon spin and driving smoothly, while safety checks prevent system failures during matches.'
            : 'Simple software separates tremors from real gestures, allowing natural movement to come through clearly.'}
        </p>
      </header>

      {/* Logic Snippets Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Terminal size={20} />
            </div>
            <span>Logic Snippets</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">{snippets.length} Files</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isAdmin && (
            <div className="bg-zinc-950/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center">
              <Uploader label={uploadingS ? "Uploading..." : "Upload Code Snippet"} onUpload={(f) => handleUpload(f, false)} accept=".cpp,.h,.py,.ino,image/*" />
            </div>
          )}

          {snippets.map(s => (
            <div 
              key={s.id} 
              className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative group flex flex-col"
            >
              {isAdmin && (
                <button 
                  onClick={() => deleteItem('programming_logic', s.id, s.url)} 
                  className="absolute top-3 right-3 bg-rose-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600"
                >
                  <X size={14}/>
                </button>
              )}

              <div className="w-full h-40 bg-[#090710] flex flex-col items-center justify-center text-purple-400 relative border-b border-white/[0.06]">
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center mb-2">
                  <FileCode size={24} className="text-purple-300" />
                </div>
                <span className="text-[11px] font-mono text-purple-300 uppercase tracking-wider">
                  {s.name?.split('.').pop() || 'CODE'} SOURCE
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between bg-zinc-950/60">
                <h3 className="font-semibold text-white text-xs truncate w-full" title={s.name}>{s.name}</h3>
                <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <a 
                    href={s.url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 font-medium"
                  >
                    <Download size={13} />
                    <span>Download File</span>
                  </a>
                  <span className="text-[10px] text-zinc-500 font-mono">v1.0</span>
                </div>
              </div>
            </div>
          ))}

          {snippets.length === 0 && !isAdmin && (
            <div className="col-span-full p-12 text-center bg-zinc-950/60 border border-white/[0.08] rounded-3xl">
              <Code size={36} className="mx-auto text-purple-400/50 mb-3" />
              <p className="text-zinc-400 text-sm">Code snippets, header files, and control loops will be shown here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Autonomous Test Videos Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Play size={20} />
            </div>
            <span>Test Bench Videos & Autonomous Telemetry</span>
          </h2>
          <span className="text-xs text-zinc-400 font-mono">{videos.length} Videos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isAdmin && (
            <div className="bg-zinc-950/80 rounded-3xl p-6 border border-purple-500/30 flex flex-col justify-center items-center">
              <Uploader label={uploadingV ? "Uploading..." : "Upload Test Video/GIF"} onUpload={(f) => handleUpload(f, true)} accept="video/*,image/gif" />
            </div>
          )}

          {videos.map(v => (
            <div 
              key={v.id} 
              className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 relative group flex flex-col"
            >
              {isAdmin && (
                <button 
                  onClick={() => deleteItem('programming_media', v.id, v.url)} 
                  className="absolute top-3 right-3 bg-rose-500/80 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600"
                >
                  <X size={14}/>
                </button>
              )}
              <div className="w-full h-52 bg-black relative">
                <video src={v.url} className="w-full h-full object-cover" controls muted playsInline />
              </div>
              <div className="p-4 border-t border-white/[0.08] bg-zinc-950/60 flex items-center justify-between">
                <h3 className="font-semibold text-white text-xs truncate" title={v.name}>{v.name}</h3>
                <span className="text-[10px] text-purple-400 font-mono">TEST RUN</span>
              </div>
            </div>
          ))}

          {videos.length === 0 && !isAdmin && (
            <div className="col-span-full p-12 text-center bg-zinc-950/60 border border-white/[0.08] rounded-3xl">
              <Play size={36} className="mx-auto text-purple-400/50 mb-3" />
              <p className="text-zinc-400 text-sm">Autonomous test videos and benchmark telemetry will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
