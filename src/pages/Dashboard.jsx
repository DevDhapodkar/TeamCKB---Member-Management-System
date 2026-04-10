import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, 
  LayoutDashboard, 
  History, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Heart, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Users,
  Target,
  MessageSquare
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

// Sub-components for specific roles
function MemberDashboard({ currentUser, userData, isDemo }) {
  const [logs, setLogs] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    arrivalTime: "",
    timeout: "",
    totalHours: "",
    arrivalTime: "",
    timeout: "",
    durationTime: "",
    attendance: "Present",
    activities: "",
    interactedWith: "",
    discussions: "",
    thoughts: "",
    challenges: "",
    remark: "",
    challenges: "",
    remark: ""
  });

  useEffect(() => {
    if (isDemo) {
      const demoLogs = JSON.parse(localStorage.getItem("mockLogs")) || [];
      setLogs(demoLogs.filter(log => log.userId === currentUser.uid).sort((a,b) => new Date(b.date) - new Date(a.date)));
      return;
    }
    const q = query(
      collection(db, "logs"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, [currentUser, isDemo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Auto-calculate duration if arrival and timeout are present
    if (name === "arrivalTime" || name === "timeout") {
      const arrival = name === "arrivalTime" ? value : formData.arrivalTime;
      const timeout = name === "timeout" ? value : formData.timeout;
      
      if (arrival && timeout) {
        const [h1, m1] = arrival.split(":").map(Number);
        const [h2, m2] = timeout.split(":").map(Number);
        const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff > 0) {
          const hrs = (diff / 60).toFixed(2);
          updatedData.totalHours = hrs;
          updatedData.durationTime = `${Math.floor(diff / 60)}h ${diff % 60}m`;
        }
      }
    }
    setFormData(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newLog = {
        userId: currentUser.uid,
        userName: userData.name,
        userRole: userData.role,
        ...formData,
        createdAt: isDemo ? new Date().toISOString() : serverTimestamp()
      };
      if (isDemo) {
        const demoLogs = JSON.parse(localStorage.getItem("mockLogs")) || [];
        demoLogs.unshift({ id: Date.now().toString(), ...newLog });
        localStorage.setItem("mockLogs", JSON.stringify(demoLogs));
        setLogs(demoLogs.filter(log => log.userId === currentUser.uid));
      } else {
        await addDoc(collection(db, "logs"), newLog);
      }
      setSuccessMsg("Log successfully submitted!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setFormData({ 
        ...formData, 
        activities: "", 
        interactedWith: "", 
        discussions: "", 
        thoughts: "", 
        challenges: "",
        remark: "",
        challenges: "",
        remark: ""
      });
    } catch (error) {
      console.error("Error adding log:", error);
    }
  };

  return (
    <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px", paddingBottom: "40px" }}>
      <motion.div className="glass-panel" style={{ padding: "40px" }} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
        <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px' }}>
          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", margin: 0, fontSize: '1.8rem' }}>
            <PlusCircle color="#d4a373" /> Daily Activity
          </h2>
          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              style={{ color: '#80ff80', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', background: 'rgba(128,255,128,0.1)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(128,255,128,0.2)' }}
            >
              <CheckCircle2 size={16} /> {successMsg}
            </motion.div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: '24px' }}>
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="mobile-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                <Calendar size={14} color="#d4a373" /> Date
              </label>
              <input type="date" name="date" className="glass-input" required value={formData.date} onChange={handleChange} />
            </div>
            <div className="mobile-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                <Clock size={14} color="#d4a373" /> Working Hours
              </label>
              <input type="number" name="totalHours" step="0.5" className="glass-input" required value={formData.totalHours} onChange={handleChange} placeholder="Hours spent" />
            </div>
          </div>
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="mobile-full">
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>Arrival Time</label>
              <input type="time" name="arrivalTime" className="glass-input" required value={formData.arrivalTime} onChange={handleChange} />
            </div>
            <div className="mobile-full">
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>Closing Time</label>
              <input type="time" name="timeout" className="glass-input" required value={formData.timeout} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              <Zap size={14} color="#d4a373" /> What did you work on today?
            </label>
            <textarea name="activities" className="glass-input" required value={formData.activities} onChange={handleChange} rows="3" placeholder="I completed..." />
          </div>
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="mobile-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                <Users size={14} color="#d4a373" /> Interactions
              </label>
              <input type="text" name="interactedWith" className="glass-input" required value={formData.interactedWith} onChange={handleChange} placeholder="Met with..." />
            </div>
            <div className="mobile-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                <ShieldCheck size={14} color="#d4a373" /> Attendance Status
              </label>
              <select name="attendance" className="glass-input" value={formData.attendance} onChange={handleChange}>
                <option value="Present">Present</option>
                <option value="On Leave">On Leave</option>
                <option value="Half Day">Half Day</option>
                <option value="Late">Late Arrival</option>
              </select>
            </div>
          </div>
          
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="mobile-full">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
                <MessageSquare size={14} color="#d4a373" /> Key Discussions
              </label>
              <input type="text" name="discussions" className="glass-input" required value={formData.discussions} onChange={handleChange} placeholder="Decided to..." />
            </div>
            <div className="mobile-full" title="Calculated automatically">
              <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>Duration Summary</label>
              <input type="text" className="glass-input" value={formData.durationTime} readOnly placeholder="e.g. 4h 30m" style={{ background: 'rgba(255,255,255,0.03)', opacity: 0.7 }} />
            </div>
          </div>


          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.9rem', opacity: 0.8 }}>
              <Target size={14} color="#d4a373" /> Challenges & Remarks
            </label>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <textarea name="challenges" className="glass-input" value={formData.challenges} onChange={handleChange} rows="2" placeholder="Blockers? (Optional)" />
              <textarea name="remark" className="glass-input" value={formData.remark} onChange={handleChange} rows="2" placeholder="Internal remarks..." />
            </div>
          </div>
          <button type="submit" className="glass-button primary" style={{ marginTop: '10px', height: '56px' }}>Submit Log Entry</button>
        </form>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <h3 style={{ marginBottom: "24px", fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          Recent Logs <div style={{ fontSize: '0.8rem', padding: '4px 10px', borderRadius: '20px', background: 'rgba(212, 163, 115, 0.1)', color: '#d4a373' }}>{logs.length}</div>
        </h3>
        {logs.length === 0 ? <div className="glass-card" style={{ padding: '40px', textAlign: 'center', opacity: 0.6 }}>No data yet.</div> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {logs.slice(0, 4).map(log => (
              <motion.div key={log.id} className="glass-card" style={{ padding: '24px' }} whileHover={{ scale: 1.02 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
                      <Calendar size={16} color="#d4a373" />
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '1rem' }}>{log.date}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#d4a373', fontWeight: 'bold' }}>{log.totalHours}h</div>
                </div>
                <p style={{ fontSize: '0.85rem', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: 'rgba(245, 235, 224, 0.7)', lineHeight: '1.5' }}>{log.activities}</p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function DonorDashboard({ userData }) {
  const donations = [
    { date: "Oct 12, 2025", amount: "₹5,000", project: "Education Fund" },
    { date: "Sep 05, 2025", amount: "₹2,500", project: "Midday Meals" },
  ];

  return (
    <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }}>
      <div>
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <Heart color="#d4a373" size={32} style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹7,500</div>
            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>Lifetime Contribution</div>
          </div>
          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <TrendingUp color="#80ff80" size={32} style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>14</div>
            <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>Lives Impacted</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '24px' }}>Contribution History</h3>
        <div className="glass-panel" style={{ overflow: 'hidden' }}>
          {donations.map((d, i) => (
            <div key={i} style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: i === donations.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{d.project}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{d.date}</div>
              </div>
              <div style={{ fontSize: '1.1rem', color: '#80ff80', fontWeight: 'bold' }}>{d.amount}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '32px' }}>
        <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Zap size={20} color="#d4a373" /> Active Impact Goals
        </h3>
        <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '24px' }}>Current Goal: <strong>Year-End Education Drive</strong> for children.</p>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '12px' }}>
          <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} style={{ height: '100%', background: 'var(--accent-gradient)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '32px' }}>
          <span>₹65,000 Collected</span>
          <span style={{ opacity: 0.5 }}>Target: ₹1,00,000</span>
        </div>
        <button className="glass-button primary" style={{ width: '100%' }}>Contribute Now <ArrowRight size={18} /></button>
      </div>
    </div>
  );
}

function SponsorDashboard({ userData }) {
  return (
    <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
      <div className="glass-panel" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h3 style={{ margin: 0 }}>Partnership Hub</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '4px' }}>Gold Tier Partner</p>
          </div>
          <Building2 size={32} color="#d4a373" />
        </div>
        
        <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '8px' }}>Brand Reach</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>42.5K+</div>
          </div>
          <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '8px' }}>Project Sponsorships</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>3</div>
          </div>
        </div>

        <h4 style={{ marginTop: '32px', marginBottom: '16px' }}>Marketing Placement</h4>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(128,255,128,0.1)', color: '#80ff80', fontSize: '0.75rem' }}>Home Ads: ON</div>
          <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(128,255,128,0.1)', color: '#80ff80', fontSize: '0.75rem' }}>Social: ON</div>
          <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>Mail: OFF</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '40px' }}>
        <h3>Impact Assets</h3>
        <p style={{ opacity: 0.7, marginBottom: '24px', fontSize: '0.95rem' }}>Access partnership certificates and brand assets for CSR reports.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button className="glass-button" style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.9rem' }}>2025 Impact Certificate <ArrowRight size={16} /></button>
          <button className="glass-button" style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.9rem' }}>CKB Partner Badge <ArrowRight size={16} /></button>
          <button className="glass-button" style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.9rem' }}>CSR Data Export <ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}

