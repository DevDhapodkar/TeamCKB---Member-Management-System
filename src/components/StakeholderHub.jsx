import { useState } from "react";
import { ShieldPlus, Mail, Trash2, Search, X, Check, ShieldCheck, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function StakeholderHub({ 
  users, 
  contacts, 
  onDeleteContact, 
  onDeleteUser, 
  createViewerAccount, 
  isDemo, 
  setUsersList,
  msg,
  setMsg
}) {
  const [viewerName, setViewerName] = useState("");
  const [viewerEmail, setViewerEmail] = useState("");
  const [viewerPassword, setViewerPassword] = useState("");
  const [assignedIds, setAssignedIds] = useState([]);
  const [creatingViewer, setCreatingViewer] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const interns = users.filter(u => u.role !== 'admin' && u.role !== 'company' && u.approved !== false);
  const filteredInterns = interns.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateViewer = async (e) => {
    e.preventDefault();
    if (assignedIds.length === 0) return alert("Please select at least one member to assign.");
    setCreatingViewer(true);
    try {
      await createViewerAccount(viewerEmail, viewerPassword, viewerName, assignedIds);
      setMsg({ type: "success", text: `Viewer account for ${viewerName} created!` });
      setViewerName("");
      setViewerEmail("");
      setViewerPassword("");
      setAssignedIds([]);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to create viewer: " + err.message });
    }
    setCreatingViewer(false);
  };

  const toggleAssignedId = (id) => {
    setAssignedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Inquiries Section */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageSquare color="#d4a373"/> Citizen Inquiries
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {contacts.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', opacity: 0.3 }}>Inbox is currently empty.</div>
          ) : (
            contacts.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ padding: '10px', background: 'rgba(212, 163, 115, 0.1)', borderRadius: '10px' }}>
                      <Mail size={20} color="#d4a373" />
                    </div>
                    <div>
                      <h4 style={{ margin: 0 }}>{item.subject}</h4>
                      <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{item.name} • {item.email}</div>
                    </div>
                  </div>
                  <button onClick={() => onDeleteContact(item.id)} className="glass-button" style={{ padding: '6px' }}><Trash2 size={14} color="#ff8080"/></button>
                </div>
                <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', fontSize: '0.85rem', opacity: 0.8 }}>
                  {item.message}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Viewer Account Setup */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldPlus color="#d4a373"/> Access Control Center
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} className="mobile-stack">
          <form onSubmit={handleCreateViewer} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {msg.text && <div style={{ padding: "12px", borderRadius: "10px", background: msg.type === "success" ? "rgba(128,255,128,0.1)" : "rgba(255,128,128,0.1)", color: msg.type === "success" ? "#80ff80" : "#ff8080", fontSize: '0.85rem' }}>{msg.text}</div>}
            <input type="text" className="glass-input" required value={viewerName} onChange={e => setViewerName(e.target.value)} placeholder="Stakeholder Name" />
            <input type="email" className="glass-input" required value={viewerEmail} onChange={e => setViewerEmail(e.target.value)} placeholder="Email Address" />
            <input type="password" className="glass-input" required value={viewerPassword} onChange={e => setViewerPassword(e.target.value)} placeholder="Password (Min 6 chars)" minLength="6" />
            
            <button type="submit" disabled={creatingViewer} className="glass-button primary" style={{ height: "54px" }}>
              {creatingViewer ? "Processing..." : "Authorize Stakeholder Access"}
            </button>
            <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center' }}>Authorized stakeholders can view assigned logs & documents.</p>
          </form>

          <div className="glass-card" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", maxHeight: '450px' }}>
            <h4 style={{ margin: 0, fontSize: '0.9rem' }}>Assign Member Visibility ({assignedIds.length})</h4>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ paddingLeft: "36px", fontSize: "0.8rem", height: "36px" }}
              />
            </div>
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px" }}>
              {filteredInterns.map(user => (
                <div 
                  key={user.uid} 
                  onClick={() => toggleAssignedId(user.uid)}
                  className="hover-card"
                  style={{ 
                    padding: "10px", 
                    borderRadius: "10px", 
                    background: assignedIds.includes(user.uid) ? "rgba(212, 163, 115, 0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${assignedIds.includes(user.uid) ? "rgba(212, 163, 115, 0.2)" : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ fontSize: '0.85rem' }}>{user.name}</div>
                  {assignedIds.includes(user.uid) && <Check size={14} color="#d4a373" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", paddingTop: "32px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <h3 style={{ marginBottom: '20px' }}>Current Stakeholders</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {users.filter(u => u.role === 'viewer').map(viewer => (
              <div key={viewer.uid} className="glass-card" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "600", fontSize: '0.9rem' }}>{viewer.name}</div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.4 }}>{viewer.email}</div>
                  <div style={{ fontSize: '0.7rem', color: '#d4a373', marginTop: '4px' }}>{viewer.assignedUserIds?.length || 0} Members assigned</div>
                </div>
                <button onClick={() => onDeleteUser(viewer.uid, viewer.name)} className="glass-button" style={{ padding: "6px" }}><Trash2 size={14} color="#ff8080" /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
