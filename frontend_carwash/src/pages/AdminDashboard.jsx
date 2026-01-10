import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AdminDashboard = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded.username);
        if (decoded.role !== 'ADMIN') {
          alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
          navigate('/');
          return;
        }
        fetchData(token);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const userRes = await axios.get('http://localhost:3000/admin/users', config);
      setUsers(userRes.data);
      // const bookingRes = await axios.get('http://localhost:3000/admin/bookings', config);
      // setBookings(bookingRes.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  // --- STYLES (ปรับปรุงใหม่) ---
  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      width: '100vw',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    },
    sidebar: {
      width: '260px',
      backgroundColor: '#1e293b',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    },
    sidebarHeader: {
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      borderBottom: '1px solid #334155',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      letterSpacing: '1px'
    },
    menuItem: (isActive) => ({
      padding: '16px 24px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: isActive ? '#334155' : 'transparent',
      color: isActive ? '#fff' : '#94a3b8',
      transition: 'all 0.3s',
      borderLeft: isActive ? '4px solid #6366f1' : '4px solid transparent',
      textDecoration: 'none',
      fontSize: '0.95rem'
    }),
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      height: '70px',
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 48px', // [แก้จุดที่ 1] เพิ่ม Padding ด้านข้างให้ปุ่มไม่ชิดขอบ
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    contentScrollable: {
      flex: 1,
      overflowY: 'auto',
      padding: '32px'
    },
    // [เพิ่มใหม่] Container สำหรับคุมความกว้างเนื้อหา
    innerContainer: {
        maxWidth: '1200px', // จำกัดความกว้างสูงสุด
        margin: '0 auto',   // จัดกึ่งกลาง
        width: '100%'
    },
    cardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '24px',
      marginBottom: '32px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      overflow: 'hidden'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      padding: '16px 24px',
      borderBottom: '1px solid #e2e8f0',
      fontWeight: '600',
      color: '#475569'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left'
    },
    th: {
      padding: '16px 24px',
      borderBottom: '1px solid #e2e8f0',
      color: '#64748b',
      fontSize: '0.85rem',
      textTransform: 'uppercase',
      fontWeight: '600'
    },
    td: {
      padding: '16px 24px',
      borderBottom: '1px solid #f1f5f9',
      color: '#334155'
    },
    badge: (role) => ({
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      backgroundColor: role === 'ADMIN' ? '#faf5ff' : '#f0fdf4',
      color: role === 'ADMIN' ? '#6b21a8' : '#15803d',
      border: role === 'ADMIN' ? '1px solid #e9d5ff' : '1px solid #bbf7d0'
    }),
    logoutBtn: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
      padding: '8px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      whiteSpace: 'nowrap' // ห้ามตัดบรรทัด
    }
  };

  if (loading) return <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh'}}>Loading...</div>;

  return (
    <div style={styles.container}>
      
      {/* 1. SIDEBAR (ซ้าย) */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          🛠️ Admin Panel
        </div>
        <nav style={{paddingTop: '20px'}}>
          <div style={styles.menuItem(activeMenu === 'dashboard')} onClick={() => setActiveMenu('dashboard')}>
            📊 ภาพรวมระบบ
          </div>
          <div style={styles.menuItem(activeMenu === 'users')} onClick={() => setActiveMenu('users')}>
            👥 จัดการสมาชิก
          </div>
          <div style={styles.menuItem(activeMenu === 'bookings')} onClick={() => setActiveMenu('bookings')}>
            📅 รายการจอง
          </div>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT (ขวา) */}
      <div style={styles.mainContent}>
        
        {/* Header บนสุด */}
        <header style={styles.header}>
          <h2 style={{fontSize:'1.25rem', fontWeight:'bold', color:'#1e293b'}}>
            {activeMenu === 'dashboard' ? 'Dashboard Overview' : ''}
            {activeMenu === 'users' ? 'User Management' : ''}
            {activeMenu === 'bookings' ? 'Booking Management' : ''}
          </h2>
          <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontWeight:'bold', fontSize:'0.9rem'}}>{currentUser}</div>
              <div style={{fontSize:'0.75rem', color:'#6366f1'}}>ADMINISTRATOR</div>
            </div>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              ออกจากระบบ
            </button>
          </div>
        </header>

        {/* เนื้อหาด้านใน (Scroll ได้) */}
        <main style={styles.contentScrollable}>
          
          {/* [แก้จุดที่ 2] ครอบด้วย Inner Container เพื่อคุมความกว้าง */}
          <div style={styles.innerContainer}>

              {/* Cards */}
              <div style={styles.cardGrid}>
                <div style={styles.card}>
                  <div style={{fontSize:'2.5rem', marginRight:'20px'}}>👥</div>
                  <div>
                    <p style={{color:'#64748b', fontSize:'0.9rem'}}>สมาชิกทั้งหมด</p>
                    <h3 style={{fontSize:'1.8rem', fontWeight:'bold', margin:0}}>{users.length}</h3>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={{fontSize:'2.5rem', marginRight:'20px'}}>📅</div>
                  <div>
                    <p style={{color:'#64748b', fontSize:'0.9rem'}}>รายการจองทั้งหมด</p>
                    <h3 style={{fontSize:'1.8rem', fontWeight:'bold', margin:0}}>{bookings.length}</h3>
                  </div>
                </div>
                <div style={styles.card}>
                  <div style={{fontSize:'2.5rem', marginRight:'20px'}}>💰</div>
                  <div>
                    <p style={{color:'#64748b', fontSize:'0.9rem'}}>รายได้วันนี้</p>
                    <h3 style={{fontSize:'1.8rem', fontWeight:'bold', margin:0}}>฿9999999</h3>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={styles.tableContainer}>
                <div style={styles.tableHeader}>รายชื่อสมาชิกในระบบ</div>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Username</th>
                      <th style={styles.th}>ชื่อ-สกุล</th>
                      <th style={styles.th}>เบอร์โทร</th>
                      <th style={styles.th}>สถานะ</th>
                      <th style={styles.th}>วันที่สมัคร</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                        <td style={styles.td}>#{user.id}</td>
                        <td style={{...styles.td, fontWeight:'bold'}}>{user.username}</td>
                        <td style={styles.td}>{user.fullName || '-'}</td>
                        <td style={styles.td}>{user.phone_number || '-'}</td>
                        <td style={styles.td}>
                          <span style={styles.badge(user.role)}>{user.role}</span>
                        </td>
                        <td style={styles.td}>
                           {user.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <div style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>ไม่พบข้อมูล</div>}
              </div>

          </div> {/* จบ Inner Container */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;