import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCheck, X, ShieldCheck, Calendar } from "lucide-react";

export default function ApprovalsHub({ users, onApprove, onReject, msg }) {
  const [expandedId, setExpandedId] = useState(null);

  const pendingUsers = users;

  const DetailItem = ({ label, value }) => (
    <div style={{ marginBottom: '8px' }}>
      <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>{label}</span>
      <span style={{ fontSize: '0.9rem', color: '#f5ebe0' }}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Verification Queue</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '4px' }}>Review and verify security for new member registrations.</p>
        </div>
        <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(212, 163, 115, 0.1)', color: '#d4a373', fontSize: '0.9rem', fontWeight: 'bold' }}>
          {pendingUsers.length} PENDING
        </div>
      </div>

      {msg.text && (
        <div style={{ 
          padding: "16px", 
          borderRadius: "14px", 
          marginBottom: '24px',
          background: msg.type === "success" ? "rgba(128,255,128,0.1)" : "rgba(255,128,128,0.1)", 
          color: msg.type === "success" ? "#80ff80" : "#ff8080", 
          border: `1px solid ${msg.type === "success" ? "rgba(128,255,128,0.1)" : "rgba(255,128,128,0.1)"}`,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {msg.type === 'success' ? <UserCheck size={18}/> : <X size={18}/>}
          {msg.text}
        </div>
      )}
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {pendingUsers.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.3, padding: '80px' }}>
            <ShieldCheck size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
            <h3>All clear!</h3>
            <p>No pending applications require your attention.</p>
          </div>
        ) : pendingUsers.map(user => (
          <motion.div 
            key={user.uid} 
            className="glass-card" 
            style={{ padding: "24px" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: '20px', marginBottom: expandedId === user.uid ? '24px' : '0' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <strong style={{ fontSize: "1.2rem" }}>{user.name}</strong>
                  <span style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(212, 163, 115, 0.15)', color: '#d4a373', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase' }}>{user.role}</span>
                </div>
                <div style={{ fontSize: "0.9rem", opacity: 0.6, marginTop: "6px" }}>{user.email}</div>
                {user.createdAt && (
                  <div style={{ fontSize: '0.75rem', opacity: 0.4, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> Registered: {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </div>
                )}
              </div>
              
              <div style={{ display: "flex", gap: "12px", width: 'auto' }} className="mobile-stack">
                <button 
                  onClick={() => setExpandedId(expandedId === user.uid ? null : user.uid)} 
                  className="glass-button" 
                  style={{ padding: "12px 24px", fontSize: '0.9rem' }}
                >
                  {expandedId === user.uid ? "Hide Details" : "Review Details"}
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                   <button 
                    onClick={() => onReject(user.uid, user.name)} 
                    className="glass-button" 
                    style={{ padding: "12px 24px", fontSize: '0.9rem', color: '#ff8080', borderColor: 'rgba(255,128,128,0.2)' }}
                  >
                    <X size={18}/>
                  </button>
                  <button 
                    onClick={() => onApprove(user.uid)} 
                    className="glass-button primary" 
                    style={{ padding: "12px 24px", fontSize: '0.9rem' }}
                  >
                    <UserCheck size={18}/> Approve
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === user.uid && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {user.role?.toLowerCase() === 'volunteer' ? (
                      <>
                        <DetailItem label="Age Range" value={user.age} />
                        <DetailItem label="Occupation" value={user.aboutYourself} />
                        <DetailItem label="WhatsApp" value={user.whatsapp} />
                        <DetailItem label="Calling No." value={user.phone} />
                        <DetailItem label="Feasible Day" value={user.feasibleDay} />
                        <DetailItem label="Feasible Timing" value={user.feasibleTiming} />
                        <DetailItem label="Start Date" value={user.startDate === 'Other' ? user.otherStartDate : user.startDate} />
                        <DetailItem label="Source" value={user.source} />
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Expertise" value={user.expertise} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Motivation" value={user.interestReason} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Previous Experience" value={user.previousExperience} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Address" value={user.address} />
                        </div>
                      </>
                    ) : (
                      <>
                        <DetailItem label="Age" value={user.age} />
                        <DetailItem label="WhatsApp" value={user.whatsapp} />
                        <DetailItem label="Calling No." value={user.phone} />
                        <DetailItem label="Education" value={user.education} />
                        <DetailItem label="College" value={user.college} />
                        <DetailItem label="Stream" value={user.stream} />
                        <DetailItem label="Status" value={user.status} />
                        <DetailItem label="Domain" value={user.domain} />
                        <DetailItem label="Duration" value={user.duration} />
                        <DetailItem label="Preference" value={user.preference} />
                        <DetailItem label="Timing" value={user.timing} />
                        <DetailItem label="Start Date" value={user.startDate === 'Other' ? user.otherStartDate : user.startDate} />
                        <DetailItem label="Source" value={user.source} />
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Motivation" value={user.interestReason} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Experience" value={user.previousExperience} />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <DetailItem label="Address" value={user.address} />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
