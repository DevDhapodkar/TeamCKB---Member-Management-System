import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.includes("auth/") ? "Failed to sign in. Check your credentials." : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '80vh',
      padding: '20px'
    }}>
      <motion.div 
        className="glass-panel" 
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: 'clamp(24px, 10vw, 48px)',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            style={{ 
              width: '70px', 
              height: '70px', 
              background: 'var(--accent-gradient)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 24px rgba(212, 163, 115, 0.2)'
            }}
          >
            <Lock size={30} color="#120907" />
          </motion.div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 6vw, 2.2rem)', marginBottom: '8px' }}>Welcome Back</h2>
          <p style={{ fontSize: '1rem', opacity: 0.5 }}>Secure login for TeamCKB members.</p>
        </div>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ 
              background: 'rgba(255, 70, 70, 0.1)', 
              color: '#ff8080',
              padding: '14px', 
              borderRadius: '10px', 
              marginBottom: '24px', 
              border: '1px solid rgba(255, 70, 70, 0.15)',
              fontSize: '0.85rem',
              textAlign: 'center'
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
              <Mail size={14} color="#d4a373" /> Email
            </label>
            <input 
              type="email" 
              className="glass-input" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="verified@email.com"
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.85rem', opacity: 0.7, fontWeight: '600', textTransform: 'uppercase' }}>
              <Lock size={14} color="#d4a373" /> Password
            </label>
            <input 
              type="password" 
              className="glass-input" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button disabled={loading} type="submit" className="glass-button primary" style={{ width: '100%', marginTop: '8px', height: '52px', fontSize: '1rem' }}>
            {loading ? "Authenticating..." : "Sign In"} <ArrowRight size={18} style={{ marginLeft: '8px' }} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.9rem' }}>
          <span style={{ opacity: 0.5 }}>Not registered?</span> 
          <Link to="/register" style={{ color: 'var(--wood-accent)', fontWeight: 'bold', textDecoration: 'none', marginLeft: '6px' }}>Join Us</Link>
        </div>
      </motion.div>
    </div>
  );
}
