import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Target, CheckCircle2, Circle, FileText, X } from 'lucide-react';
import { Uploader } from '../components/Uploader';
import { db, storage, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, updateDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function Challenges() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [cForm, setCForm] = useState({ date: '', title: '', desc: '', status: 'current' });
  const [user, setUser] = useState<User | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    fetchData();
    return unsub;
  }, []);

  const fetchData = async () => {
    const snap = await getDocs(query(collection(db, 'challenges'), orderBy('createdAt', 'asc')));
    setChallenges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const addChallenge = async () => {
    if (cForm.title && user) {
      await addDoc(collection(db, 'challenges'), { ...cForm, createdAt: new Date() });
      setCForm({ date: '', title: '', desc: '', status: 'current' });
      fetchData();
    }
  };

  const deleteChallenge = async (id: string, fileUrl?: string) => {
    if (fileUrl) {
      try {
        await deleteObject(ref(storage, fileUrl));
      } catch (e) {
        console.error("Failed to delete from storage", e);
      }
    }
    await deleteDoc(doc(db, 'challenges', id));
    fetchData();
  };

  const handleFileUpload = async (id: string, file: File) => {
    if (!user) return;
    setUploadingId(id);
    try {
      const storageRef = ref(storage, `challenges/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const url = await getDownloadURL(uploadTask.ref);
      await updateDoc(doc(db, 'challenges', id), { fileUrl: url, fileName: file.name, status: 'completed' });
      fetchData();
    } catch(e) { console.error(e); }
    setUploadingId(null);
  };

  const removeFile = async (id: string, fileUrl: string) => {
    if (!user) return;
    try {
      await deleteObject(ref(storage, fileUrl));
    } catch (e) {
      console.error("Failed to delete from storage", e);
    }
    await updateDoc(doc(db, 'challenges', id), { fileUrl: null, fileName: null, status: 'current' });
    fetchData();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-16">
      <header className="col-span-1 md:col-span-4 space-y-4 mb-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Challenges & Submissions</h1>
        <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
          Define your checkpoints and upload your submissions.
        </p>
      </header>

      <section className="col-span-1 md:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm overflow-hidden flex flex-col">
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100 mb-12">
          {challenges.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No challenges added yet.</p>}
          {challenges.map(item => (
            <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10 ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'current' ? 'bg-indigo-500 ring-4 ring-indigo-50' : 'bg-slate-200'}`}>
                {item.status === 'completed' ? <CheckCircle2 size={16} className="text-white" /> : item.status === 'current' ? <Target size={16} className="text-white" /> : <Circle size={16} className="text-slate-400" />}
              </div>

              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:shadow-md relative">
                {user && (
                  <button onClick={() => deleteChallenge(item.id, item.fileUrl)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"><X size={16}/></button>
                )}
                <div className="flex items-center gap-2 mb-3 pr-6">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600">{item.date}</span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded font-bold bg-white border border-slate-200 text-slate-500">{item.status}</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
                
                {item.fileUrl ? (
                  <div className="flex items-center justify-between bg-white border border-slate-200 p-3 rounded-xl">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 overflow-hidden hover:underline">
                      <FileText size={16} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-600 truncate">{item.fileName || 'Submission File'}</span>
                    </a>
                    {user && <button onClick={() => removeFile(item.id, item.fileUrl)} className="text-rose-500 p-1 shrink-0"><X size={14}/></button>}
                  </div>
                ) : user ? (
                  <div className="h-24">
                    <Uploader label={uploadingId === item.id ? "Uploading..." : "Upload Submission"} onUpload={(f) => handleFileUpload(item.id, f)} />
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Awaiting submission</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {user && (
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-2xl mx-auto w-full mt-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Add New Checkpoint</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Title" className="col-span-2 p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400" value={cForm.title} onChange={e => setCForm({...cForm, title: e.target.value})} />
              <input type="text" placeholder="Date (e.g. Oct 15)" className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400" value={cForm.date} onChange={e => setCForm({...cForm, date: e.target.value})} />
              <select className="p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400" value={cForm.status} onChange={e => setCForm({...cForm, status: e.target.value})}>
                <option value="upcoming">Upcoming</option>
                <option value="current">Current</option>
                <option value="completed">Completed</option>
              </select>
              <textarea placeholder="Description" className="col-span-2 p-3 rounded-xl border border-slate-200 text-sm h-20 focus:outline-none focus:border-indigo-400" value={cForm.desc} onChange={e => setCForm({...cForm, desc: e.target.value})} />
            </div>
            <button onClick={addChallenge} className="w-full bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
              Add Checkpoint
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
}
