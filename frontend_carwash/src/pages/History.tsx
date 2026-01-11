import React, { useEffect, useState } from 'react';
import { 
  FileText
} from 'lucide-react';

// --- Interface ---
interface BookingItem {
  id: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  plateNumber: string;
  additionalInfo: string;
  carType: number;
  service?: { name: string; };
  customer?: { fullName: string; username: string; phoneNumber: string; };
  carwashCategory?: { id: number; name: string; };
  
  // ✅ เพิ่ม field นี้เพื่อให้รองรับชื่อช่าง
  assignedStaff?: { id: number; username: string; fullName: string; }; 
}

const History: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [historyData, setHistoryData] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token');
        if (!token) {
          setError('ไม่พบ Token');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/carwash/my-bookings', { 
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ');
        setHistoryData(await response.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
  const getCarLabel = (typeId: number) => (typeId === 1 ? 'S/M (รถเก๋ง)' : typeId === 2 ? 'L/SUV (รถใหญ่)' : typeId === 3 ? 'XL/Van (รถตู้)' : 'ไม่ระบุ');

  // --- Styles ---
  const styles = {
    page: { backgroundColor: 'white', minHeight: '100vh', padding: '10px 0', fontFamily: "'Prompt', sans-serif" },
    container: { maxWidth: '500px', margin: '0 auto' }, 

    headerBar: {
        display: 'flex', alignItems: 'center', gap: '15px',
        backgroundColor: '#2563eb', color: 'white',
        padding: '15px 20px', borderRadius: '12px', marginBottom: '30px',
        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
    },
    headerTitle: { fontSize: '1.25rem', fontWeight: 'bold', margin: 0 },

    card: { 
        backgroundColor: 'white', borderRadius: '16px', padding: '25px', marginBottom: '25px', 
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', position: 'relative' as 'relative' 
    },
    
    statusBadge: (status: string) => {
      const base = { position: 'absolute' as 'absolute', top: '20px', right: '20px', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' as 'uppercase' };
      if (status === 'COMPLETED') return { ...base, backgroundColor: '#dcfce7', color: '#15803d' };
      if (status === 'CANCELLED') return { ...base, backgroundColor: '#fee2e2', color: '#b91c1c' };
      if (status === 'IN_PROGRESS') return { ...base, backgroundColor: '#dbeafe', color: '#1d4ed8' }; // เพิ่มสีฟ้าสำหรับกำลังทำ
      return { ...base, backgroundColor: '#fef9c3', color: '#a16207' };
    },

    cardTitle: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f8fafc' },
    
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', fontSize: '0.95rem' },
    label: { color: '#94a3b8', fontWeight: 500, minWidth: '90px' }, 
    value: { color: '#334155', fontWeight: 600, textAlign: 'right' as 'right', flex: 1 }, 
    
    divider: { borderTop: '2px dashed #e2e8f0', margin: '20px 0 15px 0' },
    totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#2563eb', fontSize: '1.2rem', fontWeight: 'bold' },
    centerBox: { textAlign: 'center' as 'center', padding: '50px', color: '#cbd5e1' }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        
        <div style={styles.headerBar}>
            {/* ปุ่มย้อนกลับ */}
            <button onClick={onBack} style={{background:'none', border:'none', color:'white', fontSize:'1.5rem', cursor:'pointer', marginRight:'10px'}}>
                ←
            </button>
            <h1 style={styles.headerTitle}>ประวัติการจอง</h1>
        </div>

        {loading && <div style={styles.centerBox}>กำลังโหลดข้อมูล...</div>}
        {error && <div style={{...styles.centerBox, color: '#ef4444'}}>{error}</div>}
        
        {!loading && !error && historyData.length === 0 && (
          <div style={styles.centerBox}>
            <div style={{fontSize: '3rem', marginBottom: '10px'}}>📭</div>
            <div>ยังไม่มีประวัติการจอง</div>
          </div>
        )}

        <div>
          {historyData.map((item) => (
            <div key={item.id} style={styles.card}>
              <span style={styles.statusBadge(item.status)}>{item.status}</span>
              <div style={styles.cardTitle}>
                 <FileText size={20} color="#64748b"/> รายละเอียด
              </div>
              
              <div style={styles.row}>
                 <span style={styles.label}>ผู้จอง:</span>
                 <span style={styles.value}>{item.customer?.fullName || item.customer?.username || '-'}</span>
              </div>
              <div style={styles.row}>
                 <span style={styles.label}>เบอร์โทร:</span>
                 <span style={styles.value}>{item.customer?.phoneNumber || '-'}</span>
              </div>

              {/* ✅ เพิ่มส่วนแสดงชื่อช่างที่นี่ */}
              <div style={styles.row}>
                 <span style={styles.label}>พนักงานดูแล:</span>
                 <span style={{...styles.value, color: item.assignedStaff ? '#0891b2' : '#94a3b8'}}>
                    {item.assignedStaff ? `ช่าง ${item.assignedStaff.username}` : 'กำลังจัดสรร...'}
                 </span>
              </div>

              <div style={{height: '10px'}}></div>

              <div style={styles.row}>
                 <span style={styles.label}>ทะเบียนรถ:</span>
                 <span style={styles.value}>{item.plateNumber || 'ไม่ระบุ'}</span>
              </div>
              <div style={styles.row}>
                 <span style={styles.label}>ขนาดรถ:</span>
                 <span style={styles.value}>{getCarLabel(item.carwashCategory?.id || 0)}</span>
              </div>
              <div style={styles.row}>
                 <span style={styles.label}>บริการ:</span>
                 <span style={styles.value}>{item.service?.name || 'Standard Wash'}</span>
              </div>
              <div style={styles.row}>
                 <span style={styles.label}>วัน-เวลา:</span>
                 <span style={styles.value}>
                    {formatDate(item.startTime)} <br/> 
                    <span style={{fontSize:'0.9em', color:'#64748b'}}>
                        {new Date(item.startTime).toLocaleTimeString('th-TH', {hour:'2-digit', minute:'2-digit'})} น.
                    </span>
                 </span>
              </div>

              {item.additionalInfo && (
                <div style={styles.row}>
                    <span style={styles.label}>เพิ่มเติม:</span>
                    <span style={{...styles.value, color: '#d97706', fontStyle: 'italic'}}>"{item.additionalInfo}"</span>
                </div>
              )}

              <div style={styles.divider}></div>

              <div style={styles.totalRow}>
                 <span>ยอดรวมสุทธิ</span>
                 <span>{item.totalPrice.toLocaleString()} บาท</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default History;