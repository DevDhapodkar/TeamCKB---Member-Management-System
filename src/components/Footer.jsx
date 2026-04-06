import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import { Globe, MessageSquare, Link as LinkIcon, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass-panel" style={{ 
      padding: '60px 40px 40px', 
      marginTop: '80px',
      borderRadius: '32px 32px 0 0',
      borderBottom: 'none'
    }}>
      <div className="responsive-grid" style={{ 
        maxWidth: '1100px', 
        margin: '0 auto', 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr 1fr', 
        gap: '40px' 
      }}>
        {/* Brand Section */}
        <div className="mobile-stack" style={{ textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <img 
              src={logo} 
              alt="TeamCKB Logo" 
              style={{ 
                width: '45px', 
                height: '45px', 
                objectFit: 'contain',
                filter: "brightness(1.2) drop-shadow(0 0 12px rgba(255, 255, 255, 0.25))"
              }} 
            />
            <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: '700' }}>TeamCKB</h2>
          </div>
          <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--wood-accent)', marginBottom: '12px', letterSpacing: '0.02em' }}>
            साथ है तो संभव है।
          </p>
          <p style={{ opacity: 0.5, marginBottom: '24px', maxWidth: '350px', fontSize: '0.95rem', lineHeight: '1.6' }}>
            Empowering the next generation of social leaders through collective action and community-driven impact.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="#" className="glass-button" style={{ padding: '10px' }}><MessageSquare size={16} /></a>
            <a href="#" className="glass-button" style={{ padding: '10px' }}><Globe size={16} /></a>
            <a href="#" className="glass-button" style={{ padding: '10px' }}><LinkIcon size={16} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Platform</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Home</Link></li>
            <li><Link to="/members" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Team Directory</Link></li>
            <li><Link to="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Member Login</Link></li>
            <li><Link to="/register" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Registration</Link></li>
          </ul>
        </div>

        {/* Contact/Support */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Resources</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <li><Link to="/contact" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> Contact Us</Link></li>
            <li><Link to="/register" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Philanthropy</Link></li>
            <li><Link to="/register" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Partnerships</Link></li>
            <li><Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.95rem' }}>Global Impact</Link></li>
          </ul>
        </div>
      </div>

      <div style={{ 
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        marginTop: '60px', 
        paddingTop: '30px', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px'
      }}>
        <p style={{ fontSize: '0.85rem', opacity: 0.4 }}>
          © {new Date().getFullYear()} TeamCKB. All rights reserved. 
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.5, display: 'flex', alignItems: 'center', gap: '4px' }}>
          Made with <Heart size={12} color="#ff6b6b" fill="#ff6b6b" /> in India
        </p>
      </div>
    </footer>
  );
}
