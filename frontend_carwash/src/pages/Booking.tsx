// src/pages/Booking.tsx

import React, { useState, useEffect } from 'react';
import { Car, Truck, CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar, Home, User as UserIcon, Phone } from 'lucide-react';

// --- Interfaces & Types ---
interface BookingProps {
  onBack: () => void;
}

interface CarType {
  id: number;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface ServiceItem {
  id: number;
  name: string;
  price: number;
  desc: string;
}

interface CustomerProfile {
  fullName?: string;
  username?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface BookingSummary {
    customerName: string;
    customerTel: string;
    plateNumber: string;
    carLabel: string;
    serviceName: string;
    displayDate: string;
    displayTime: string;
    totalPrice: number;
    employeeName: string;
}

// --- Mock Data ---
const CAR_TYPES: CarType[] = [
  { id: 1, label: 'S/M', desc: 'รถเก๋งเล็ก-กลาง', icon: <Car size={32} /> },
  { id: 2, label: 'L/SUV', desc: 'รถเก๋งใหญ่-SUV', icon: <Car size={40} /> },
  { id: 3, label: 'XL/Van', desc: 'รถตู้/กระบะ', icon: <Truck size={40} /> },
];

const SERVICES: ServiceItem[] = [
  { id: 1, name: 'Standard Wash', price: 180, desc: 'ล้างสี + ดูดฝุ่น' },
  { id: 2, name: 'Premium Wax', price: 350, desc: 'ล้างสี + เคลือบเงา' },
  { id: 3, name: 'Full Detailing', price: 1200, desc: 'ซักเบาะ + ขัดสี' },
];

const TIME_SLOTS: string[] = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const Booking: React.FC<BookingProps> = ({ onBack }) => {
  
  const [step, setStep] = useState<number>(1);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [formData, setFormData] = useState({
    carType: '' as string | number, // เก็บเป็น ID (อาจจะเป็น string หรือ number ก็ได้ขึ้นอยู่กับ value ที่ส่งมา)
    service: '' as string | number,
    date: '',
    time: '',
    plate: '',
    note: ''
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(null);

  const API_BASE = 'http://localhost:3001';

  // Helper function ในการ update state
  const updateData = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));
  
  const getCarLabel = (id: string | number) => CAR_TYPES.find(c => c.id === Number(id))?.label || '-';
  const getServiceName = (id: string | number) => SERVICES.find(s => s.id === Number(id))?.name || '-';

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await fetch(`${API_BASE}/auth/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setCustomerProfile(data);
        }
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, []);

  const handleSubmitBooking = async () => {
    try {
      let token = localStorage.getItem('access_token') || localStorage.getItem('token');
      if (!token) { alert('กรุณาล็อกอินใหม่'); return; }

      const selectedService = SERVICES.find(s => s.id === Number(formData.service));
      const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // สมมติ 1 ชม.

      const payload = {
        carTypeId: Number(formData.carType),
        serviceId: Number(formData.service),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        totalPrice: selectedService ? selectedService.price : 0,
        plateNumber: formData.plate,
        additionalInfo: formData.note
      };

      const response = await fetch(`${API_BASE}/carwash/booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const savedData = await response.json();

        let assignedStaffName = 'กำลังจัดสรรเจ้าหน้าที่...';
        // เช็คเผื่อ backend ส่งกลับมาต่างกัน
        if (savedData.assignedStaff && savedData.assignedStaff.username) {
          assignedStaffName = `ช่าง ${savedData.assignedStaff.username}`;
        }

        setBookingSummary({
          // ข้อมูลสรุปที่จะแสดงผล
          customerName: customerProfile?.fullName || customerProfile?.username || 'ลูกค้า',
          customerTel: customerProfile?.phoneNumber || '-',
          plateNumber: formData.plate,
          carLabel: getCarLabel(formData.carType),
          serviceName: getServiceName(formData.service),
          displayDate: formData.date,
          displayTime: formData.time,
          totalPrice: selectedService ? selectedService.price : 0,
          employeeName: assignedStaffName
        });
        setIsSubmitted(true);
      } else {
        alert('จองไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) { 
      console.error(error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้'); 
    }
  };

  return (
    <div className="container">
      {/* Styles Injection */}
      <style>{`
        .container { max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Prompt', sans-serif; }
        .progress-bar { display: flex; justify-content: space-between; margin-bottom: 30px; position: relative; padding: 0 10px; }
        .step-item { display: flex; flex-direction: column; align-items: center; position: relative; flex: 1; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 2; transition: 0.3s; }
        .step-circle.active { background: #2563eb; color: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2); }
        .step-line { position: absolute; top: 16px; left: 50%; width: 100%; height: 2px; background: #e2e8f0; z-index: 1; transform: translateY(-50%); }
        .step-line.filled { background: #2563eb; }
        .step-item:last-child .step-line { display: none; }
        
        .section-title { font-size: 1.2rem; font-weight: 700; color: #1e293b; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .grid-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .card-select { background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 15px 10px; text-align: center; cursor: pointer; transition: 0.2s; display: flex; flex-direction: column; align-items: center; gap: 8px; color: #64748b; }
        .card-select:hover { border-color: #93c5fd; }
        .card-select.selected { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
        .card-select strong { display: block; font-size: 0.95rem; }
        .card-select small { font-size: 0.75rem; opacity: 0.8; }
        
        .service-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; border: 2px solid #e2e8f0; border-radius: 12px; margin-bottom: 10px; cursor: pointer; background: white; transition: 0.2s; }
        .service-item:hover { border-color: #93c5fd; }
        .service-item.selected { border-color: #2563eb; background: #eff6ff; }
        
        .form-group { margin-bottom: 20px; }
        .input-field { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; box-sizing: border-box; }
        .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
        .time-btn { padding: 10px; border: 1px solid #cbd5e1; background: white; border-radius: 8px; cursor: pointer; }
        .time-btn.selected { background: #2563eb; color: white; border-color: #2563eb; }
        
        .footer { display: flex; margin-top: 30px; padding-top: 20px; border-top: 1px solid #f1f5f9; }
        .btn { padding: 12px 24px; border-radius: 50px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; border: none; font-size: 0.95rem; }
        .btn-primary { background: #2563eb; color: white; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3); }
        .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; box-shadow: none; }
        .btn-outline { background: white; border: 1px solid #cbd5e1; color: #64748b; }
        .btn-outline:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#2563eb', padding: '15px', borderRadius: '12px', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <Home size={28} color="white" /> 
          </button>
          <h1 style={{ margin: 0, fontSize: '1.2rem' }}>จองคิวล้างรถ</h1>
        </div>
        {customerProfile && (
          <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            👤 {customerProfile.fullName || customerProfile.username}
          </span>
        )}
      </div>

      {/* Success Page */}
      {isSubmitted ? (
        <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <CheckCircle size={80} color="#16a34a" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ color: '#16a34a', marginBottom: '10px' }}>จองคิวสำเร็จ!</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>ระบบได้รับข้อมูลการจองของคุณแล้ว</p>

          <div style={{ textAlign: 'left', background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', color: '#1e293b' }}>📄 รายละเอียดการจอง</h3>
            <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>ผู้จอง:</span><span style={{ fontWeight: '600', color: '#2563eb' }}>{bookingSummary?.customerName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>เบอร์โทร:</span><span style={{ fontWeight: '600' }}>{bookingSummary?.customerTel}</span></div>
              
              <div style={{ height: '1px', background: '#f1f5f9', margin: '5px 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>พนักงานดูแล:</span>
                <span style={{ fontWeight: '600', color: '#0891b2' }}>{bookingSummary?.employeeName}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>ทะเบียนรถ:</span><span style={{ fontWeight: '600' }}>{bookingSummary?.plateNumber}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>ขนาดรถ:</span><span style={{ fontWeight: '600' }}>{bookingSummary?.carLabel}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>บริการ:</span><span style={{ fontWeight: '600' }}>{bookingSummary?.serviceName}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#64748b' }}>วัน-เวลา:</span><span style={{ fontWeight: '600' }}>{bookingSummary?.displayDate} | {bookingSummary?.displayTime} น.</span></div>
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#2563eb' }}><strong>ยอดรวมสุทธิ</strong><strong>{bookingSummary?.totalPrice} บาท</strong></div>
            </div>
          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={onBack} className="btn btn-primary" style={{ width: '100%' }}>
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      ) : (
        /* Form Steps */
        <>
          <div className="progress-bar">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="step-item">
                <div className={`step-circle ${step >= s ? 'active' : ''}`}>{s}</div>
                {s < 4 && <div className={`step-line ${step > s ? 'filled' : ''}`} />}
              </div>
            ))}
          </div>

          <div className="content">
            {step === 1 && (
              <div>
                <h2 className="section-title"><Car /> เลือกขนาดรถ</h2>
                <div className="grid-cards">
                  {CAR_TYPES.map((car) => (
                    <div key={car.id} onClick={() => updateData('carType', car.id)}
                      className={`card-select ${formData.carType === car.id ? 'selected' : ''}`}>
                      {car.icon} <strong>{car.label}</strong> <small>{car.desc}</small>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h2 className="section-title"><CheckCircle /> เลือกบริการ</h2>
                {SERVICES.map((srv) => (
                  <div key={srv.id} onClick={() => updateData('service', srv.id)}
                    className={`service-item ${formData.service === srv.id ? 'selected' : ''}`}>
                    <div><strong>{srv.name}</strong><div>{srv.desc}</div></div>
                    <div style={{ color: '#2563eb', fontWeight: 'bold' }}>{srv.price} ฿</div>
                  </div>
                ))}
              </div>
            )}
            {step === 3 && (
              <div>
                <h2 className="section-title"><Calendar /> วันและเวลา</h2>
                <div className="form-group"><label>วันที่</label><input type="date" className="input-field" value={formData.date} onChange={(e) => updateData('date', e.target.value)} /></div>
                <div className="time-grid">{TIME_SLOTS.map(t => <button key={t} onClick={() => updateData('time', t)} className={`time-btn ${formData.time === t ? 'selected' : ''}`}>{t}</button>)}</div>
              </div>
            )}
            {step === 4 && (
              <div>
                <h2 className="section-title"><MapPin /> ข้อมูลเพิ่มเติม</h2>
                {customerProfile && (
                  <div style={{ background: '#f1f5f9', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '5px', color: '#334155' }}>
                      <UserIcon size={18} /> <strong>ผู้จอง:</strong> {customerProfile.fullName || customerProfile.username}
                    </div>
                    <div style={{ display: 'flex', gap: '10px', color: '#334155' }}>
                      <Phone size={18} /> <strong>เบอร์โทร:</strong> {customerProfile.phoneNumber || '-'}
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>ทะเบียนรถ <span style={{ color: 'red' }}>*</span></label>
                  <input placeholder="เช่น กก-1234" className="input-field" value={formData.plate} onChange={(e) => updateData('plate', e.target.value)} />
                </div>
                <div className="form-group">
                  <label style={{ fontWeight: 'bold' }}>สิ่งที่ต้องการเพิ่มเติม (ถ้ามี)</label>
                  <textarea placeholder="เช่น ขอเน้นล้อแม็ก" className="input-field" rows={3} style={{ resize: 'none', padding: '10px', height: 'auto' }} value={formData.note} onChange={(e) => updateData('note', e.target.value)} />
                </div>
              </div>
            )}
          </div>

          <div className="footer">
            <button onClick={() => setStep(p => Math.max(p - 1, 1))} disabled={step === 1} className="btn btn-outline">
              <ChevronLeft size={20} /> ย้อนกลับ
            </button>
            {step < 4 ?
              <button onClick={() => setStep(p => Math.min(p + 1, 4))}
                disabled={(step === 1 && !formData.carType) || (step === 2 && !formData.service) || (step === 3 && (!formData.date || !formData.time))}
                className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                ถัดไป <ChevronRight size={20} />
              </button> :
              <button onClick={handleSubmitBooking} disabled={!formData.plate}
                className="btn btn-primary" style={{ marginLeft: 'auto', backgroundColor: '#16a34a' }}>
                ยืนยันการจอง <CheckCircle size={20} />
              </button>
            }
          </div>
        </>
      )}
    </div>
  );
};

export default Booking;