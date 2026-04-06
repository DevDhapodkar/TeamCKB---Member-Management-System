import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, LayoutDashboard, ShieldCheck, UserCircle, Users, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo1.png";

export default function Navbar() {
  const { currentUser, userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const isAdmin = userData?.role?.toLowerCase() === 'admin' || userData?.Admin === true;

  const NavigationItems = ({ mobile }) => (
    <div className={mobile ? "mobile-stack" : "desktop-only"} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
      <Link to="/" onClick={() => setIsMenuOpen(false)} className="nav-link-item">Home</Link>
      <Link to="/members" onClick={() => setIsMenuOpen(false)} className="nav-link-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Users size={16} /> Team
      </Link>
    </div>
  );

  const ActionButtons = ({ mobile }) => (
    <div className={mobile ? "mobile-stack" : "desktop-only"} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {currentUser ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <UserCircle size={18} color="#d4a373" />
            <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              <strong>{userData?.name || currentUser.email.split('@')[0]}</strong>
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className={mobile ? "mobile-stack" : ""}>
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="glass-button" style={{ borderColor: 'rgba(212, 163, 115, 0.4)', padding: '8px 16px', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="#d4a373" /> Admin
              </Link>
            )}
            
            {(userData?.role?.toLowerCase() === 'intern' || userData?.role?.toLowerCase() === 'volunteer' || userData?.role?.toLowerCase() === 'viewer') && (
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="glass-button" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
            )}
            
            <button onClick={handleLogout} className="glass-button" style={{ background: 'rgba(255, 50, 50, 0.05)', borderColor: 'rgba(255, 50, 50, 0.1)', padding: '8px 16px', fontSize: '0.85rem' }}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} className={mobile ? "mobile-stack" : ""}>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="glass-button mobile-full" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Login</Link>
          <Link to="/register" onClick={() => setIsMenuOpen(false)} className="glass-button primary mobile-full" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>Join Us</Link>
        </div>
      )}
    </div>
  );

  return (
    <>
      <style>{`
        .nav-link-item {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 500;
          transition: all 0.3s ease;
          padding: 6px 0;
          position: relative;
        }
        .nav-link-item:hover {
          color: #d4a373;
        }
        .nav-link-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: #d4a373;
          transition: width 0.3s ease;
        }
        .nav-link-item:hover::after {
          width: 100%;
        }
      `}</style>
      <nav className="glass-panel" style={{ 
        display: 'flex', 
        alignItems: 'center',
        padding: '12px 30px', 
        margin: '20px auto', 
        maxWidth: '1200px',
        width: 'calc(100% - 40px)',
        position: 'sticky',
        top: '20px',
        zIndex: 1000,
        gap: '40px'
      }}>
        {/* Left: Branding */}
        <Link to="/" onClick={() => setIsMenuOpen(false)} style={{ 
          textDecoration: 'none', 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0
        }}>
          <img 
            src={logo} 
            alt="CKB Logo" 
            style={{ 
              width: "32px", 
              height: "32px", 
              objectFit: "contain",
              filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.25))"
            }} 
          />
          <span style={{ 
            fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', 
            fontWeight: '800',
            letterSpacing: '0.04em',
            background: 'linear-gradient(to right, #ffffff, #d4a373)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap'
          }}>
            CHALO KHUSHIYAN BATEIN
          </span>
        </Link>
        
        {/* Center-ish: Navigation Links */}
        <NavigationItems />

        {/* Spacer to push buttons to the right */}
        <div className="desktop-only" style={{ flex: 1 }}></div>

        {/* Right: Action Buttons */}
        <ActionButtons />

        {/* Mobile Toggle */}
        <button 
          className="mobile-only glass-button" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ padding: '8px' }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-panel mobile-only"
            style={{
              position: 'fixed',
              top: '90px',
              left: '20px',
              right: '20px',
              zIndex: 999,
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
              maxHeight: 'calc(100vh - 120px)',
              overflowY: 'auto'
            }}
          >
            <NavigationItems mobile />
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', width: '100%' }} />
            <ActionButtons mobile />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
