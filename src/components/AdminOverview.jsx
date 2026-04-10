import { motion } from "framer-motion";
import { Users, UserPlus, Clock, Heart, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AdminOverview({ users, logs }) {
  // KPI Calculations
  const totalMembers = users.filter(u => u.approved !== false && u.role !== 'admin' && u.role !== 'company').length;
  const pendingApprovals = users.filter(u => u.approved === false).length;
  const totalHours = logs.reduce((acc, log) => acc + parseFloat(log.totalHours || 0), 0);
  
  // Chart Data: Member Breakdown
  const internsCount = users.filter(u => u.role === 'intern' && u.approved !== false).length;
  const volunteersCount = users.filter(u => u.role === 'volunteer' && u.approved !== false).length;
  const pieData = [
    { name: 'Interns', value: internsCount, color: '#d4a373' },
    { name: 'Volunteers', value: volunteersCount, color: '#a67c52' },
    { name: 'Others', value: totalMembers - internsCount - volunteersCount, color: '#3e2723' }
  ];

  // Chart Data: Activity (DYNAMIC Grouping for Last 6 Months)
  const getMonthlyData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const lastSixMonths = [];
    
    // Get last 6 month keys
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      lastSixMonths.push({
        monthIndex: d.getMonth(),
        year: d.getFullYear(),
        name: monthNames[d.getMonth()],
        logs: 0
      });
    }

    // Populate with real log data
    logs.forEach(log => {
      let logDate;
      if (log.createdAt?.toDate) {
        logDate = log.createdAt.toDate();
      } else if (typeof log.createdAt === 'string') {
        logDate = new Date(log.createdAt);
      } else {
        // Fallback to log.date string if createdAt is missing
        logDate = new Date(log.date);
      }

      const mIndex = logDate.getMonth();
      const yIndex = logDate.getFullYear();

      const monthBucket = lastSixMonths.find(m => m.monthIndex === mIndex && m.year === yIndex);
      if (monthBucket) {
        monthBucket.logs += 1;
      }
    });

    return lastSixMonths;
  };

  const monthlyData = getMonthlyData();

  const recentRegistrations = users.filter(u => u.approved === false).slice(0, 5);
  const liveActivity = logs.slice(0, 6);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* KPI Section */}
      <div className="dashboard-grid">
        <StatCard icon={Users} label="Total Members" value={totalMembers} trend="+12% this month" trendType="up" />
        <StatCard icon={UserPlus} label="Pending Approvals" value={pendingApprovals} trend="Needs attention" trendType="neutral" color="#ff8080" />
        <StatCard icon={Clock} label="Volunteer Hours" value={totalHours.toFixed(1)} trend="+40h this week" trendType="up" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px' }} className="mobile-stack">
        {/* Main Activity Chart */}
        <div className="chart-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Overall Log Activity</h3>
            <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Real-time updates</div>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1a0f0a', border: '1px solid rgba(212,163,115,0.2)', borderRadius: '12px' }}
                  itemStyle={{ color: '#d4a373' }}
                />
                <Bar dataKey="logs" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a373" />
                    <stop offset="100%" stopColor="#a67c52" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="chart-panel">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Member Breakdown</h3>
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalMembers}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>TOTAL</div>
            </div>
          </div>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pieData.map(item => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color }}></span>
                  {item.name}
                </span>
                <span style={{ fontWeight: 'bold' }}>{Math.round((item.value / (totalMembers || 1)) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="mobile-stack">
        {/* Recent Registrations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Recent Registrations</h3>
            <button className="glass-button" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentRegistrations.length === 0 ? (
              <p style={{ textAlign: 'center', opacity: 0.5, padding: '20px' }}>No pending signups.</p>
            ) : recentRegistrations.map(u => (
              <div key={u.uid} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--wood-accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{u.name}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>{u.role.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(212,163,115,0.1)', color: '#d4a373', borderRadius: '20px' }}>PENDING</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Live Activity Feed</h3>
            <div className="live-indicator"></div>
          </div>
          <div className="custom-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {liveActivity.map((log, idx) => (
              <div key={idx} className="activity-item">
                <div className="activity-icon" style={{ background: 'rgba(128,255,128,0.1)' }}>
                  <Activity size={16} color="#80ff80" />
                </div>
                <div>
                  <div style={{ fontWeight: '500' }}>{log.userName} checked in</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{log.activities.substring(0, 50)}...</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--wood-accent)', marginTop: '4px' }}>{log.date} • {log.totalHours}h</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, trendType, color }) {
  return (
    <motion.div className="stat-card" whileHover={{ y: -5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
          <Icon size={20} color={color || "#d4a373"} />
        </div>
      </div>
      <div className="stat-cardValue">{value}</div>
      <div className="stat-cardLabel">{label}</div>
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className={`stat-trend ${trendType}`}>
          {trendType === 'up' && <ArrowUpRight size={14} />}
          {trendType === 'down' && <ArrowDownRight size={14} />}
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
