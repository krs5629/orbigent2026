import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CalendarDays, X, Image as ImageIcon } from 'lucide-react';
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
        tags: ['Update']
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Season Journey Blog</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Log your daily progress, machining notes, and updates here.
        </p>
      </header>

      {user && (
        <section className="col-span-1 md:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col gap-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Post New Entry</h2>
          <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="p-3 rounded-xl border border-slate-200 text-sm" />
          <textarea placeholder="What did you do today?" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="p-3 rounded-xl border border-slate-200 text-sm h-24" />
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors text-sm font-bold text-slate-600">
              <ImageIcon size={18} className="text-indigo-500" />
              {imageFile ? imageFile.name : 'Attach Image (Optional)'}
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            {imageFile && (
              <button onClick={() => setImageFile(null)} className="text-rose-500 text-sm hover:underline font-bold">Remove</button>
            )}
          </div>

          <button onClick={addPost} disabled={uploading} className="bg-indigo-600 text-white font-bold uppercase tracking-wider text-xs py-3 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 mt-2">
            {uploading ? 'Posting...' : 'Post Entry'}
          </button>
        </section>
      )}

      <div className="col-span-1 md:col-span-4 space-y-4 mt-4">
        {posts.length === 0 && (
          <p className="text-slate-500 p-8 text-center bg-slate-50 rounded-3xl border border-slate-200">
            No blog posts yet. {user ? "Log your first entry above!" : "Log in via Admin to start posting."}
          </p>
        )}
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative group overflow-hidden">
            {user && (
              <button onClick={() => deletePost(post.id, post.imageUrl)} className="absolute top-6 right-6 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <X size={20} />
              </button>
            )}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                  <span className="flex items-center gap-1.5 text-indigo-500"><CalendarDays size={14} /> {post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{post.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{post.excerpt}</p>
                <div className="flex gap-2">
                  {post.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold tracking-wide uppercase">{tag}</span>
                  ))}
                </div>
              </div>
              {post.imageUrl && (
                <div className="w-full md:w-1/3 shrink-0">
                  <img src={post.imageUrl} alt={post.title} className="w-full h-48 md:h-full object-cover rounded-2xl bg-slate-100 border border-slate-200" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
