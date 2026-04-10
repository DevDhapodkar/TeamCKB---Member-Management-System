import { History, Trash2, Search, X } from "lucide-react";
import { useState } from "react";

export default function ActivityHub({ logs, onDeleteLog }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredLogs = logs.filter(l => 
    l.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.activities?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: "32px" }}>
      <div className="mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Global Activity Logs</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginTop: '4px' }}>Complete historical audit of all member check-ins.</p>
        </div>
        
        <div style={{ position: "relative", minWidth: '300px' }} className="mobile-full">
          <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Search logs by member or activity..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "44px", fontSize: "0.9rem", height: "46px" }}
          />
          {searchTerm && <X size={16} onClick={() => setSearchTerm("")} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", opacity: 0.4 }} />}
        </div>
      </div>

      <div style={{ overflowX: "auto", borderRadius: '16px' }} className="custom-scrollbar">
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <th style={{ padding: "20px" }}>Timestamp</th>
              <th style={{ padding: "20px" }}>Member Identity</th>
              <th style={{ padding: "20px" }}>Duration</th>
              <th style={{ padding: "20px" }}>Activities & Notes</th>
              <th style={{ padding: "20px", textAlign: "right" }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: "60px", textAlign: "center", opacity: 0.4 }}>No logs found matching search.</td></tr>
            ) : filteredLogs.map(log => (
              <tr key={log.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }} className="hover-row">
                <td style={{ padding: "20px", fontSize: '0.9rem' }}>
                  <div style={{ fontWeight: '600' }}>{log.date}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{log.arrivalTime} - {log.timeout}</div>
                </td>
                <td style={{ padding: "20px" }}>
                  <div style={{ fontWeight: "600", fontSize: '0.95rem' }}>{log.userName}</div>
                </td>
                <td style={{ padding: "20px" }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '4px 12px', 
                    borderRadius: '8px', 
                    background: 'rgba(212, 163, 115, 0.1)', 
                    color: '#d4a373', 
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {log.totalHours}h
                  </div>
                </td>
                <td style={{ padding: "20px", maxWidth: '300px' }}>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7, lineHeight: '1.5' }}>
                    {log.activities.substring(0, 80)}{log.activities.length > 80 ? "..." : ""}
                  </div>
                </td>
                <td style={{ padding: "20px", textAlign: "right" }}>
                  <button 
                    onClick={() => onDeleteLog(log.id)} 
                    className="glass-button" 
                    style={{ padding: "8px", background: "rgba(255,100,100,0.05)", borderColor: "rgba(255,100,100,0.1)" }}
                  >
                    <Trash2 size={16} color="#ff8080" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
