import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, CheckCircle2, Phone, MapPin, Globe } from "lucide-react";

export default function Contact() {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const isDemo = auth.app.options.apiKey.includes("Dummy");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });

  // Pre-fill data if user is logged in
  useEffect(() => {
    if (currentUser && userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        email: currentUser.email || ""
      }));
    }
  }, [currentUser, userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submissionData = {
        ...formData,
        timestamp: serverTimestamp(),
        // Attach user context if available
        userId: currentUser?.uid || "guest",
        userRole: userData?.role || "guest",
        isLoggedIn: !!currentUser
      };

      if (isDemo) {
        // Mock local storage for demo
        const demoContacts = JSON.parse(localStorage.getItem("mockContacts")) || [];
        demoContacts.unshift({ id: Date.now().toString(), ...submissionData, timestamp: new Date().toISOString() });
        localStorage.setItem("mockContacts", JSON.stringify(demoContacts));
      } else {
        await addDoc(collection(db, "contacts"), submissionData);
      }

      setSuccess(true);
      setFormData({ ...formData, message: "" }); // Clear message
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setError("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px 20px' }}>
        <motion.div 
          className="glass-panel" 
          style={{ padding: '60px', maxWidth: '500px', textAlign: 'center' }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div style={{ padding: '20px', background: 'rgba(128,255,128,0.1)', borderRadius: '50%', display: 'inline-flex', marginBottom: '24px' }}>
            <CheckCircle2 size={48} color="#80ff80" />
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>Message Sent!</h2>
          <p style={{ opacity: 0.8, fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '32px' }}>
            Thank you for reaching out to TeamCKB. Our administrators will review your query and get back to you shortly.
          </p>
          <button onClick={() => setSuccess(false)} className="glass-button primary" style={{ width: '100%' }}>Send Another Message</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 0 80px' }}>
      <header style={{ textAlign: 'center', marginBottom: '60px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', marginBottom: '10px' }}
        >
          Get in Touch
        </motion.h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.5, maxWidth: '600px', margin: '0 auto' }}>Have questions or want to partner with us? We're here to help.</p>
      </header>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Contact Info Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <motion.div 
            className="glass-panel" 
            style={{ padding: '32px' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 style={{ marginBottom: '24px', color: 'var(--wood-accent)', fontSize: '1.3rem' }}>Contact Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(212, 163, 115, 0.1)', borderRadius: '12px' }}>
                  <Phone size={20} color="#d4a373" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }}>Toll Free</div>
                  <div style={{ fontWeight: '600' }}>1800 120 327 733</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(212, 163, 115, 0.1)', borderRadius: '12px' }}>
                  <Mail size={20} color="#d4a373" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }}>Email</div>
                  <div style={{ fontWeight: '600' }}>support@teamckb.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px', background: 'rgba(212, 163, 115, 0.1)', borderRadius: '12px' }}>
                  <MapPin size={20} color="#d4a373" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', fontWeight: 'bold' }}>Location</div>
                  <div style={{ fontWeight: '600' }}>Nagpur, India</div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="glass-panel" 
            style={{ padding: '32px', flex: 1 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 style={{ marginBottom: '16px', fontSize: '1.3rem' }}>Social Impact</h3>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', lineHeight: '1.6' }}>
              Whether you're a student, corporate partner, or individual donor, your contribution drives central India's largest movement.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', flex: 1, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>10K+</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>Supporters</div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', textAlign: 'center', flex: 1, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>50+</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase' }}>Projects</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div 
          className="glass-panel" 
          style={{ padding: 'clamp(24px, 5vw, 48px)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error && <div style={{ background: 'rgba(255,70,70,0.1)', color: '#ff8080', padding: '16px', borderRadius: '12px', marginBottom: '32px', border: '1px solid rgba(255,70,70,0.2)', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="mobile-full">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
                  <User size={14} color="#d4a373" /> Name
                </label>
                <input type="text" name="name" className="glass-input" required value={formData.name} onChange={handleChange} placeholder="Your Full Name" disabled={currentUser && userData} />
              </div>
              <div className="mobile-full">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
                  <Mail size={14} color="#d4a373" /> Email
                </label>
                <input type="email" name="email" className="glass-input" required value={formData.email} onChange={handleChange} placeholder="email@address.com" disabled={currentUser && userData} />
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
                <Globe size={14} color="#d4a373" /> Purpose
              </label>
              <select name="subject" className="glass-input" value={formData.subject} onChange={handleChange}>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Donation Support">Donation Support</option>
                <option value="Sponsorship Partnership">Sponsorship Partnership</option>
                <option value="Internship Question">Internship Question</option>
                <option value="Volunteer Interest">Volunteer Interest</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
                <MessageSquare size={14} color="#d4a373" /> Message
              </label>
              <textarea name="message" className="glass-input" required value={formData.message} onChange={handleChange} rows="6" placeholder="How can we assist you?" />
            </div>

            {currentUser && userData && (
              <div style={{ padding: '12px 18px', background: 'rgba(212, 163, 115, 0.08)', borderRadius: '12px', border: '1px solid rgba(212, 163, 115, 0.2)', fontSize: '0.8rem', color: '#d4a373', fontWeight: '500' }}>
                Logged in as <strong>{userData.role}</strong> ({userData.name})
              </div>
            )}

            <button type="submit" disabled={loading} className="glass-button primary" style={{ height: '56px', fontSize: '1.1rem', marginTop: '8px' }}>
              {loading ? "Sending..." : "Submit Message"} <Send size={20} style={{ marginLeft: '10px' }} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
