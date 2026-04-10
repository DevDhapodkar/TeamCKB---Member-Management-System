import { useState } from "react";
import { Search, X, Upload, Award, Star, FolderOpen, File, Download, ExternalLink, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function MemberHub({ 
  users, 
  logs = [],
  onPhotoUpload, 
  onSetAward, 
  onClearAward, 
  onUploadReport, 
  onUploadCertificate,
  expandedUserDocs,
  setExpandedUserDocs,
  uploadingPhoto,
  uploadingReport,
  uploadingCert,
  months,
  years
}) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const interns = users.filter(u => u.role !== 'admin' && u.role !== 'company' && u.approved !== false);
  const filteredInterns = interns.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserTotalHours = (uid) => {
    return logs
      .filter(log => log.userId === uid)
      .reduce((acc, log) => acc + parseFloat(log.totalHours || 0), 0)
      .toFixed(1);
  };

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Member Directory</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '4px' }}>Manage all verified interns and volunteers.</p>
        </div>
        
        <div style={{ position: "relative", minWidth: '300px' }} className="mobile-full">
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "44px", fontSize: "0.9rem", height: "46px" }}
          />
          {searchTerm && <X size={16} onClick={() => setSearchTerm("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", opacity: 0.4 }} />}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {filteredInterns.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '40px' }}>No members found.</p>
        ) : (
          filteredInterns.map(user => (
            <div key={user.uid} className="glass-card" style={{ padding: "16px 24px" }}>
              <div className="mobile-stack" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <label style={{ cursor: 'pointer', position: 'relative' }}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--wood-accent)' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212, 163, 115, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={24} color="#d4a373" />
                      </div>
                    )}
                    <div style={{ position: 'absolute', bottom: -2, right: -2, background: 'var(--wood-accent)', borderRadius: '50%', padding: '4px' }}>
                      <Upload size={10} color="#000" />
                    </div>
                    <input type="file" hidden accept="image/*" onChange={(e) => onPhotoUpload(user.uid, e.target.files[0])} />
                  </label>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: "1.1rem" }}>{user.name}</strong>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'rgba(212, 163, 115, 0.1)', color: '#d4a373', borderRadius: '20px', fontWeight: 'bold' }}>{user.role}</span>
                      <span style={{ fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', background: 'rgba(128, 255, 128, 0.05)', color: '#80ff80', borderRadius: '20px', border: '1px solid rgba(128,255,128,0.1)' }}>
                        <Clock size={12} /> {getUserTotalHours(user.uid)}h Total
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", opacity: 0.6, marginTop: "4px" }}>{user.email}</div>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: 'column', gap: "10px", width: 'auto' }} className="mobile-full">
                  {/* Awards Section */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color={user.awardMonth ? "#d4a373" : "rgba(255,255,255,0.3)"} />
                      <select 
                        className="glass-input" 
                        style={{ height: '28px', width: '90px', fontSize: '0.7rem', padding: '0 4px', background: user.awardMonth ? 'rgba(212, 163, 115, 0.1)' : '' }} 
                        value={user.awardMonth || ""}
                        onChange={(e) => onSetAward(user.uid, 'month', e.target.value)}
                      >
                        <option value="">Month...</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {user.awardMonth && <button onClick={() => onClearAward(user.uid, 'month')} style={{ color: '#ff8080', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }} title="Clear">×</button>}
                    </div>

                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={14} color={user.awardYear ? "#d4a373" : "rgba(255,255,255,0.3)"} />
                      <select 
                        className="glass-input" 
                        style={{ height: '28px', width: '80px', fontSize: '0.7rem', padding: '0 4px', background: user.awardYear ? 'rgba(212, 163, 115, 0.1)' : '' }} 
                        value={user.awardYear || ""}
                        onChange={(e) => onSetAward(user.uid, 'year', e.target.value)}
                      >
                        <option value="">Year...</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      {user.awardYear && <button onClick={() => onClearAward(user.uid, 'year')} style={{ color: '#ff8080', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.8rem' }} title="Clear">×</button>}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", width: '100%', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => setExpandedUserDocs(expandedUserDocs === user.uid ? null : user.uid)} 
                      className={`glass-button ${expandedUserDocs === user.uid ? 'primary' : ''}`} 
                      style={{ padding: "6px 12px", fontSize: '0.8rem' }}
                    >
                      <FolderOpen size={14}/> Docs
                    </button>
                    <label className="glass-button" style={{ padding: "6px 12px", fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {uploadingReport === user.uid ? "..." : <><File size={14}/> Report</>}
                      <input type="file" hidden accept="*/*" onChange={(e) => onUploadReport(user.uid, e.target.files[0])} />
                    </label>
                    <label className="glass-button" style={{ padding: "6px 12px", fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {uploadingCert === user.uid ? "..." : <><Award size={14}/> Cert</>}
                      <input type="file" hidden accept="*/*" onChange={(e) => onUploadCertificate(user.uid, e.target.files[0])} />
                    </label>
                    <Link to={`/profile/${user.uid}`} className="glass-button" style={{ padding: "6px 12px", fontSize: '0.8rem' }}><ExternalLink size={14}/></Link>
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {expandedUserDocs === user.uid && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '12px' }}
                  >
                    <div style={{ padding: '24px 0' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                        {user.role?.toLowerCase() === 'volunteer' ? (
                          <>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>WhatsApp</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.whatsapp || 'N/A'}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Occupation</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.aboutYourself}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Expertise</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.expertise || 'N/A'}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Feasible Day</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.feasibleDay}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Timing</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.feasibleTiming}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Start Date</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.startDate === 'Other' ? user.otherStartDate : user.startDate}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>WhatsApp</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.whatsapp || 'N/A'}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Education</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.education} ({user.stream})</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>College</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.college}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Internship Domain</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.domain}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Duration</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.duration}</span>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', display: 'block' }}>Timing</span>
                              <span style={{ fontSize: '0.85rem' }}>{user.timing?.substring(0, 30)}...</span>
                            </div>
                          </>
                        )}
                      </div>

                      <div style={{ marginBottom: '24px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '12px', color: 'var(--wood-accent)' }}>Member Documents</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                          {user.documents && user.documents.length > 0 ? user.documents.map((docItem, idx) => (
                            <div key={idx} className="glass-card" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)' }}>
                              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '4px' }}>{docItem.name}</div>
                              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginBottom: '8px' }}>{new Date(docItem.uploadedAt).toLocaleDateString()}</div>
                              <a href={docItem.url} target="_blank" rel="noreferrer" className="glass-button" style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}>
                                <Download size={14}/> View/Download
                              </a>
                            </div>
                          )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', opacity: 0.5, padding: '12px', fontSize: '0.85rem' }}>No documents uploaded by member.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
