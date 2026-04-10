import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db, auth } from "../firebase";
import { collection, query, onSnapshot, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Award, Star, History, Users, UserPlus, Mail, ShieldPlus, Heart, PieChart, DollarSign, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { uploadFile } from "../utils/storage";

import AdminSidebar from "../components/AdminSidebar";
import AdminOverview from "../components/AdminOverview";
import MemberHub from "../components/MemberHub";
import ApprovalsHub from "../components/ApprovalsHub";
import ActivityHub from "../components/ActivityHub";
import StakeholderHub from "../components/StakeholderHub";

export default function AdminPanel() {
  const { userData } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const [logsList, setLogsList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // Default to Overview
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [uploadingCert, setUploadingCert] = useState(null);
  const [uploadingReport, setUploadingReport] = useState(null);
  const [expandedUserDocs, setExpandedUserDocs] = useState(null);
  const [awardInputs, setAwardInputs] = useState({}); // {userId: {month: 'July', year: '2025'}}
  const [uploadingPhoto, setUploadingPhoto] = useState(null);
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({length: 5}, (_, i) => (new Date().getFullYear() + i).toString());
  
  // New Viewer Account States
  const { createViewerAccount } = useAuth();
  const [viewerName, setViewerName] = useState("");
  const [viewerEmail, setViewerEmail] = useState("");
  const [viewerPassword, setViewerPassword] = useState("");
  const [assignedIds, setAssignedIds] = useState([]);
  const [creatingViewer, setCreatingViewer] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [searchTerm, setSearchTerm] = useState("");
  
  const isDemo = auth.app.options.apiKey.includes("Dummy");

  useEffect(() => {
    if (isDemo) {
      setUsersList(JSON.parse(localStorage.getItem("mockUsers")) || []);
      setLogsList(JSON.parse(localStorage.getItem("mockLogs")) || []);
      setLoading(false);
      return;
    }

    const uQuery = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const unsubscribeUsers = onSnapshot(uQuery, (snap) => {
      setUsersList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    const lQuery = query(collection(db, "logs"), orderBy("createdAt", "desc"));
    const unsubscribeLogs = onSnapshot(lQuery, (snap) => {
      setLogsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const cQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeContacts = onSnapshot(cQuery, (snap) => {
      setContactsList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeLogs();
      unsubscribeContacts();
    };
  }, [isDemo]);

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Archive/Delete this inquiry?")) return;
    if (isDemo) {
      setContactsList(prev => prev.filter(c => c.id !== contactId));
      return;
    }
    await deleteDoc(doc(db, "contacts", contactId));
  };

  const handleDeleteLog = async (logId) => {
    if (!window.confirm("Delete this log permanently?")) return;
    if (isDemo) {
      const filtered = logsList.filter(l => l.id !== logId);
      setLogsList(filtered);
      localStorage.setItem("mockLogs", JSON.stringify(filtered));
      return;
    }
    await deleteDoc(doc(db, "logs", logId));
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete the viewer account for "${userName}"? This action cannot be undone.`)) return;
    
    try {
      if (isDemo) {
        const filtered = usersList.filter(u => u.uid !== userId);
        setUsersList(filtered);
        localStorage.setItem("mockUsers", JSON.stringify(filtered));
      } else {
        await deleteDoc(doc(db, "users", userId));
      }
      setMsg({ type: "success", text: `Account for ${userName} deleted successfully.` });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Failed to delete user: " + err.message });
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      if (isDemo) {
        const updated = usersList.map(u => u.uid === userId ? { ...u, approved: true } : u);
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "users", userId), { approved: true });
      }
      setMsg({ type: "success", text: "User approved successfully!" });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Approval failed: " + err.message });
    }
  };

  const handleRejectUser = async (userId, userName) => {
    if (!window.confirm(`Reject and delete application for ${userName}?`)) return;
    try {
      if (isDemo) {
        const filtered = usersList.filter(u => u.uid !== userId);
        setUsersList(filtered);
        localStorage.setItem("mockUsers", JSON.stringify(filtered));
      } else {
        await deleteDoc(doc(db, "users", userId));
      }
      setMsg({ type: "success", text: `Application for ${userName} rejected.` });
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    } catch (err) {
      setMsg({ type: "error", text: "Rejection failed: " + err.message });
    }
  };

  const [copyingId, setCopyingId] = useState(null);

  const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      // Fallback for insecure contexts (HTTP)
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
      } catch (err) {
        console.error('Fallback copy failed', err);
      }
      document.body.removeChild(textArea);
      return Promise.resolve();
    }
  };

  const copyCreds = async (user) => {
    setCopyingId(user.uid);
    const generatedEmail = `company_${user.uid.substring(0, 6)}@viewer.teamckb.com`;
    // Generate a secure random password (12 characters)
    const randomPass = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
    const displayName = `${user.name} Viewer`;

    try {
      // Actually create the account in Firebase
      await createViewerAccount(
        generatedEmail, 
        randomPass, 
        displayName, 
        [user.uid]
      );

      const creds = `Company Portal Login\nEmail: ${generatedEmail}\nPassword: ${randomPass}`;
      copyToClipboard(creds);
      alert(`Success! Viewer account created for ${user.name}.\n\nCredentials copied to clipboard:\nEmail: ${generatedEmail}\nPassword: ${randomPass}`);
    } catch (err) {
      if (err.message.includes("auth/email-already-in-use")) {
        alert(`Account for ${user.name} already exists. Use the previous credentials or reset the password in the Firebase Console.`);
      } else {
        alert("Failed to create company account: " + err.message);
      }
    } finally {
      setCopyingId(null);
    }
  };

  const handleCreateViewer = async (e) => {
    e.preventDefault();
    if (assignedIds.length === 0) return alert("Please select at least one user to assign.");
    setCreatingViewer(true);
    setMsg({ type: "", text: "" });
    try {
      await createViewerAccount(viewerEmail, viewerPassword, viewerName, assignedIds);
      setMsg({ type: "success", text: `Viewer account for ${viewerName} created!` });
      setViewerName("");
      setViewerEmail("");
      setViewerPassword("");
      setAssignedIds([]);
      // Refresh user list to show new viewer
      if (isDemo) {
        const demoUsers = JSON.parse(localStorage.getItem("mockUsers")) || [];
        setUsersList(demoUsers);
      }
    } catch (err) {
      setMsg({ type: "error", text: "Failed to create viewer: " + err.message });
    }
    setCreatingViewer(false);
  };

  const handleUploadCertificate = async (userId, file) => {
    if (!file) return;
    setUploadingCert(userId);
    try {
      const url = await uploadFile(file);
      if (isDemo) {
        const updated = usersList.map(u => u.uid === userId ? { ...u, certificateUrl: url } : u);
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "users", userId), { certificateUrl: url });
      }
      setMsg({ type: "success", text: "Certificate uploaded successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: "Upload failed: " + err.message });
    } finally {
      setUploadingCert(null);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  const handleUploadReport = async (userId, file) => {
    if (!file) return;
    setUploadingReport(userId);
    try {
      const url = await uploadFile(file);
      if (isDemo) {
        const updated = usersList.map(u => u.uid === userId ? { ...u, reportUrl: url } : u);
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "users", userId), { reportUrl: url });
      }
      setMsg({ type: "success", text: "Report uploaded successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: "Report upload failed: " + err.message });
    } finally {
      setUploadingReport(null);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  const handleAdminPhotoUpload = async (userId, file) => {
    if (!file) return;
    setUploadingPhoto(userId);
    try {
      const url = await uploadFile(file);
      if (isDemo) {
        const updated = usersList.map(u => u.uid === userId ? { ...u, photoURL: url } : u);
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "users", userId), { photoURL: url });
      }
      setMsg({ type: "success", text: "Profile picture updated!" });
    } catch (err) {
      setMsg({ type: "error", text: "Photo upload failed: " + err.message });
    } finally {
      setUploadingPhoto(null);
      setTimeout(() => setMsg({ type: "", text: "" }), 3000);
    }
  };

  const handleSetAward = async (userId, type, val) => {
    if (!val) return;
    
    try {
      const field = type === 'month' ? 'awardMonth' : 'awardYear';
      const userToAward = usersList.find(u => u.uid === userId);
      const role = userToAward?.role;

      // 1. Find others with this award in same role and clear them
      const othersToClear = usersList.filter(u => u.role === role && u[field] && u.uid !== userId);
      
      if (isDemo) {
        let updated = usersList.map(u => {
          if (u.uid === userId) return { ...u, [field]: val };
          if (u.role === role && u[field]) return { ...u, [field]: null };
          return u;
        });
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        // Clear old winners
        for (const u of othersToClear) {
          await updateDoc(doc(db, "users", u.uid), { [field]: null });
        }
        // Set new winner
        await updateDoc(doc(db, "users", userId), { [field]: val });
      }
      setMsg({ type: "success", text: `${userToAward.name} is now the ${type === 'month' ? 'Month' : 'Year'} winner!` });
    } catch (err) {
      setMsg({ type: "error", text: "Failed to set award: " + err.message });
    }
  };

  const handleClearAward = async (userId, type) => {
    try {
      const field = type === 'month' ? 'awardMonth' : 'awardYear';
      if (isDemo) {
        const updated = usersList.map(u => u.uid === userId ? { ...u, [field]: null } : u);
        setUsersList(updated);
        localStorage.setItem("mockUsers", JSON.stringify(updated));
      } else {
        await updateDoc(doc(db, "users", userId), { [field]: null });
      }
      setMsg({ type: "success", text: "Award cleared!" });
    } catch (err) {
      setMsg({ type: "error", text: "Failed to clear award: " + err.message });
    }
  };


  const toggleAssignedId = (id) => {
    setAssignedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loading) return <div style={{textAlign: "center", padding: "40px"}}>Loading Admin Data...</div>;

  const interns = usersList.filter(u => {
    const role = u.role?.toLowerCase();
    return role !== 'admin' && role !== 'company' && u.approved !== false;
  });
  const pendingUsers = usersList.filter(u => u.approved === false);
  const filteredInterns = interns.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    const allIds = filteredInterns.map(i => i.uid);
    setAssignedIds(prev => [...new Set([...prev, ...allIds])]);
  };

  const handleClearAll = () => {
    const filteredIds = filteredInterns.map(i => i.uid);
    setAssignedIds(prev => prev.filter(id => !filteredIds.includes(id)));
  };

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <header style={{ marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: "4px" }}>Admin Command Centre</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', opacity: 0.6 }}>
            <span style={{ color: 'var(--wood-accent)' }}>Admin</span>
            <span>/</span>
            <span style={{ textTransform: 'capitalize' }}>{activeTab}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div className="glass-panel" style={{ padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="live-indicator" style={{ margin: 0 }}></div>
            <span style={{ fontWeight: "bold", fontSize: "0.8rem", color: '#80ff80' }}>LIVE MONITORING</span>
          </div>
          <div className="glass-panel" style={{ padding: "8px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={16} color="#ff8080" />
            <span style={{ fontWeight: "bold", fontSize: "0.8rem" }}>ROOT ACCESS</span>
          </div>
        </div>
      </header>

      <div className="admin-layout">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          pendingCount={pendingUsers.length} 
        />

        <main className="admin-content">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AdminOverview users={usersList} logs={logsList} />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <MemberHub 
                  users={usersList}
                  logs={logsList}
                  onPhotoUpload={handleAdminPhotoUpload}
                  onSetAward={handleSetAward}
                  onClearAward={handleClearAward}
                  onUploadReport={handleUploadReport}
                  onUploadCertificate={handleUploadCertificate}
                  expandedUserDocs={expandedUserDocs}
                  setExpandedUserDocs={setExpandedUserDocs}
                  uploadingPhoto={uploadingPhoto}
                  uploadingReport={uploadingReport}
                  uploadingCert={uploadingCert}
                  months={months}
                  years={years}
                />
              </motion.div>
            )}

            {activeTab === 'pending' && (
              <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ApprovalsHub 
                  users={usersList} 
                  onApprove={handleApproveUser} 
                  onReject={handleRejectUser} 
                  msg={msg} 
                />
              </motion.div>
            )}

            {activeTab === 'logs' && (
              <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <ActivityHub logs={logsList} onDeleteLog={handleDeleteLog} />
              </motion.div>
            )}

            {(activeTab === 'inquiries' || activeTab === 'viewer') && (
              <motion.div key="stakeholder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <StakeholderHub 
                  users={usersList}
                  contacts={contactsList}
                  onDeleteContact={handleDeleteContact}
                  onDeleteUser={handleDeleteUser}
                  createViewerAccount={createViewerAccount}
                  isDemo={isDemo}
                  setUsersList={setUsersList}
                  msg={msg}
                  setMsg={setMsg}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
