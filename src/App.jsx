import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Members from "./pages/Members";
import Contact from "./pages/Contact";

function PrivateRoute({ children, reqRole }) {
  const { currentUser, userData, loading } = useAuth();
  if (loading) return <div style={{textAlign: 'center', padding: '48px'}}>Loading...</div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  if (reqRole === 'admin') {
    const isAdmin = userData?.role?.toLowerCase() === 'admin' || userData?.Admin === true;
    if (!isAdmin) {
      return (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', marginTop: '40px' }}>
          <h2 style={{ color: '#ff6b6b' }}>Permission Denied</h2>
          <p style={{ opacity: 0.8, margin: '20px 0' }}>You do not have administrative privileges to access this portal.</p>
          <Link to="/" className="glass-button">Return home</Link>
        </div>
      );
    }
  } else if (reqRole && userData?.role?.toLowerCase() !== reqRole.toLowerCase()) {
    return <Navigate to="/" />;
  }
  return children;
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

function AppContent() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '0 24px 48px', maxWidth: '1200px', margin: '0 auto', minHeight: 'calc(100vh - 200px)' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
            <Route path="/members" element={<PageWrapper><Members /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
            <Route path="/dashboard" element={<PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>} />
            <Route path="/profile/:id" element={<PrivateRoute><PageWrapper><Profile /></PageWrapper></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute reqRole="admin"><PageWrapper><AdminPanel /></PageWrapper></PrivateRoute>} />
          </Routes>
        </AnimatePresence>
      </div>
      <Footer />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
