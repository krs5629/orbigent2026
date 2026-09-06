import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { LogIn, LogOut, Trash2, Sparkles, Shield, UserCheck } from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };

  const logout = () => {
    signOut(auth);
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-purple-400 font-mono text-sm animate-pulse">
        Authenticating session state...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] py-12">
        <div className="bg-zinc-950/85 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Shield size={32} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
            Secure Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Authorized team leads and mentors may sign in to edit technical logs, upload CAD models, and manage season checkpoints.
          </p>
          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-full font-semibold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn size={18} /> 
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-16">
      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 text-purple-300 flex items-center justify-center">
            <UserCheck size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Admin Console</h1>
            <p className="text-purple-400 font-mono text-xs mt-0.5">Authenticated: {user.email}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <LogOut size={15} /> 
          <span>Sign Out</span>
        </button>
      </div>

      {/* Grid of upload & database sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadSection 
          title="Team Roster Roster" 
          collectionName="team" 
          schema={["name", "role", "desc", "initials", "color"]} 
        />
      </div>
    </div>
  );
};

const UploadSection = ({ title, collectionName, schema, fileLabel }: { title: string, collectionName: string, schema: string[], fileLabel?: string }) => {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const fetchItems = async () => {
    const snap = await getDocs(collection(db, collectionName));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    let fileUrl = "";

    try {
      if (file && fileLabel) {
        const storageRef = ref(storage, `${collectionName}/${Date.now()}_${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        fileUrl = await getDownloadURL(uploadTask.ref);
      }

      await addDoc(collection(db, collectionName), {
        ...formData,
        ...(fileUrl ? { fileUrl } : {}),
        createdAt: new Date()
      });

      setFormData({});
      setFile(null);
      fetchItems();
    } catch (error) {
      console.error(error);
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
    fetchItems();
  };

  return (
    <div className="bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col gap-6">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
        <span className="text-xs font-mono text-purple-400">{items.length} Entries</span>
      </div>
      
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        {schema.map(field => (
          <input 
            key={field}
            type="text"
            placeholder={field}
            required
            value={formData[field] || ""}
            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full px-4 py-2.5 bg-black/60 border border-white/20 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none"
          />
        ))}
        {fileLabel && (
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-xs font-bold text-purple-400 uppercase tracking-wider">{fileLabel}</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-xs text-zinc-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-zinc-800 file:text-zinc-200" />
          </div>
        )}
        <button 
          disabled={uploading} 
          type="submit" 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          {uploading ? "Saving Entry..." : "Add Database Entry"}
        </button>
      </form>

      <div className="flex flex-col gap-2 mt-2 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl border border-white/[0.08]">
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-xs text-white truncate">{item.title || item.name || item.version}</span>
              {item.fileUrl && <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[10px] text-purple-400 truncate hover:underline">{item.fileUrl}</a>}
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