// Viewer specific sub-component
function ViewerDashboard({ userData, logs, preventCopy, showLegal, acceptLegal }) {
  return (
    <div className="no-copy" onCopy={preventCopy} onContextMenu={preventCopy}>
        <AnimatePresence>
          {showLegal && (
            <motion.div 
              style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div 
                className="glass-panel" 
                style={{ padding: '40px', maxWidth: '600px', textAlign: 'center' }}
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              >
                <div style={{ padding: '16px', borderRadius: '100px', background: 'rgba(255,50,50,0.1)', display: 'inline-flex', marginBottom: '24px' }}>
                  <ShieldCheck size={40} color="#ff8080" />
                </div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Compliance Agreement</h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', opacity: 0.8, marginBottom: '32px' }}>
                  Extracting or sharing private log data from this portal is strictly prohibited. <strong>Legal consequences</strong> apply for unauthorized distribution.
                </p>
                <button onClick={acceptLegal} className="glass-button primary mobile-full" style={{ padding: '16px 40px' }}>I Accept Compliance Terms</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '2.2rem' }}>Viewer Center</h1>
              <p style={{ opacity: 0.7, marginTop: '8px' }}>Monitoring {userData.assignedUserIds?.length || 0} active members.</p>
            </div>
            <div style={{ padding: '8px 20px', borderRadius: '12px', background: 'rgba(212, 163, 115, 0.12)', border: '1px solid rgba(212, 163, 115, 0.25)', color: '#d4a373', fontSize: '0.85rem', fontWeight: 'bold' }}>Limited Permission</div>
          </div>
        </motion.div>

        {logs.length === 0 ? <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', opacity: 0.5 }}>No shared activity found.</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {logs.map(log => (
              <motion.div 
                key={log.id} 
                className="glass-card" 
                style={{ padding: '24px', cursor: 'pointer' }} 
                whileHover={{ y: -5, scale: 1.02 }}
                onClick={() => window.location.href = `/profile/${log.userId}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--wood-accent)', fontSize: '0.95rem' }}>{log.userName}</span>
                  <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>{log.date}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(245, 235, 224, 0.7)', lineHeight: '1.6' }}>{log.activities}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
  );
}

export default function Dashboard() {
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const isDemo = auth.app.options.apiKey.includes("Dummy");
  const [showLegal, setShowLegal] = useState(false);

  useEffect(() => {
    if (!userData) return;
    if (isDemo) {
      const demoLogs = JSON.parse(localStorage.getItem("mockLogs")) || [];
      if (userData.role === 'viewer') {
        const allowedIds = userData.assignedUserIds || [];
        setLogs(demoLogs.filter(l => allowedIds.includes(l.userId)));
      }
      return;
    }
    if (userData.role === 'viewer') {
      const allowedIds = userData.assignedUserIds || ["none"];
      const q = query(collection(db, "logs"), where("userId", "in", allowedIds), orderBy("createdAt", "desc"));
      return onSnapshot(q, (s) => setLogs(s.docs.map(d => ({id: d.id, ...d.data()}))));
    }
  }, [userData, isDemo]);

  useEffect(() => {
    if (userData?.role === 'viewer') {
      if (!sessionStorage.getItem("ckb_legal_accepted")) setShowLegal(true);
    }
  }, [userData]);

  if (userData?.role?.toLowerCase() === 'admin' || userData?.Admin === true) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <div className="glass-panel" style={{ padding: '60px', maxWidth: '600px', margin: '0 auto' }}>
          <h2>Admin Access</h2>
          <p style={{ opacity: 0.7, marginBottom: '32px' }}>Please use the dedicated panel to manage the platform.</p>
          <button onClick={() => navigate('/admin')} className="glass-button primary mobile-full">Launch Admin Panel</button>
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userData?.role?.toLowerCase()) {
      case 'donor': return <DonorDashboard userData={userData} />;
      case 'sponsor': return <SponsorDashboard userData={userData} />;
      case 'viewer': return (
        <ViewerDashboard 
          userData={userData} 
          logs={logs} 
          showLegal={showLegal} 
          acceptLegal={() => { sessionStorage.setItem("ckb_legal_accepted", "true"); setShowLegal(false); }} 
        />
      );
      default: return <MemberDashboard currentUser={currentUser} userData={userData} isDemo={isDemo} />;
    }
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <header className="mobile-stack" style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>Hello, {userData?.name?.split(' ')[0] || 'Partner'}</h1>
          <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Your {userData?.role} control center.</p>
        </div>
        <div className="glass-panel" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '14px' }}>
          {userData?.photoURL ? (
            <img src={userData.photoURL} alt="Profile" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--wood-accent)' }} />
          ) : (
            <LayoutDashboard size={20} color="#d4a373" />
          )}
          <span style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: '0.9rem' }}>{userData?.role?.toLowerCase() || 'partner'} View</span>
        </div>
      </header>
      {renderDashboard()}
    </div>
  );
}
