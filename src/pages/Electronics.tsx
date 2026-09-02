import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Cpu, Activity, X, Plus } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Electronics() {
  const [diagrams, setDiagrams] = useState<any[]>([]);
  const [issues, setIssues] = useState<any[]>([]);
  const [issueForm, setIssueForm] = useState({ title: '', desc: '', fix: '' });
  const [user, setUser] = useState<User | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const dSnap = await getDocs(query(collection(db, 'electronics_diagrams'), orderBy('createdAt', 'desc')));
    setDiagrams(dSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    const iSnap = await getDocs(query(collection(db, 'electronics_issues'), orderBy('createdAt', 'desc')));
    setIssues(iSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDiagramUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `electronics_diagrams/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await addDoc(collection(db, 'electronics_diagrams'), { name: file.name, url, createdAt: new Date() });
      fetchData();
    } catch(e) { console.error(e); }
    setUploading(false);
  };

  const addIssue = async () => {
    if (issueForm.title && user) {
      await addDoc(collection(db, 'electronics_issues'), { ...issueForm, createdAt: new Date() });
      setIssueForm({ title: '', desc: '', fix: '' });
      fetchData();
    }
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
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Electronics & Wiring</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Upload wiring diagrams and track troubleshooting logs.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
          <Activity className="text-rose-500" size={16} /> Troubleshooting Notes
        </h2>
        <div className="space-y-6 flex-1 mb-8">
          {issues.length === 0 && <p className="text-sm text-slate-400">No issues logged yet.</p>}
          {issues.map(issue => (
            <div key={issue.id} className="relative pl-6 border-l-2 border-rose-200 group">
              <div className="absolute w-3 h-3 bg-rose-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
              {user && (
                <button onClick={() => deleteItem('electronics_issues', issue.id)} className="absolute top-0 right-0 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={16} />
                </button>
              )}
              <h3 className="font-bold text-slate-900 pr-6">{issue.title}</h3>
              <p className="text-sm text-slate-600 mt-1">{issue.desc}</p>
              {issue.fix && (
                <div className="mt-2 text-xs bg-emerald-50 text-emerald-800 p-3 rounded-lg font-medium">
                  FIX: {issue.fix}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {user && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full flex-1">
              <input type="text" placeholder="Issue Title..." className="w-full p-2 mb-2 rounded-lg border border-slate-200 text-xs" value={issueForm.title} onChange={e => setIssueForm({...issueForm, title: e.target.value})} />
              <input type="text" placeholder="Description..." className="w-full p-2 mb-2 rounded-lg border border-slate-200 text-xs" value={issueForm.desc} onChange={e => setIssueForm({...issueForm, desc: e.target.value})} />
              <input type="text" placeholder="Fix (optional)..." className="w-full p-2 rounded-lg border border-slate-200 text-xs" value={issueForm.fix} onChange={e => setIssueForm({...issueForm, fix: e.target.value})} />
            </div>
            <button onClick={addIssue} className="bg-indigo-500 text-white px-4 py-2 h-full rounded-xl hover:bg-indigo-600 transition-colors shrink-0 flex items-center justify-center font-bold text-xs uppercase tracking-wider self-stretch">
              <Plus size={16} className="mr-1"/> Add Log
            </button>
          </div>
        )}
      </section>

      <section className="col-span-1 md:col-span-4 space-y-4 mt-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-2">
          <Cpu className="text-indigo-500" size={16}/> Wiring Diagrams
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {user && <Uploader label={uploading ? "Uploading..." : "Upload Diagram"} onUpload={handleDiagramUpload} accept="image/*,.pdf" />}
          {diagrams.map(diag => (
            <div key={diag.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative group flex flex-col">
              {user && (
                <button onClick={() => deleteItem('electronics_diagrams', diag.id, diag.url)} className="absolute top-3 right-3 bg-rose-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-rose-600">
                  <X size={14}/>
                </button>
              )}
              {diag.name?.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={diag.url} className="w-full h-32 object-cover bg-slate-100" alt={diag.name} />
              ) : (
                <div className="w-full h-32 bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-2">Document</span>
                  <a href={diag.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">Download</a>
                </div>
              )}
              <div className="p-4 border-t border-slate-100 flex-1 flex items-center">
                <h3 className="font-bold text-slate-900 text-xs truncate" title={diag.name}>{diag.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
