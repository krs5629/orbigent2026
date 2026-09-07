import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db, storage, isAuthorizedAdmin } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { collection, getDocs, addDoc, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { 
  LogIn, 
  LogOut, 
  Trash2, 
  Sparkles, 
  Shield, 
  ShieldAlert, 
  UserCheck, 
  Wrench, 
  Cpu, 
  Code, 
  Target, 
  Film, 
  FolderDown, 
  Users, 
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('team');

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
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="p-8 rounded-2xl bg-zinc-950/80 border border-white/10 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-purple-300 font-mono text-xs">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-white/[0.08] p-8 sm:p-12 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <Shield size={32} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-3">
            Lead Access Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Admin Console</h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed font-light">
            Authorized team leaders may authenticate to publish technical updates, manage season logs, and maintain system resources.
          </p>

          <button 
            onClick={login} 
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3.5 rounded-full font-semibold text-sm shadow-[0_0_25px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <LogIn size={18} /> 
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    );
  }

  // Signed in, but NOT in the authorized admin list
  if (!isAuthorizedAdmin(user.email)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-12">
        <div className="bg-zinc-950/90 backdrop-blur-xl border border-rose-500/30 p-8 sm:p-12 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
            <ShieldAlert size={32} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-xs font-semibold uppercase tracking-wider text-rose-300 mb-3">
            Access Restricted
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">Unauthorized Account</h1>
          
          <p className="text-zinc-300 text-sm mb-6 leading-relaxed font-light">
            This account does not have administrative privileges. Access to the Admin Console is restricted to authorized team leads.
          </p>

          <div className="bg-rose-950/30 border border-rose-500/20 rounded-xl p-3 mb-8 text-xs text-zinc-300 text-left">
            <span className="text-rose-400 font-semibold">Currently signed in as:</span>
            <div className="font-mono text-white mt-0.5 truncate">{user.email || 'Anonymous'}</div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={logout} 
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-full font-semibold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign Out & Switch Account</span>
            </button>
            <Link 
              to="/" 
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-white/10 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-all"
            >
              <ArrowLeft size={14} />
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Panel
  return (
    <div className="space-y-8 pb-16">
      {/* Top Profile Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-300 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <UserCheck size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Admin Console</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-950/80 border border-purple-500/40 text-purple-300">
                Verified Lead
              </span>
            </div>
            <p className="text-zinc-400 font-mono text-xs mt-0.5">Authenticated: <span className="text-purple-300">{user.email}</span></p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut size={15} /> 
          <span>Sign Out</span>
        </button>
      </div>

      {/* Admin Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.08]">
        {[
          { id: 'team', label: 'Team Roster', icon: Users },
          { id: 'cad', label: 'Mechanical CAD', icon: Wrench },
          { id: 'evolution', label: 'Design Evolution', icon: Sparkles },
          { id: 'electronics', label: 'Electronics Diagrams', icon: Cpu },
          { id: 'programming', label: 'Programming Media', icon: Code },
          { id: 'challenges', label: 'Season Checkpoints', icon: Target },
          { id: 'media', label: 'Media Highlights', icon: Film },
          { id: 'resources', label: 'Downloads & Binders', icon: FolderDown },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-950/80 border border-purple-500/40 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-purple-400' : 'text-zinc-500'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeTab === 'team' && (
          <UploadSection 
            title="Team Roster Management" 
            collectionName="team" 
            fields={[
              { name: 'name', label: 'Full Name', placeholder: 'e.g. Alex Rivera' },
              { name: 'role', label: 'Subsystem Role', placeholder: 'e.g. Lead Mechanical Engineer' },
              { name: 'desc', label: 'Specialization / Bio', placeholder: 'e.g. Weapon geometry FEA & SolidWorks assemblies' },
              { name: 'initials', label: 'Initials (2-3 chars)', placeholder: 'AR' },
              { name: 'color', label: 'Badge Gradient Color', placeholder: 'from-purple-500 to-indigo-600' },
            ]}
          />
        )}

        {activeTab === 'cad' && (
          <UploadSection 
            title="Mechanical CAD & Prototypes" 
            collectionName="mechanical_cad" 
            fields={[
              { name: 'title', label: 'Subsystem Title', placeholder: 'e.g. Chassis Revision 4.2' },
              { name: 'type', label: 'Component Type', placeholder: 'CNC Billet / 3D Print / FEA' },
              { name: 'desc', label: 'Technical Description', placeholder: 'Machined from 7075-T6 aluminum billet' },
            ]}
            fileLabel="Attach CAD Rendering / Photo"
          />
        )}

        {activeTab === 'evolution' && (
          <UploadSection 
            title="Design Evolution Log" 
            collectionName="mechanical_evolution" 
            fields={[
              { name: 'version', label: 'Revision Version', placeholder: 'v3.1' },
              { name: 'majorChanges', label: 'Major Engineering Changes', placeholder: 'Added shock-isolated ESC tray' },
              { name: 'reason', label: 'Root Cause / Motivation', placeholder: 'Excessive G-force spike during arena strike' },
              { name: 'result', label: 'Measured Outcome', placeholder: 'Zero power rail disconnects over 10 impact cycles' },
            ]}
            fileLabel="Attach Test Log / Photo"
          />
        )}

        {activeTab === 'electronics' && (
          <UploadSection 
            title="Electronics & Wiring Schematics" 
            collectionName="electronics_diagrams" 
            fields={[
              { name: 'title', label: 'Schematic Title', placeholder: 'e.g. Main 6S Power Distribution Bus' },
              { name: 'desc', label: 'Circuit Description', placeholder: 'Dual optocoupled ESC telemetry with safety cutoff switch' },
            ]}
            fileLabel="Attach Wiring Diagram / Schematic Image"
          />
        )}

        {activeTab === 'programming' && (
          <UploadSection 
            title="Programming Firmware & Media" 
            collectionName="programming_media" 
            fields={[
              { name: 'title', label: 'Snippet / Video Title', placeholder: 'e.g. Closed-Loop Tremor Suppression Test' },
            ]}
            fileLabel="Attach Firmware / Demonstration Clip"
          />
        )}

        {activeTab === 'challenges' && (
          <UploadSection 
            title="Season Checkpoints & Milestone Submissions" 
            collectionName="challenges" 
            fields={[
              { name: 'title', label: 'Milestone Title', placeholder: 'e.g. Challenge 08: Weapon Spin-Up Safety Inspection' },
              { name: 'date', label: 'Target Date', placeholder: 'March 2026' },
              { name: 'status', label: 'Status (completed / in-progress / upcoming)', placeholder: 'completed' },
              { name: 'desc', label: 'Submission Brief', placeholder: 'Binder upload and high-speed tachometer spin-up log' },
            ]}
            fileLabel="Attach Milestone Binder / Verification File"
          />
        )}

        {activeTab === 'media' && (
          <UploadSection 
            title="Media Highlights & Tournament Footage" 
            collectionName="media_highlights" 
            fields={[
              { name: 'title', label: 'Highlight Title', placeholder: 'e.g. Regional Match 3: Knockout Victory' },
              { name: 'videoUrl', label: 'Video Embed URL / YouTube Link', placeholder: 'https://youtube.com/...' },
            ]}
          />
        )}

        {activeTab === 'resources' && (
          <UploadSection 
            title="Downloadable Resources & Technical Binders" 
            collectionName="resources" 
            fields={[
              { name: 'name', label: 'Document Name', placeholder: 'e.g. 2026 NRL Engineering Binder (Complete)' },
              { name: 'size', label: 'File Size', placeholder: '14.2 MB' },
              { name: 'type', label: 'Document Format', placeholder: 'PDF / CAD Package' },
            ]}
            fileLabel="Attach Resource PDF / File"
          />
        )}
      </div>
    </div>
  );
};

interface FieldDef {
  name: string;
  label: string;
  placeholder: string;
}

const UploadSection = ({ 
  title, 
  collectionName, 
  fields, 
  fileLabel 
}: { 
  title: string; 
  collectionName: string; 
  fields: FieldDef[]; 
  fileLabel?: string; 
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchItems();
  }, [collectionName]);

  const fetchItems = async () => {
    try {
      const snap = await getDocs(query(collection(db, collectionName), orderBy('createdAt', 'desc')));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (e) {
      // Fallback if ordering by createdAt fails for existing collections without timestamp
      try {
        const snap = await getDocs(collection(db, collectionName));
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setStatusMsg(null);
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
      setStatusMsg({ type: 'success', text: 'Entry published successfully!' });
      fetchItems();
    } catch (error: any) {
      console.error(error);
      setStatusMsg({ type: 'error', text: error.message || 'Failed to save entry' });
    }
    setUploading(false);
  };

  const handleDelete = async (id: string, fileUrl?: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
      if (fileUrl) {
        try {
          await deleteObject(ref(storage, fileUrl));
        } catch (e) {
          console.warn("Storage deletion skipped:", e);
        }
      }
      await deleteDoc(doc(db, collectionName, id));
      fetchItems();
    } catch (error: any) {
      console.error(error);
      alert('Delete failed: ' + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Creation Form */}
      <div className="lg:col-span-6 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <span className="text-[11px] font-mono text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-500/20">
            Create Entry
          </span>
        </div>

        {statusMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-950/40 border border-rose-500/30 text-rose-300'
          }`}>
            <AlertCircle size={15} />
            <span>{statusMsg.text}</span>
          </div>
        )}
        
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          {fields.map(field => (
            <div key={field.name} className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {field.label}
              </label>
              <input 
                type="text"
                placeholder={field.placeholder}
                required
                value={formData[field.name] || ""}
                onChange={e => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-full px-4 py-2.5 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          ))}

          {fileLabel && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <span>{fileLabel}</span>
              </label>
              <input 
                type="file" 
                onChange={e => setFile(e.target.files?.[0] || null)} 
                className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-purple-950/80 file:text-purple-300 hover:file:bg-purple-900 transition-all cursor-pointer" 
              />
            </div>
          )}

          <button 
            disabled={uploading} 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold px-5 py-3 rounded-xl text-xs hover:from-purple-500 hover:to-indigo-500 transition-all disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving Entry & Assets...</span>
              </>
            ) : (
              <span>Publish Entry to Database</span>
            )}
          </button>
        </form>
      </div>

      {/* Existing Entries List */}
      <div className="lg:col-span-6 bg-zinc-950/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <h3 className="text-sm font-bold text-white tracking-tight">Active Firestore Records</h3>
          <span className="text-xs font-mono text-purple-400">{items.length} Entries</span>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs font-light">
            No dynamic records found in this collection.
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
            {items.map(item => (
              <div 
                key={item.id} 
                className="flex items-start justify-between p-4 bg-[#0c0915] rounded-2xl border border-white/[0.06] hover:border-purple-500/30 transition-colors gap-3"
              >
                <div className="flex flex-col overflow-hidden space-y-1">
                  <div className="font-semibold text-xs text-white truncate">
                    {item.title || item.name || item.version || 'Untitled Entry'}
                  </div>
                  {(item.desc || item.role || item.majorChanges) && (
                    <div className="text-[11px] text-zinc-400 line-clamp-2 font-light">
                      {item.desc || item.role || item.majorChanges}
                    </div>
                  )}
                  {item.fileUrl && (
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-[10px] text-purple-400 truncate hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>View Uploaded Asset</span>
                    </a>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(item.id, item.fileUrl)} 
                  className="text-zinc-500 hover:text-rose-400 p-2 rounded-lg transition-colors shrink-0 cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
