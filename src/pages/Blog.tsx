import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, X, Image as ImageIcon, Sparkles, Send, Tag } from 'lucide-react';
import { db, auth, storage } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', author: 'Admin' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    fetchPosts();
    return unsubscribe;
  }, []);

  const fetchPosts = async () => {
    const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const addPost = async () => {
    if (!form.title) return;
    setUploading(true);
    let imageUrl = null;

    try {
      if (imageFile) {
        const storageRef = ref(storage, `blog_images/${Date.now()}_${imageFile.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, 'blog'), {
        ...form,
        imageUrl,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        createdAt: new Date(),
        tags: ['Update', 'Engineering']
      });

      setForm({ title: '', excerpt: '', author: 'Admin' });
      setImageFile(null);
      fetchPosts();
    } catch (e) {
      console.error(e);
    }
    setUploading(false);
  };

  const deletePost = async (id: string, imageUrl?: string) => {
    if (imageUrl) {
      try {
        await deleteObject(ref(storage, imageUrl));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, 'blog', id));
    fetchPosts();
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
          <span>ENGINEERING DISPATCHES</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Season Journey &{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Technical Logs
          </span>
        </h1>
       
      </header>

      {/* Admin Post Creator */}
      {user && (
        <section className="bg-zinc-950/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.15)] flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400 flex items-center gap-2">
              <Sparkles size={14} /> New Engineering Dispatch
            </h2>
            <span className="text-xs font-mono text-zinc-400">Authenticated as {user.email || 'Lead'}</span>
          </div>

          <input 
            type="text" 
            placeholder="Post Title (e.g. Day 42: CNC Machined Billet Weapon Shaft Completed)..." 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            className="p-3.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm focus:border-purple-500 focus:outline-none placeholder:text-zinc-600" 
          />
          <textarea 
            placeholder="Document what the team built, tested, or debugged today..." 
            value={form.excerpt} 
            onChange={e => setForm({...form, excerpt: e.target.value})} 
            className="p-3.5 rounded-xl bg-black/60 border border-white/20 text-white text-sm h-28 focus:border-purple-500 focus:outline-none placeholder:text-zinc-600" 
          />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-white/15 rounded-xl cursor-pointer hover:border-purple-400/50 transition-colors text-xs font-semibold text-zinc-300">
                <ImageIcon size={16} className="text-purple-400" />
                <span>{imageFile ? imageFile.name : 'Attach Image (Optional)'}</span>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
              {imageFile && (
                <button onClick={() => setImageFile(null)} className="text-rose-400 text-xs hover:underline font-medium">Remove</button>
              )}
            </div>

            <button 
              onClick={addPost} 
              disabled={uploading} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              <Send size={14} />
              <span>{uploading ? 'Publishing...' : 'Publish Dispatch'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Posts List */}
      <div className="space-y-6">
        {posts.length === 0 && (
          <div className="text-zinc-400 p-12 text-center bg-zinc-950/60 rounded-3xl border border-white/[0.08]">
            <p className="text-sm">No blog dispatches recorded yet. {user ? "Publish your first log above!" : "Log in via Admin to start publishing updates."}</p>
          </div>
        )}

        {posts.map(post => (
          <article 
            key={post.id} 
            className="bg-zinc-950/80 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_35px_rgba(168,85,247,0.12)] transition-all duration-300 relative group overflow-hidden"
          >
            {user && (
              <button 
                onClick={() => deletePost(post.id, post.imageUrl)} 
                className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1"
              >
                <X size={18} />
              </button>
            )}

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-purple-400">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
                    <CalendarDays size={13} /> {post.date}
                  </span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-300 font-mono">By {post.author}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                  {post.title}
                </h2>

                <p className="text-zinc-300 leading-relaxed text-base whitespace-pre-wrap font-light">
                  {post.excerpt}
                </p>

                <div className="flex flex-wrap gap-2 pt-3">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-900 border border-white/10 text-purple-300 rounded-full text-xs font-medium">
                      <Tag size={11} className="text-purple-400" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {post.imageUrl && (
                <div className="w-full lg:w-72 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
