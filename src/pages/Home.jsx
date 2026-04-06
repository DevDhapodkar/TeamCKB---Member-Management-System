import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Heart, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Phone, 
  ArrowRight, 
  UtensilsCrossed, 
  Gift, 
  Sparkles,
  MapPin
} from "lucide-react";
import logo from "../assets/logo1.png";

export default function Home() {
  const initiatives = [
    {
      title: "Food Distribution",
      desc: "Our primary objective is to provide quality food to those in need, ensuring no one in the city goes to bed hungry.",
      icon: UtensilsCrossed,
      color: "#d4a373"
    },
    {
      title: "Educational Support",
      desc: "Empowering underprivileged children through monthly study material kits and educational guidance.",
      icon: BookOpen,
      color: "#a3c4f3"
    },
    {
      title: "Hygiene & Health",
      desc: "Distributing monthly hygiene kits and promoting menstrual awareness among girls and women.",
      icon: ShieldCheck,
      color: "#80ff80"
    },
    {
      title: "Cloth Distribution",
      desc: "Collecting and redistributing quality clothing to bring comfort and dignity to those in need.",
      icon: Gift,
      color: "#ffb4ac"
    }
  ];

  return (
    <div className="container" style={{ display: "flex", flexDirection: "column", gap: "80px", color: "white", padding: "40px 20px" }}>
      {/* Hero Section */}
      <section style={{ 
        minHeight: "75vh", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        textAlign: "center",
        position: "relative",
        padding: "20px 0"
      }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ 
            marginBottom: "32px",
            position: "relative",
            display: "inline-block"
          }}
        >
          {/* Subtle Glow Background */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "140%",
            height: "140%",
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)",
            filter: "blur(20px)",
            zIndex: -1,
            borderRadius: "50%"
          }} />
          
          <img 
            src={logo} 
            alt="CKB Logo" 
            style={{ 
              width: "100%", 
              maxWidth: "240px", 
              height: "auto", 
              objectFit: "contain", 
              filter: "brightness(1.1) contrast(1.1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.25)) drop-shadow(0 0 40px rgba(255, 255, 255, 0.1))" 
            }} 
          />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "16px", background: "linear-gradient(to right, #fff, #d4a373)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          CHALO KHUSHIYAN BATEIN
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontSize: "1.2rem", opacity: 0.8, maxWidth: "700px", lineHeight: "1.6", marginBottom: "40px" }}
        >
          Empowering lives through nutritious meals and essential support. A decade-plus of dedicated service by the <strong>Five Fold Maitri Society (Regd)</strong>.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mobile-stack"
          style={{ display: "flex", gap: "20px", width: "100%", justifyContent: "center" }}
        >
          <Link to="/register" className="glass-button primary mobile-full" style={{ padding: "16px 40px", fontSize: "1.1rem" }}>
            Join Us <ArrowRight size={20} style={{ marginLeft: "10px" }} />
          </Link>
          <Link to="/login" className="glass-button mobile-full" style={{ padding: "16px 40px", fontSize: "1.1rem" }}>
            Member Login
          </Link>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -30 }}
          viewport={{ once: true }}
          className="glass-panel" 
          style={{ padding: "40px" }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "2rem", marginBottom: "24px", color: "var(--wood-accent)" }}>
            <Sparkles /> Our Mission
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.8", opacity: 0.9 }}>
            Prior to your event, wedding, or function, the Five Fold Maitri Society ensures that surplus food reaches those who need it most. Our primary objective is to provide basic sustenance and quality food to ensuring that no individual in the city goes to bed hungry.
          </p>
        </motion.div>
        
        <motion.div 
          whileInView={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 30 }}
          viewport={{ once: true }}
          className="glass-panel" 
          style={{ padding: "40px" }}
        >
          <h2 style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "2rem", marginBottom: "24px", color: "var(--wood-accent)" }}>
            <Heart /> Our Vision
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.8", opacity: 0.9 }}>
            We envision promoting joy and contentment among individuals irrespective of their caste or creed. We aim to elevate the quality of life for the underprivileged by providing them with access to quality food and education, while instilling in them the essence of virtuous living.
          </p>
        </motion.div>
      </section>

      {/* Initiatives Feed */}
      <section>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h2 style={{ fontSize: "2.5rem", marginBottom: "16px" }}>Our Active Initiatives</h2>
          <p style={{ opacity: 0.7, fontSize: "1.1rem" }}>Small acts of kindness create ripples of happiness everywhere we go.</p>
        </div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {initiatives.map((item, index) => (
            <motion.div 
              key={index}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 30 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card" 
              style={{ padding: "32px", textAlign: "center" }}
              whileHover={{ y: -10 }}
            >
              <div style={{ 
                width: "60px", 
                height: "60px", 
                borderRadius: "18px", 
                background: `${item.color}15`, 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                margin: "0 auto 24px",
                border: `1px solid ${item.color}30`
              }}>
                <item.icon color={item.color} size={28} />
              </div>
              <h3 style={{ fontSize: "1.4rem", marginBottom: "16px" }}>{item.title}</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.8, lineHeight: "1.6" }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact & Society Info */}
      <section className="glass-panel" style={{ padding: "40px", textAlign: "center", background: "rgba(0,0,0,0.2)" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "24px" }}>Understand the Process</h2>
        <p style={{ fontSize: "1.1rem", maxWidth: "800px", margin: "0 auto 40px", opacity: 0.8 }}>
          Once we have your request for surplus food, our team meticulously collects, tastes, and packs it within minutes to ensure thoroughness and swift redistribution. 
        </p>
        
        <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
            <Phone size={20} color="var(--wood-accent)" /> <strong>Toll Free:</strong> 1800 120 327 733
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.1rem" }}>
            <MapPin size={20} color="var(--wood-accent)" /> Nagpur, Maharashtra, India
          </div>
        </div>
        
        <div className="mobile-stack" style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "16px" }}>
          <div className="mobile-full" style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", fontSize: "0.9rem" }}>
            Established 2017
          </div>
          <div className="mobile-full" style={{ padding: "12px 24px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", fontSize: "0.9rem" }}>
            Five Fold Maitri Society (Regd)
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <footer style={{ padding: "40px 0", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.1)", opacity: 0.6 }}>
        <p style={{ fontStyle: "italic", fontSize: "1.1rem" }}>साथ है तो संभव है।</p>
        <p style={{ marginTop: "16px", fontSize: "0.9rem" }}>© 2017 - 2026 Five Fold Maitri Society (Regd). All Rights Reserved.</p>
      </footer>
    </div>
  );
}
