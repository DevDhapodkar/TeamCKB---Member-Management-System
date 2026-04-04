import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserCircle2, 
  User, 
  Heart, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";

export default function Register() {
  const [activeTab, setActiveTab] = useState("intern");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Tab-specific states
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      
      // Additional data to store in Firestore for specific roles
      const extraData = {};
      if (activeTab === 'sponsor') extraData.companyName = companyName;
      if (activeTab === 'donor') extraData.phone = phone;
      if (activeTab === 'donor' || activeTab === 'volunteer') extraData.interest = interest;

      // Pass extraData if the signup function supports it, or handle it here
      // For now, I'll pass it to signup (needs update in AuthContext or handle metadata)
      await signup(email, password, name, activeTab, extraData);
      
      navigate("/dashboard");
    } catch (err) {
      setError("Failed to create an account. " + err.message);
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: 'intern', label: 'Intern', icon: UserCircle2, desc: 'Gain experience and log daily tasks.' },
    { id: 'volunteer', label: 'Volunteer', icon: User, desc: 'Contribute your time to social causes.' },
    { id: 'donor', label: 'Donor', icon: Heart, desc: 'Support our mission financially.' },
    { id: 'sponsor', label: 'Sponsor', icon: Building2, desc: 'Partner with us as an organization.' },
  ];

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px', minHeight: '80vh' }}>
      <motion.div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '900px', padding: 0, overflow: 'hidden' }}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Mobile Top Info / Desktop Sidebar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            <div style={{ background: 'rgba(212, 163, 115, 0.05)', padding: '40px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
              <Link to="/" style={{ color: 'var(--wood-accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> <span className="desktop-only">Back to Home</span>
              </Link>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Join Us</h2>
              <p style={{ opacity: 0.7, lineHeight: '1.6', marginBottom: '32px' }}>
                Become a part of the TeamCKB family. Select your path and start making an impact today.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tabs.map(tab => (
                  <div 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '14px',
                      background: activeTab === tab.id ? 'rgba(212, 163, 115, 0.12)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${activeTab === tab.id ? 'rgba(212, 163, 115, 0.4)' : 'transparent'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <tab.icon size={18} color={activeTab === tab.id ? '#d4a373' : 'rgba(255,255,255,0.5)'} />
                    <span style={{ fontWeight: activeTab === tab.id ? '600' : '400', fontSize: '0.95rem', color: activeTab === tab.id ? '#fff' : 'rgba(255,255,255,0.6)' }}>{tab.label}</span>
                  </div>
                ))}
              </div>

              <div className="desktop-only" style={{ marginTop: '32px', padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.85rem', opacity: 0.6 }}>
                <CheckCircle2 size={14} color="#d4a373" style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                Secure data handling guaranteed by humanitarian standards.
              </div>
            </div>

            {/* Form Area */}
            <div style={{ padding: '40px' }}>
              {error && <div style={{ background: 'rgba(255,70,70,0.1)', color: '#ff8080', padding: '14px', borderRadius: '10px', marginBottom: '24px', border: '1px solid rgba(255,70,70,0.2)', fontSize: '0.85rem' }}>{error}</div>}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="mobile-full" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Full Name</label>
                    <input type="text" className="glass-input" required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" />
                  </div>
                  <div className="mobile-full">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Email</label>
                    <input type="email" className="glass-input" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
                  </div>
                  <div className="mobile-full">
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Password</label>
                    <input type="password" className="glass-input" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" minLength="6" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'sponsor' && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Organization Name</label>
                        <input type="text" className="glass-input" required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your Company Name" />
                      </div>
                    )}

                    {activeTab === 'donor' && (
                      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                        <div className="mobile-full">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Interest Area</label>
                          <select className="glass-input" value={interest} onChange={e => setInterest(e.target.value)}>
                            <option value="Education">Education Support</option>
                            <option value="Health">Health & Hygiene</option>
                            <option value="Food">Food Security</option>
                            <option value="All">All Impact Areas</option>
                          </select>
                        </div>
                        <div className="mobile-full">
                          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>Phone</label>
                          <input type="tel" className="glass-input" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91..." />
                        </div>
                      </div>
                    )}

                    {(activeTab === 'volunteer' || activeTab === 'intern') && (
                      <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.5, fontWeight: '600', textTransform: 'uppercase' }}>{activeTab === 'intern' ? 'Institute Name' : 'Main Area of Interest'}</label>
                        <input type="text" className="glass-input" required value={interest} onChange={e => setInterest(e.target.value)} placeholder={activeTab === 'intern' ? 'University / College' : 'e.g. Content Creation, Field Work'} />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <button disabled={loading} type="submit" className="glass-button primary" style={{ width: '100%', height: '54px', fontSize: '1.1rem', marginTop: '8px' }}>
                  {loading ? "Creating Account..." : `Join as ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} <ArrowRight size={18} style={{ marginLeft: '10px' }} />
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.6, fontSize: '0.9rem' }}>
                Already a member? <Link to="/login" style={{ color: 'var(--wood-accent)', fontWeight: 'bold', textDecoration: 'none', marginLeft: '4px' }}>Log In</Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
