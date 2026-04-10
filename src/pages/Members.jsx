import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Award, Star, Calendar, ArrowRight, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Members() {
  const [activeTab, setActiveTab] = useState("interns");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const isDemo = auth.app.options.apiKey.includes("Dummy");

  useEffect(() => {
    if (isDemo) {
      const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
      setMembers(demoUsers);
      setLoading(false);
      return;
    }

    const q = query(collection(db, "users"), where("role", "in", ["intern", "volunteer"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return unsubscribe;
  }, [isDemo]);

  const filteredMembers = members.filter(m => m.role?.toLowerCase() === activeTab.slice(0, -1));
  
  const monthAward = filteredMembers.find(m => m.awardMonth);
  const yearAward = filteredMembers.find(m => m.awardYear);

  const stats = [
    { label: "Active Interns", value: members.filter(m => m.role === 'intern').length, icon: Users },
    { label: "Dedicated Volunteers", value: members.filter(m => m.role === 'volunteer').length, icon: Star },
    { label: "Impact Projects", value: "12+", icon: Calendar },
  ];

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header Section */}
      <section style={{ textAlign: 'center', margin: '40px 0 60px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '16px' }}
        >
          Our Moving Force
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: '1.2rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}
        >
          Meet the dedicated individuals driving change and making "साथ है तो संभव है" a reality every single day.
        </motion.p>
      </section>

      {/* Quick Stats */}
      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '60px' }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel" 
            style={{ padding: '32px', textAlign: 'center' }}
          >
            <stat.icon size={32} color="#d4a373" style={{ marginBottom: '16px' }} />
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '4px' }}>{stat.value}</div>
            <div style={{ opacity: 0.6, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {["interns", "volunteers"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`glass-button mobile-full ${activeTab === tab ? "primary" : ""}`}
            style={{ padding: '14px 32px', fontSize: '1rem', textTransform: 'capitalize' }}
          >
            {tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Awards Section */}
          <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '60px' }}>
            <AwardCard 
              title={`${activeTab.slice(0, -1)} of the Month`} 
              user={monthAward} 
              period={monthAward?.awardMonth || "This Month"}
              type="month"
            />
            <AwardCard 
              title={`${activeTab.slice(0, -1)} of the Year`} 
              user={yearAward} 
              period={yearAward?.awardYear || new Date().getFullYear()}
              type="year"
            />
          </div>

          {/* Full List */}
          <h3 style={{ marginBottom: '32px', fontSize: '1.8rem' }}>Directory</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {loading ? (
              <p style={{ textAlign: 'center', opacity: 0.5, gridColumn: '1/-1' }}>Loading members...</p>
            ) : filteredMembers.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5, gridColumn: '1/-1' }}>No members registered in this category yet.</p>
            ) : (
              filteredMembers.map(member => (
                <Link 
                  to={`/profile/${member.id || member.uid}`} 
                  key={member.id || member.uid} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div 
                    className="glass-card" 
                    style={{ padding: '24px', textAlign: 'center' }}
                    whileHover={{ y: -8 }}
                  >
                    <div style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%', 
                      background: 'rgba(212, 163, 115, 0.1)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      border: '2px solid rgba(212, 163, 115, 0.2)',
                      overflow: 'hidden'
                    }}>
                      {member.photoURL ? (
                        <img src={member.photoURL} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <UserCircle size={40} color="#d4a373" />
                      )}
                    </div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{member.name}</h4>
                    {currentUser && <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '16px' }}>{member.email}</p>}
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      color: 'var(--wood-accent)', 
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      View Profile <ArrowRight size={14} />
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function AwardCard({ title, user, period, type }) {
  return (
    <div className="glass-panel" style={{ 
      padding: '32px', 
      position: 'relative', 
      overflow: 'hidden',
      border: `1px solid ${type === 'year' ? 'rgba(212, 163, 115, 0.4)' : 'rgba(255,255,255,0.1)'}`
    }}>
      <div className="desktop-only" style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.05 }}>
        <Award size={180} />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Award size={20} color="#d4a373" />
          <h4 style={{ fontSize: '1.1rem', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h4>
        </div>
        
        {user ? (
          <div className="mobile-stack" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(212, 163, 115, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(212, 163, 115, 0.3)', flexShrink: 0, overflow: 'hidden' }}>
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <UserCircle size={50} color="#d4a373" />
              )}
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>{user.name}</h3>
              <p style={{ color: 'var(--wood-accent)', fontWeight: 'bold', fontSize: '1.1rem', margin: 0 }}>{period}</p>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', opacity: 0.4, fontStyle: 'italic', fontSize: '0.9rem' }}>
            Selection in progress...
          </div>
        )}
      </div>
    </div>
  );
}
