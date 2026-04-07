import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Eye, Upload, FileText, Download, Trash2, Plus, ShieldCheck } from "lucide-react";
import { uploadFile } from "../utils/storage";
import { updateDoc } from "firebase/firestore";

export default function Profile() {
  const { id } = useParams();
  const { currentUser, userData, loading: authLoading } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState("");

  const isDemo = auth.app.options.apiKey.includes("Dummy");

  useEffect(() => {
    async function fetchProfile() {
      if (isDemo) {
        const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
        const user = demoUsers.find(u => u.uid === id);
        if (user) setProfileUser(user);
        
        const demoLogs = JSON.parse(localStorage.getItem("mockLogs")) || [];
        const userLogs = demoLogs.filter(l => l.userId === id).sort((a,b) => new Date(b.date) - new Date(a.date));
        setLogs(userLogs);
        
        const hrs = userLogs.reduce((acc, log) => acc + parseFloat(log.totalHours || 0), 0);
        setTotalHours(hrs);
        
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          setProfileUser(userDoc.data());
        }

        const q = query(collection(db, "logs"), where("userId", "==", id));
        const snap = await getDocs(q);
        const lgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        // Sort in-memory to avoid needing a composite index
        const sortedLogs = lgs.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        
        setLogs(sortedLogs);

        const total = sortedLogs.reduce((acc, current) => acc + parseFloat(current.totalHours || 0), 0);
        setTotalHours(total);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
      setLoading(false);
    }

    if (!authLoading) fetchProfile();
  }, [id, authLoading, isDemo]);

  const handleDocUpload = async (file) => {
    if (!file || !newDocName) return alert("Please provide a document name first.");
    setUploadingDoc(true);
    try {
      const url = await uploadFile(file);
      const newDoc = { name: newDocName, url, uploadedAt: new Date().toISOString() };
      const updatedDocs = [...(profileUser.documents || []), newDoc];
      
      if (isDemo) {
        const updatedUser = { ...profileUser, documents: updatedDocs };
        setProfileUser(updatedUser);
        const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
        const index = demoUsers.findIndex(u => u.uid === id);
        if (index !== -1) {
          demoUsers[index] = updatedUser;
          localStorage.setItem("mockUsers", JSON.stringify(demoUsers));
        }
      } else {
        await updateDoc(doc(db, "users", id), { documents: updatedDocs });
        setProfileUser(prev => ({ ...prev, documents: updatedDocs }));
      }
      setNewDocName("");
      alert("Document uploaded!");
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingDoc(false);
    }
  };

  const deleteDocItem = async (index) => {
    if (!window.confirm("Remove this document?")) return;
    const updatedDocs = profileUser.documents.filter((_, i) => i !== index);
    
    if (isDemo) {
      const updatedUser = { ...profileUser, documents: updatedDocs };
      setProfileUser(updatedUser);
      const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
      const idx = demoUsers.findIndex(u => u.uid === id);
      if (idx !== -1) {
        demoUsers[idx] = updatedUser;
        localStorage.setItem("mockUsers", JSON.stringify(demoUsers));
      }
    } else {
      await updateDoc(doc(db, "users", id), { documents: updatedDocs });
      setProfileUser(prev => ({ ...prev, documents: updatedDocs }));
    }
  };

  if (authLoading || loading) return <h3 style={{textAlign: "center", padding: "48px"}}>Loading Profile...</h3>;
  
  if (!profileUser) return <h3 style={{textAlign: "center", padding: "48px"}}>User Not Found</h3>;

  const userRole = userData?.role?.toLowerCase();
  const isViewerOfThisUser = userRole === 'viewer' && userData?.assignedUserIds?.includes(id);
  const isCompanyOfThisUser = userRole === 'company' && userData?.assignedUserIds?.includes(id);
  
  const canView = userRole === 'admin' || 
                  userData?.Admin === true ||
                  currentUser?.uid === id || 
                  isViewerOfThisUser ||
                  isCompanyOfThisUser;

  const preventCopy = (e) => {
    if (userData?.role === 'viewer') {
      e.preventDefault();
      alert("Copying data is not allowed. Legal compliance may apply.");
      return false;
    }
  };

  if (!canView) return <Navigate to="/" />;

  return (
    <div className={userRole === 'viewer' ? "no-copy" : ""} onCopy={preventCopy} onContextMenu={preventCopy} style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", margin: "0 auto", paddingBottom: userRole === 'viewer' ? "80px" : "0" }}>
      {userRole === 'viewer' && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(255,100,100,0.1)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,100,100,0.2)', padding: '12px', textAlign: 'center', fontSize: '0.85rem', zIndex: 100, color: '#ff8080' }}>
          <strong>Confidential Data:</strong> Copying or extracting this information is strictly prohibited. Legal compliances apply.
        </div>
      )}
      <motion.div className="glass-panel mobile-stack" style={{ padding: "32px", display: "flex", gap: "24px" }} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--wood-accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, margin: '0 auto' }}>
          <User size={40} color="var(--wood-dark)" />
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <h1 style={{ margin: "0 0 8px 0", fontSize: "1.8rem" }}>{profileUser.name}</h1>
          <div style={{ margin: 0, opacity: 0.6, display: "flex", gap: "16px", flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14}/> {profileUser.role?.toUpperCase()}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14}/> Total: <strong>{totalHours}h</strong></span>
          </div>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {profileUser.certificateUrl && (
              <a href={profileUser.certificateUrl} target="_blank" rel="noreferrer" className="glass-button primary" style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
                <ShieldCheck size={14}/> View Official Certificate
              </a>
            )}
            {profileUser.reportUrl && (
              <a href={profileUser.reportUrl} target="_blank" rel="noreferrer" className="glass-button" style={{ fontSize: '0.8rem', padding: '6px 16px', borderColor: 'var(--wood-accent)' }}>
                <FileText size={14} color="var(--wood-accent)"/> View Internship Report
              </a>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div className="glass-panel" style={{ padding: '32px' }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="#d4a373"/> Documents</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {profileUser.documents?.map((docItem, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '16px', position: 'relative' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '4px' }}>{docItem.name}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '12px' }}>{new Date(docItem.uploadedAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={docItem.url} target="_blank" rel="noreferrer" className="glass-button" style={{ flex: 1, padding: '4px', fontSize: '0.75rem' }}><Download size={12}/></a>
                {currentUser?.uid === id && (
                  <button onClick={() => deleteDocItem(idx)} className="glass-button" style={{ background: 'rgba(255,100,100,0.1)', borderColor: 'rgba(255,100,100,0.2)', padding: '4px' }}>
                    <Trash2 size={12} color="#ff8080"/>
                  </button>
                )}
              </div>
            </div>
          ))}
          {(!profileUser.documents || profileUser.documents.length === 0) && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5, padding: '20px' }}>No documents uploaded.</div>
          )}
        </div>

        {currentUser?.uid === id && (
          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.03)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '0.9rem' }}>Upload New Document</h4>
            <div className="mobile-stack" style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Document Name (e.g. Aadhar)" 
                value={newDocName} 
                onChange={e => setNewDocName(e.target.value)} 
                style={{ flex: 1 }}
              />
              <label className="glass-button primary" style={{ cursor: 'pointer', minWidth: '120px' }}>
                {uploadingDoc ? "..." : <><Plus size={16}/> Upload</>}
                <input type="file" hidden onChange={e => handleDocUpload(e.target.files[0])} disabled={uploadingDoc} />
              </label>
            </div>
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 style={{ marginBottom: "16px" }}>Log History</h2>
        
        {logs.length === 0 ? (
          <div className="glass-panel" style={{ padding: "24px", textAlign: "center" }}>No logs recorded yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {logs.map((log, index) => (
              <motion.div 
                key={log.id} 
                className="glass-card" 
                style={{ padding: "24px" }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={18} color="#d4a373"/> {log.date}
                    </h3>
                  </div>
                  <div style={{ fontSize: "0.85rem", opacity: 0.6, color: "var(--wood-accent)", fontWeight: 'bold' }}>
                    {log.arrivalTime} - {log.timeout} ({log.totalHours} hrs)
                  </div>
                </div>

                <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", fontSize: "0.9rem" }}>
                  <div>
                    <strong style={{ display: "block", marginBottom: "8px", color: "var(--wood-accent)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Main Activities</strong>
                    <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", lineHeight: '1.5' }}>{log.activities}</div>
                  </div>
                  
                  <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <strong style={{ display: "block", marginBottom: "8px", color: "var(--wood-accent)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Interactions</strong>
                      <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", fontSize: '0.85rem' }}>{log.interactedWith}</div>
                    </div>
                    <div>
                      <strong style={{ display: "block", marginBottom: "8px", color: "var(--wood-accent)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Discussions</strong>
                      <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", fontSize: '0.85rem' }}>{log.discussions}</div>
                    </div>
                  </div>

                  {log.thoughts && (
                    <div>
                      <strong style={{ display: "block", marginBottom: "8px", color: "var(--wood-accent)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Learnings/Thoughts</strong>
                      <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", fontStyle: "italic", opacity: 0.8 }}>"{log.thoughts}"</div>
                    </div>
                  )}

                  {log.challenges && (
                    <div style={{ padding: "16px", background: "rgba(255,100,100,0.05)", borderRadius: "10px", border: "1px solid rgba(255,100,100,0.1)" }}>
                      <strong style={{ display: "block", marginBottom: "4px", color: "#ff8080", fontSize: '0.8rem', textTransform: 'uppercase' }}>Challenges</strong>
                      <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>{log.challenges}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
