import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { LogIn, LogOut, Upload, Trash2, CheckCircle, Database } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
        <button onClick={login} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
          <LogIn size={20} /> Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Logged in as {user.email}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={logout} className="flex items-center gap-2 bg-slate-100 text-slate-600 hover:bg-slate-200 px-4 py-2 rounded-xl font-bold text-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <UploadSection title="Team Members" collectionName="team" schema={["name", "role", "desc", "initials", "color"]} />
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
    // Sort by createdAt usually, but simple list for now
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
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col gap-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      
      <form onSubmit={handleAdd} className="flex flex-col gap-3">
        {schema.map(field => (
          <input 
            key={field}
            type="text"
            placeholder={field}
            required
            value={formData[field] || ""}
            onChange={e => setFormData({ ...formData, [field]: e.target.value })}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm"
          />
        ))}
        {fileLabel && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{fileLabel}</label>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="text-sm" />
          </div>
        )}
        <button disabled={uploading} type="submit" className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-indigo-700 transition-colors">
          {uploading ? "Saving..." : "Add Entry"}
        </button>
      </form>

      <div className="flex flex-col gap-2 mt-4 max-h-64 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm text-slate-900 truncate">{item.title || item.name || item.version}</span>
              {item.fileUrl && <a href={item.fileUrl} target="_blank" className="text-[10px] text-indigo-500 truncate">{item.fileUrl}</a>}
            </div>
            <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
