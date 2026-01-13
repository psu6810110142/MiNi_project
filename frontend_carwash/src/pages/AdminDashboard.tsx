// src/pages/AdminDashboard.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// --- 1. สร้าง Interfaces สำหรับกำหนด Type ของข้อมูล ---

interface AdminDashboardProps {
  onLogout: () => void;
}

interface User {
  id: number;
  username: string;
  role: 'ADMIN' | 'STAFF' | 'USER' | 'ALL'; // เพิ่ม ALL สำหรับ filter
  fullName?: string;
  phoneNumber?: string;
  status?: 'AVAILABLE' | 'BUSY'; // สำหรับ Staff
}

interface CarwashCategory {
    id: number;
    name: string;
    price: number;
}

interface Booking {
  id: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  plateNumber: string;
  totalPrice: number;
  customer?: User;
  assignedStaff?: User | null;
  carwashCategory?: CarwashCategory;
  
  // Field พิเศษสำหรับตอนแก้ไข (Optional)
  staffId?: number | string;
}

interface DecodedToken {
    username: string;
    role: string;
    [key: string]: any;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  // State Typing
  const [users, setUsers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Menu Typing
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'employees' | 'users' | 'bookings'>('dashboard');
  const [filterRole, setFilterRole] = useState<string>('ALL');

  // Editing States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<string>("");

  const API_BASE = 'http://localhost:3001'; 

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) { onLogout(); return; }
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUser(decoded.username);

