import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, limit } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Trash2, ExternalLink, Link as LinkIcon, Edit, UserPlus, ShieldPlus, ChevronDown, Check, Search, X, MessageSquare, Mail, Calendar, User, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPanel() {
  const { userData } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // New Viewer Account States
  const { createViewerAccount } = useAuth();
  const [viewerName, setViewerName] = useState("");
  const [viewerEmail, setViewerEmail] = useState("");
  const [viewerPassword, setViewerPassword] = useState("");
  const [assignedIds, setAssignedIds] = useState([]);
  const [creatingViewer, setCreatingViewer] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  
  const isDemo = auth.app.options.apiKey.includes("Dummy");

  useEffect(() => {
    if (isDemo) {
      setUsersList(JSON.parse(localStorage.getItem("mockUsers")) || []);
      setLogsList(JSON.parse(localStorage.getItem("mockLogs")) || []);
      setLoading(false);
      return;
    }

    const uQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribeUsers = onSnapshot(uQuery, (snap) => {
      setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const lQuery = query(collection(db, "logs"), orderBy("createdAt", "desc"));
    const unsubscribeLogs = onSnapshot(lQuery, (snap) => {
      setLogsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const cQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeContacts = onSnapshot(cQuery, (snap) => {
      setContactsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
      unsubscribeContacts();
    };
  }, [isDemo]);

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Archive/Delete this inquiry?")) return;
    if (isDemo) {
      setContactsList(prev => prev.filter(c => c.id !== contactId));
      return;
    }
    await deleteDoc(doc(db, "contacts", contactId));
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Delete this log permanently?")) return;
    if (isDemo) {
      const filtered = logsList.filter(l => l.id !== logId);
      setLogsList(filtered);
      localStorage.setItem("mockLogs", JSON.stringify(filtered));
      return;
    }
    await deleteDoc(doc(db, "logs", logId));
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete the viewer account for "${userName}"? This action cannot be undone.`)) return;
    
    try {
      if (isDemo) {
        const filtered = usersList.filter(u => u.uid !== userId);
        setUsersList(filtered);
        localStorage.setItem("mockUsers", JSON.stringify(filtered));
      } else {
        await deleteDoc(doc(db, "users", userId));
      }
      setMsg({ type: "success", text: `Account for ${userName} deleted successfully.` });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to delete user: " + err.message });
    }
  };

  const [copyingId, setCopyingId] = useState(null);

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for insecure contexts (HTTP)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  };

  const copyCreds = async (user) => {
    setCopyingId(user.uid);
    const generatedEmail = `company_${user.uid.substring(0, 6)}@viewer.teamckb.com`;
    // Generate a secure random password (12 characters)
    const randomPass = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const displayName = `${user.name} Viewer`;

    try {
      // Actually create the account in Firebase
      await createViewerAccount(
        generatedEmail, 
        randomPass, 
        displayName, 
        [user.uid]
      );

      const creds = `Company Portal Login\nEmail: ${generatedEmail}\nPassword: ${randomPass}`;
      copyToClipboard(creds);
      alert(`Success! Viewer account created for ${user.name}.\n\nCredentials copied to clipboard:\nEmail: ${generatedEmail}\nPassword: ${randomPass}`);
    } catch (err) {
      if (err.message.includes("auth/email-already-in-use")) {
        alert(`Account for ${user.name} already exists. Use the previous credentials or reset the password in the Firebase Console.`);
      } else {
        alert("Failed to create company account: " + err.message);
      }
    } finally {
      setCopyingId(null);
    }
  };

  const handleCreateViewer = async (e) => {
    e.preventDefault();
    if (assignedIds.length === 0) return alert("Please select at least one user to assign.");
    setCreatingViewer(true);
    setMsg({ type: "", text: "" });
    try {
      await createViewerAccount(viewerEmail, viewerPassword, viewerName, assignedIds);
      setMsg({ type: "success", text: `Viewer account for ${viewerName} created!` });
      setViewerName("");
      setViewerEmail("");
      setViewerPassword("");
      setAssignedIds([]);
      // Refresh user list to show new viewer
      if (isDemo) {
        const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
        setUsersList(demoUsers);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to create viewer: " + err.message });
    }
    setCreatingViewer(false);
  };

  const toggleAssignedId = (id) => {
    setAssignedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loading) return <div style={{textAlign: "center", padding: "40px"}}>Loading Admin Data...</div>;

  const interns = usersList.filter(u => u.role !== 'admin' && u.role !== 'company');
  const filteredInterns = interns.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    const allIds = filteredInterns.map(i => i.uid);
    setAssignedIds(prev => [...new Set([...prev, ...allIds])]);
  };

  const handleClearAll = () => {
    const filteredIds = filteredInterns.map(i => i.uid);
    setAssignedIds(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <header className="mobile-stack" style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "24px" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>Admin Console</h1>
          <p style={{ opacity: 0.6, fontSize: "1.1rem" }}>System-wide management and monitoring.</p>
        </div>
        <div className="glass-panel" style={{ padding: "10px 24px", borderRadius: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
          <ShieldAlert size={20} color="#ff8080" />
          <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Root Access</span>
        </div>
      </header>

      {/* Responsive Tabs Navigation */}
      <div className="glass-panel custom-scrollbar" style={{ padding: "8px", display: "flex", gap: "8px", marginBottom: "32px", overflowX: "auto", whiteSpace: "nowrap" }}>
        {[
          { id: 'users', label: 'Members', icon: Users },
          { id: 'logs', label: 'Activity Logs', icon: History },
          { id: 'inquiries', label: 'Inquiries', icon: Mail },
          { id: 'viewer', label: 'Viewer Setup', icon: ShieldPlus }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`glass-button ${activeTab === tab.id ? 'primary' : ''}`}
            style={{ flex: "1", minWidth: "140px", padding: "12px" }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel" style={{ padding: "32px" }}>
            <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
              <h2 style={{ margin: 0 }}>Verified Members</h2>
              <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(212, 163, 115, 0.1)', color: '#d4a373', fontSize: '0.85rem' }}>{interns.length} Total</div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {interns.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No users found.</p> : interns.map(user => (
                <div key={user.uid} className="glass-card mobile-stack" style={{ padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: '16px' }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem" }}>{user.name}</strong> <span style={{ opacity: 0.6, fontSize: "0.85rem" }}>({user.role})</span>
                    <div style={{ fontSize: "0.85rem", color: "var(--wood-accent)", marginTop: "4px" }}>{user.email}</div>
                  </div>
                  <div style={{ display: "flex", gap: "12px", width: 'auto' }} className="mobile-stack">
                    <Link to={`/profile/${user.uid}`} className="glass-button mobile-full" style={{ padding: "8px 16px", fontSize: '0.9rem' }}><ExternalLink size={16}/> Profile</Link>
                    <button onClick={() => copyCreds(user)} className="glass-button primary mobile-full" style={{ padding: "8px 16px", fontSize: '0.9rem' }}><LinkIcon size={16}/> Credentials</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'logs' && (
          <motion.div key="logs" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel" style={{ padding: "32px" }}>
            <h2>Global Log Stream</h2>
            <p style={{ opacity: 0.6, marginBottom: "24px", fontSize: "0.95rem" }}>Live monitor of all team activities.</p>
            
            <div style={{ overflowX: "auto", borderRadius: '12px' }} className="custom-scrollbar">
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "16px" }}>Date</th>
                    <th style={{ padding: "16px" }}>Member</th>
                    <th style={{ padding: "16px" }}>Effort</th>
                    <th style={{ padding: "16px" }}>Latest Activity</th>
                    <th style={{ padding: "16px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logsList.length === 0 && <tr><td colSpan="5" style={{ padding: "32px", textAlign: "center", opacity: 0.5 }}>Syncing logs...</td></tr>}
                  {logsList.map(log => (
                    <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }} className="hover-row">
                      <td style={{ padding: "16px", fontSize: '0.9rem' }}>{log.date}</td>
                      <td style={{ padding: "16px", fontWeight: "600", fontSize: '0.9rem' }}>{log.userName}</td>
                      <td style={{ padding: "16px", color: "var(--wood-accent)", fontWeight: 'bold' }}>{log.totalHours}h</td>
                      <td style={{ padding: "16px", fontSize: '0.85rem', opacity: 0.7 }}>{log.activities.substring(0, 40)}{log.activities.length > 40 ? "..." : ""}</td>
                      <td style={{ padding: "16px", textAlign: "right" }}>
                        <button onClick={() => handleDeleteLog(log.id)} className="glass-button" style={{ padding: "8px", background: "rgba(255,100,100,0.1)", borderColor: "rgba(255,100,100,0.2)" }}>
                          <Trash2 size={14} color="#ff8080" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'inquiries' && (
          <motion.div key="inquiries" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel" style={{ padding: "32px" }}>
            <h2>Citizen Inquiries</h2>
            <p style={{ opacity: 0.6, marginBottom: "24px", fontSize: '0.95rem' }}>Public messages submitted via the website.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {contactsList.length === 0 ? (
                <div style={{ padding: '80px', textAlign: 'center', opacity: 0.5 }}>
                  <MessageSquare size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
                  <p>Inbox is empty.</p>
                </div>
              ) : (
                contactsList.map(item => (
                  <div key={item.id} className="glass-card" style={{ padding: '24px' }}>
                    <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', gap: '16px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ padding: '12px', background: 'rgba(212, 163, 115, 0.1)', borderRadius: '12px' }}>
                          <Mail size={24} color="#d4a373" />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            {item.subject} 
                            {item.isLoggedIn && (
                              <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(128,255,128,0.1)', color: '#80ff80', borderRadius: '10px', border: '1px solid rgba(128,255,128,0.2)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <ShieldCheck size={10} /> Verified
                              </span>
                            )}
                          </h4>
                          <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
                            <strong>{item.name}</strong> • {item.email}
                          </p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'left', minWidth: '100px' }}>
                        <div style={{ fontSize: '0.75rem', opacity: 0.4, marginBottom: '8px' }}>
                          {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'Recent'}
                        </div>
                        <button onClick={() => handleDeleteContact(item.id)} className="glass-button" style={{ padding: '6px 10px', background: 'rgba(255,100,100,0.05)', borderColor: 'rgba(255,100,100,0.1)' }}>
                          <Trash2 size={14} color="#ff8080" />
                        </button>
                      </div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>
                      {item.message}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'viewer' && (
          <motion.div key="viewer" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="glass-panel" style={{ padding: "32px" }}>
            <h2><ShieldPlus style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Restricted Viewer Setup</h2>
            <p style={{ opacity: 0.6, marginBottom: "32px", fontSize: '0.95rem' }}>Create specific accounts for stakeholders to monitor team logs.</p>

            <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "start" }}>
              <form onSubmit={handleCreateViewer} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {msg.text && <div style={{ padding: "12px", borderRadius: "10px", background: msg.type === "success" ? "rgba(128,255,128,0.1)" : "rgba(255,128,128,0.1)", color: msg.type === "success" ? "#80ff80" : "#ff8080", border: `1px solid ${msg.type === "success" ? "rgba(128,255,128,0.2)" : "rgba(255,128,128,0.2)"}`, fontSize: '0.9rem' }}>{msg.text}</div>}
                
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600' }}>VIEWER NAME</label>
                  <input type="text" className="glass-input" required value={viewerName} onChange={e => setViewerName(e.target.value)} placeholder="Full Name" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600' }}>EMAIL ADDRESS</label>
                  <input type="email" className="glass-input" required value={viewerEmail} onChange={e => setViewerEmail(e.target.value)} placeholder="viewer@example.com" />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600' }}>PASSWORD</label>
                  <input type="password" className="glass-input" required value={viewerPassword} onChange={e => setViewerPassword(e.target.value)} placeholder="••••••••" minLength="6" />
                </div>
                
                <button type="submit" disabled={creatingViewer} className="glass-button primary" style={{ height: "54px", marginTop: "10px" }}>
                  {creatingViewer ? "Generating Account..." : "Create Viewer Access"}
                </button>
              </form>

              <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px", minHeight: "450px" }}>
                <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: '12px' }}>
                  <h4 style={{ margin: 0 }}>Assign Team {assignedIds.length > 0 && <span style={{ color: 'var(--wood-accent)' }}>({assignedIds.length})</span>}</h4>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <button type="button" onClick={handleSelectAll} style={{ fontSize: "0.75rem", background: "none", border: "none", color: "var(--wood-accent)", cursor: "pointer", fontWeight: '600' }}>ALL</button>
                    <button type="button" onClick={handleClearAll} style={{ fontSize: "0.75rem", background: "none", border: "none", color: "rgba(255,100,100,0.6)", cursor: "pointer", fontWeight: '600' }}>CLEAR</button>
                  </div>
                </div>

                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
                  <input 
                    type="text" 
                    className="glass-input" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: "44px", fontSize: "0.9rem", height: "46px" }}
                  />
                  {searchTerm && <X size={16} onClick={() => setSearchTerm("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", opacity: 0.4 }} />}
                </div>

                <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "6px" }}>
                  {filteredInterns.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", opacity: 0.4, fontStyle: "italic", fontSize: "0.9rem" }}>No matches.</div>
                  ) : (
                    filteredInterns.map(user => (
                      <div 
                        key={user.uid} 
                        onClick={() => toggleAssignedId(user.id || user.uid)}
                        style={{ 
                          padding: "14px", 
                          borderRadius: "14px", 
                          background: assignedIds.includes(user.id || user.uid) ? "rgba(212, 163, 115, 0.12)" : "rgba(255,255,255,0.02)",
                          border: `1px solid ${assignedIds.includes(user.id || user.uid) ? "rgba(212, 163, 115, 0.3)" : "rgba(255,255,255,0.05)"}`,
                          cursor: "pointer",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "all 0.2s"
                        }}
                        className="hover-card"
                      >
                        <div>
                          <div style={{ fontWeight: assignedIds.includes(user.id || user.uid) ? "600" : "400", fontSize: "0.9rem" }}>{user.name}</div>
                          <div style={{ fontSize: "0.75rem", opacity: 0.4 }}>{user.email}</div>
                        </div>
                        {assignedIds.includes(user.id || user.uid) ? (
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "var(--wood-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Check size={12} color="#000" strokeWidth={4} />
                          </div>
                        ) : (
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.1)" }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "40px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "32px" }}>
              <h3 style={{ marginBottom: '24px' }}>Manage Existing Stakeholders</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {usersList.filter(u => u.role === 'viewer').map(viewer => (
                  <div key={viewer.uid} className="glass-card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", fontSize: '0.95rem' }}>{viewer.name}</div>
                      <div style={{ fontSize: "0.8rem", opacity: 0.4, marginBottom: '12px' }}>{viewer.email}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--wood-accent)", opacity: 0.8, lineHeight: '1.4' }}>
                        <strong>Access:</strong> {viewer.assignedUserIds?.length || 0} Members
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteUser(viewer.uid, viewer.name)}
                      className="glass-button" 
                      style={{ padding: "8px", background: "rgba(255,100,100,0.05)", borderColor: "rgba(255,100,100,0.1)" }}
                    >
                      <Trash2 size={14} color="#ff8080" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
