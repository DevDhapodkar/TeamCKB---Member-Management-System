import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";
import { User, Calendar, Clock, MapPin, Eye } from "lucide-react";

export default function Profile() {
  const { id } = useParams();
  const { currentUser, userData, loading: authLoading } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);

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
        </div>
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