        // เช็ค Role
        if (decoded.role !== 'ADMIN') {
          alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
          onLogout();
          return;
        }
        fetchData(token);
      } catch (error) {
        localStorage.removeItem('token');
        onLogout();
      }
    };
    checkAuth();
  }, [onLogout]);

  const fetchData = async (token: string) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Generic Type ให้ Axios รู้ว่ารับ User[] กลับมา
      const userRes = await axios.get<User[]>(`${API_BASE}/users`, config);
      setUsers(userRes.data);

      const bookingRes = await axios.get<Booking[]>(`${API_BASE}/carwash/bookings`, config);
      setBookings(bookingRes.data);

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

  // --- Functions: User Management ---
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบสมาชิกคนนี้?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter((user) => user.id !== userId));
      alert("ลบสมาชิกเรียบร้อยแล้ว");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  const startEdit = (user: User) => {
    setEditingUser({ ...user });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, [e.target.name]: e.target.value });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${API_BASE}/users/${editingUser.id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)));
      setEditingUser(null);
      alert("แก้ไขข้อมูลสมาชิกสำเร็จ!");
    } catch (err: any) {
      alert("เกิดข้อผิดพลาด: " + (err.response?.data?.message || err.message));
    }
  };

  // --- Functions: Booking Management ---

  const openBookingDetail = (booking: Booking) => {
    setEditingBooking({
        ...booking,
        // ดึง ID ช่างมาใส่ state (ถ้ามี)
        staffId: booking.assignedStaff ? booking.assignedStaff.id : '', 
    });
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingBooking) return;

      try {
          const token = localStorage.getItem('token');
          const payload = {
              status: editingBooking.status,
              staffId: editingBooking.staffId, 
              plateNumber: editingBooking.plateNumber
          };

          const res = await axios.patch(`${API_BASE}/carwash/bookings/${editingBooking.id}`, payload, {
              headers: { Authorization: `Bearer ${token}` }
          });

          setBookings(bookings.map(b => b.id === editingBooking.id ? res.data : b));
          
          setEditingBooking(null);
          alert("อัปเดตข้อมูลการจองเรียบร้อย!");
      } catch (err: any) {
          alert("เกิดข้อผิดพลาดในการบันทึก: " + (err.response?.data?.message || err.message));
      }
  };

  const handleDeleteBooking = async () => {
      if (!editingBooking) return;
      if (!window.confirm("⚠️ คุณแน่ใจหรือไม่ว่าจะลบรายการจองนี้? (ไม่สามารถกู้คืนได้)")) return;
      try {
          const token = localStorage.getItem('token');
          await axios.delete(`${API_BASE}/carwash/bookings/${editingBooking.id}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          setBookings(bookings.filter(b => b.id !== editingBooking.id));
          setEditingBooking(null);
          alert("ลบรายการจองสำเร็จ");
      } catch (err: any) {
          alert("ลบไม่สำเร็จ: " + (err.response?.data?.message || err.message));
      }
  };

  // --- Logic Helper ---
  const getActiveJobDetails = (staffId: number) => {
    const activeJob = bookings.find(b =>
      b.assignedStaff?.id === staffId &&
      (b.status === 'PENDING' || b.status === 'IN_PROGRESS')
    );
    return activeJob || null;
  };

  const filteredUsers = users.filter(user => {
    if (filterRole === 'ALL') return true;
    return user.role === filterRole;
  });

  const staffList = users.filter(u => u.role === 'STAFF');

  // --- STYLES (Typed as React.CSSProperties) ---
  const styles: { [key: string]: React.CSSProperties | ((arg: any) => React.CSSProperties) } = {
    container: { display: 'flex', height: '100vh', width: '100vw', fontFamily: "'Segoe UI', sans-serif", backgroundColor: '#f1f5f9', overflow: 'hidden' },
    sidebar: { width: '260px', backgroundColor: '#1e293b', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    sidebarHeader: { height: '70px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #334155', fontSize: '1.2rem', fontWeight: 'bold' },
    menuItem: (isActive: boolean) => ({ padding: '16px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', backgroundColor: isActive ? '#334155' : 'transparent', color: isActive ? '#fff' : '#94a3b8', borderLeft: isActive ? '4px solid #6366f1' : '4px solid transparent' }),
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    header: { height: '70px', backgroundColor: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 48px' },
    contentScrollable: { flex: 1, overflowY: 'auto', padding: '32px' },
    innerContainer: { maxWidth: '1200px', margin: '0 auto', width: '100%' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' },
    card: { backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', cursor: 'pointer' },
    empGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
    empCard: (isBusy: boolean) => ({
      backgroundColor: 'white', borderRadius: '12px', padding: '20px',
      borderLeft: isBusy ? '5px solid #ef4444' : '5px solid #22c55e',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)', position: 'relative'
    }),
    statusTag: (isBusy: boolean) => ({
      padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold',
      backgroundColor: isBusy ? '#fee2e2' : '#dcfce7', color: isBusy ? '#991b1b' : '#166534',
      float: 'right'
    }),
    jobInfo: { marginTop: '15px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#475569' },
    tableContainer: { backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' },
    tableHeaderContainer: { backgroundColor: '#f8fafc', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    tableTitle: { fontWeight: '600', color: '#475569', fontSize: '1rem' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '16px 24px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '600' },
    td: { padding: '16px 24px', borderBottom: '1px solid #f1f5f9', color: '#334155' },
    badge: (role: string) => {
      let bg = '#f0fdf4', color = '#15803d', border = '#bbf7d0';
      if (role === 'ADMIN') { bg = '#faf5ff'; color = '#6b21a8'; border = '#e9d5ff'; }
      else if (role === 'STAFF') { bg = '#eff6ff'; color = '#1d4ed8'; border = '#dbeafe'; }
      return { padding: '4px 12px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', backgroundColor: bg, color, border: `1px solid ${border}` };
    },
    logoutBtn: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
    filterSelect: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#475569', outline: 'none', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    formGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#475569', fontWeight: '600' },
    input: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem' },
    modalActions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
    saveBtn: { backgroundColor: '#6366f1', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' },
    cancelBtn: { backgroundColor: '#e2e8f0', color: '#475569', padding: '10px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600' },
    detailBtn: { backgroundColor: '#e0e7ff', color: '#4338ca', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;

  return (
    <div style={styles.container as React.CSSProperties}>
      <aside style={styles.sidebar as React.CSSProperties}>
        <div style={styles.sidebarHeader as React.CSSProperties}>🛠️ Admin Panel</div>
        <nav style={{ paddingTop: '20px' }}>
          <div style={(styles.menuItem as Function)(activeMenu === 'dashboard')} onClick={() => setActiveMenu('dashboard')}>📊 ภาพรวมระบบ</div>
          <div style={(styles.menuItem as Function)(activeMenu === 'employees')} onClick={() => setActiveMenu('employees')}>👨‍🔧 สถานะพนักงาน</div>
          <div style={(styles.menuItem as Function)(activeMenu === 'users')} onClick={() => setActiveMenu('users')}>👥 จัดการสมาชิก</div>
          <div style={(styles.menuItem as Function)(activeMenu === 'bookings')} onClick={() => setActiveMenu('bookings')}>📅 รายการจอง</div>
        </nav>
      </aside>

      <div style={styles.mainContent as React.CSSProperties}>
        <header style={styles.header as React.CSSProperties}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e293b' }}>
            {activeMenu === 'dashboard' ? 'Dashboard Overview' :
             activeMenu === 'employees' ? 'Employee Monitor' :
             activeMenu === 'users' ? 'User Management' : 'Booking Management'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#64748b' }}>Admin: <b>{currentUser}</b></span>
            <button onClick={handleLogout} style={styles.logoutBtn as React.CSSProperties}>ออกจากระบบ</button>
          </div>
        </header>

        <main style={styles.contentScrollable as React.CSSProperties}>
          <div style={styles.innerContainer as React.CSSProperties}>

            {/* Dashboard Stats */}
            {activeMenu === 'dashboard' && (
              <div style={styles.cardGrid as React.CSSProperties}>
                <div style={styles.card as React.CSSProperties} onClick={() => setActiveMenu('users')}><div style={{ fontSize: '2.5rem', marginRight: '20px' }}>👥</div><div><p style={{ color: '#64748b', fontSize: '0.9rem' }}>สมาชิกทั้งหมด</p><h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{users.length}</h3></div></div>
                <div style={styles.card as React.CSSProperties} onClick={() => setActiveMenu('employees')}><div style={{ fontSize: '2.5rem', marginRight: '20px' }}>👔</div><div><p style={{ color: '#64748b', fontSize: '0.9rem' }}>พนักงาน</p><h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{staffList.length}</h3></div></div>
                <div style={styles.card as React.CSSProperties} onClick={() => setActiveMenu('bookings')}><div style={{ fontSize: '2.5rem', marginRight: '20px' }}>📅</div><div><p style={{ color: '#64748b', fontSize: '0.9rem' }}>รายการจองทั้งหมด</p><h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{bookings.length}</h3></div></div>
              </div>
            )}

            {/* Employee Monitor */}
            {activeMenu === 'employees' && (
              <div>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ color: '#334155', margin: 0 }}>สถานะการทำงานของพนักงาน (Staff Status)</h3>
                  <div style={{ color: '#64748b' }}>จำนวนช่าง: {staffList.length} คน</div>
                </div>

                <div style={styles.empGrid as React.CSSProperties}>
                  {staffList.length > 0 ? staffList.map(staff => {
                    const isBusy = staff.status === 'BUSY';
                    const activeJob = isBusy ? getActiveJobDetails(staff.id) : null;

                    return (
                      <div key={staff.id} style={(styles.empCard as Function)(isBusy)}>
                        <span style={(styles.statusTag as Function)(isBusy)}>{isBusy ? '● กำลังทำงาน' : '● ว่าง'}</span>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '5px' }}>{staff.username}</div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>{staff.fullName || 'ไม่ระบุชื่อ'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px' }}>📞 {staff.phoneNumber || '-'}</div>

                        {isBusy && activeJob ? (
                          <div style={styles.jobInfo as React.CSSProperties}>
                            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🛠️ กำลังให้บริการ:</div>
                            <div>ลูกค้า: {activeJob.customer?.username || 'Guest'}</div>
                            <div>บริการ: {activeJob.carwashCategory?.name || '-'}</div>
                            <div style={{ fontSize: '0.8rem', marginTop: '5px', color: '#6366f1' }}>
                              เริ่มเวลา: {new Date(activeJob.startTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ) : isBusy ? (
                          <div style={styles.jobInfo as React.CSSProperties}>ไม่พบข้อมูลงานปัจจุบัน</div>
                        ) : (
                          <div style={{ marginTop: '20px', textAlign: 'center', color: '#cbd5e1', fontSize: '2rem' }}>☕</div>
                        )}
                      </div>
                    )
                  }) : (
                    <p style={{ color: '#64748b' }}>ไม่มีพนักงานในระบบ (Role: STAFF)</p>
                  )}
                </div>
              </div>
            )}

            {/* Users Table */}
            {(activeMenu === 'users' || activeMenu === 'dashboard') && (
              <div style={styles.tableContainer as React.CSSProperties}>
                <div style={styles.tableHeaderContainer as React.CSSProperties}>
                  <div style={styles.tableTitle as React.CSSProperties}>รายชื่อสมาชิกในระบบ</div>
                  <select style={styles.filterSelect as React.CSSProperties} value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                    <option value="ALL">ทั้งหมด (All Users)</option>
                    <option value="USER">ลูกค้า (Customer)</option>
                    <option value="STAFF">พนักงาน (Staff)</option>
                    <option value="ADMIN">แอดมิน (Admin)</option>
                  </select>
                </div>

                <table style={styles.table as React.CSSProperties}>
                  <thead>
                    <tr>
                      <th style={styles.th as React.CSSProperties}>ID</th>
                      <th style={styles.th as React.CSSProperties}>Username</th>
                      <th style={styles.th as React.CSSProperties}>ชื่อ-สกุล</th>
                      <th style={styles.th as React.CSSProperties}>เบอร์โทร</th>
                      <th style={styles.th as React.CSSProperties}>สถานะ</th>
                      <th style={styles.th as React.CSSProperties}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={styles.td as React.CSSProperties}>#{user.id}</td>
                        <td style={{ ...(styles.td as React.CSSProperties), fontWeight: 'bold' }}>{user.username}</td>
                        <td style={styles.td as React.CSSProperties}>{user.fullName || '-'}</td>
                        <td style={styles.td as React.CSSProperties}>{user.phoneNumber || '-'}</td>
                        <td style={styles.td as React.CSSProperties}><span style={(styles.badge as Function)(user.role)}>{user.role}</span></td>
                        <td style={styles.td as React.CSSProperties}>
                          <button onClick={() => startEdit(user)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem', marginRight: '10px' }} title="แก้ไข">✏️</button>
                          <button onClick={() => handleDeleteUser(user.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }} title="ลบ">🗑️</button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && <tr><td colSpan={6} style={{ ...(styles.td as React.CSSProperties), textAlign: 'center' }}>ไม่พบข้อมูล</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bookings Table */}
            {activeMenu === 'bookings' && (
              <div style={styles.tableContainer as React.CSSProperties}>
                <div style={styles.tableHeaderContainer as React.CSSProperties}>
                  <div style={styles.tableTitle as React.CSSProperties}>รายการจองคิวทั้งหมด</div>
                </div>
                <table style={styles.table as React.CSSProperties}>
                  <thead>
                    <tr><th style={styles.th as React.CSSProperties}>ID</th><th style={styles.th as React.CSSProperties}>ลูกค้า</th><th style={styles.th as React.CSSProperties}>บริการ</th><th style={styles.th as React.CSSProperties}>ช่างผู้รับงาน</th><th style={styles.th as React.CSSProperties}>เวลานัดหมาย</th><th style={styles.th as React.CSSProperties}>สถานะ</th><th style={styles.th as React.CSSProperties}>จัดการ</th></tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={styles.td as React.CSSProperties}>#{booking.id}</td>
                        <td style={styles.td as React.CSSProperties}>{booking.customer ? booking.customer.username : 'Unknown'}</td>
                        <td style={styles.td as React.CSSProperties}>{booking.carwashCategory ? booking.carwashCategory.name : '-'}</td>
                        <td style={{ ...(styles.td as React.CSSProperties), color: booking.assignedStaff ? '#2563eb' : '#94a3b8' }}>
                          {booking.assignedStaff ? booking.assignedStaff.username : 'รอจัดสรร'}
                        </td>
                        <td style={styles.td as React.CSSProperties}>{new Date(booking.startTime).toLocaleString('th-TH')}</td>
                        <td style={styles.td as React.CSSProperties}>
                            <span style={{padding:'4px 8px', borderRadius:'10px', background: booking.status==='COMPLETED'?'#dcfce7':'#fff7ed', color: booking.status==='COMPLETED'?'#166534':'#c2410c', fontSize:'0.8rem', fontWeight:'bold'}}>
                                {booking.status}
                            </span>
                        </td>
                        <td style={styles.td as React.CSSProperties}>
                            <button onClick={() => openBookingDetail(booking)} style={styles.detailBtn as React.CSSProperties}>
                                📝 รายละเอียด
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ✏️ MODAL แก้ไข USER */}
      {editingUser && (
        <div style={styles.modalOverlay as React.CSSProperties}>
          <div style={styles.modalContent as React.CSSProperties}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>✏️ แก้ไขข้อมูลสมาชิก</h3>
            <form onSubmit={handleSaveUser}>
              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>Username</label>
                <input style={{ ...(styles.input as React.CSSProperties), backgroundColor: '#f1f5f9' }} name="username" value={editingUser.username} disabled />
              </div>
              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>ชื่อ-สกุล</label>
                <input style={styles.input as React.CSSProperties} name="fullName" value={editingUser.fullName || ''} onChange={handleEditChange} />
              </div>
              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>เบอร์โทรศัพท์</label>
                <input style={styles.input as React.CSSProperties} name="phoneNumber" value={editingUser.phoneNumber || ''} onChange={handleEditChange} />
              </div>
              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>สถานะ (Role)</label>
                <select style={styles.input as React.CSSProperties} name="role" value={editingUser.role} onChange={handleEditChange}>
                  <option value="USER">USER (ลูกค้า)</option>
                  <option value="STAFF">STAFF (พนักงาน)</option>
                  <option value="ADMIN">ADMIN (แอดมิน)</option>
                </select>
              </div>
              <div style={styles.modalActions as React.CSSProperties}>
                <button type="button" onClick={() => setEditingUser(null)} style={styles.cancelBtn as React.CSSProperties}>ยกเลิก</button>
                <button type="submit" style={styles.saveBtn as React.CSSProperties}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 📝 MODAL จัดการ BOOKING */}
      {editingBooking && (
        <div style={styles.modalOverlay as React.CSSProperties}>
          <div style={styles.modalContent as React.CSSProperties}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                <h3 style={{margin:0}}>📝 จัดการรายการจอง #{editingBooking.id}</h3>
                <button onClick={() => setEditingBooking(null)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button>
            </div>
            
            <form onSubmit={handleSaveBooking}>
              {/* Read Only Info */}
              <div style={{background:'#f8fafc', padding:'15px', borderRadius:'8px', marginBottom:'20px', fontSize:'0.9rem'}}>
                  <div><strong>ลูกค้า:</strong> {editingBooking.customer?.fullName || editingBooking.customer?.username}</div>
                  <div><strong>เบอร์โทร:</strong> {editingBooking.customer?.phoneNumber || '-'}</div>
                  <div><strong>บริการ:</strong> {editingBooking.carwashCategory?.name}</div>
                  <div><strong>เวลาจอง:</strong> {new Date(editingBooking.startTime).toLocaleString('th-TH')}</div>
                  <div><strong>ราคา:</strong> {editingBooking.totalPrice} บาท</div>
              </div>

              {/* Editable Fields */}
              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>ทะเบียนรถ</label>
                <input 
                    style={styles.input as React.CSSProperties} 
                    value={editingBooking.plateNumber || ''} 
                    onChange={(e) => setEditingBooking({...editingBooking, plateNumber: e.target.value})}
                />
              </div>

              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>สถานะงาน (Status)</label>
                <select 
                    style={styles.input as React.CSSProperties} 
                    value={editingBooking.status} 
                    onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value as any})}
                >
                    <option value="PENDING">PENDING (รอดำเนินการ)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (กำลังล้าง)</option>
                    <option value="COMPLETED">COMPLETED (เสร็จสิ้น)</option>
                    <option value="CANCELLED">CANCELLED (ยกเลิก)</option>
                </select>
              </div>

              <div style={styles.formGroup as React.CSSProperties}>
                <label style={styles.label as React.CSSProperties}>ช่างผู้รับผิดชอบ (Assigned Staff)</label>
                <select 
                    style={styles.input as React.CSSProperties} 
                    value={editingBooking.staffId || ''} 
                    onChange={(e) => setEditingBooking({...editingBooking, staffId: e.target.value})}
                >
                    <option value="">-- ยังไม่ระบุช่าง --</option>
                    {staffList.map(staff => (
                        <option key={staff.id} value={staff.id}>
                            {staff.username} ({staff.status})
                        </option>
                    ))}
                </select>
                <small style={{color:'#64748b', fontSize:'0.8rem'}}>* เลือกเพื่อเปลี่ยนคนรับงาน</small>
              </div>

              <div style={{display:'flex', justifyContent:'space-between', marginTop:'30px'}}>
                 <button type="button" onClick={handleDeleteBooking} style={{...(styles.cancelBtn as React.CSSProperties), background:'#fee2e2', color:'#dc2626'}}>
                    🗑️ ลบรายการนี้
                 </button>
                 <div style={{display:'flex', gap:'10px'}}>
                    <button type="button" onClick={() => setEditingBooking(null)} style={styles.cancelBtn as React.CSSProperties}>ยกเลิก</button>
                    <button type="submit" style={styles.saveBtn as React.CSSProperties}>บันทึกการแก้ไข</button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;