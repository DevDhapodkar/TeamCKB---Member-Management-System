import { LayoutDashboard, Users, UserPlus, History, Mail, ShieldPlus, FileText, PieChart, Heart, DollarSign } from "lucide-react";

export default function AdminSidebar({ activeTab, setActiveTab, pendingCount }) {
  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'All Members', icon: Users },
    { id: 'pending', label: 'Approvals Queue', icon: UserPlus, count: pendingCount },
    { id: 'logs', label: 'Attendance Logs', icon: History },
    { id: 'inquiries', label: 'Inquiries', icon: Mail },
    { id: 'viewer', label: 'Access Control', icon: ShieldPlus }
  ];

  return (
    <aside className="admin-sidebar desktop-only">
      <div style={{ padding: '0 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Management</h3>
      </div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <item.icon size={20} />
            <span style={{ flex: 1, textAlign: 'left' }}>{item.label}</span>
            {item.count > 0 && (
              <span style={{ 
                background: 'var(--wood-accent)', 
                color: '#120907', 
                fontSize: '0.7rem', 
                padding: '2px 8px', 
                borderRadius: '10px', 
                fontWeight: 'bold' 
              }}>
                {item.count}
              </span>
            )}
          </button>
        ))}
      </nav>
      
      <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(212, 163, 115, 0.03)', borderRadius: '16px', border: '1px solid rgba(212, 163, 115, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div className="live-indicator"></div>
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#80ff80' }}>SYSTEM LIVE</span>
        </div>
        <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>Real-time syncing enabled across all nodes.</p>
      </div>
    </aside>
  );
}
