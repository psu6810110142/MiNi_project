import React, { useState, useEffect } from 'react';
import { Car, Truck, CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar, Home, User as UserIcon, Phone } from 'lucide-react';

// --- Mock Data ---
const CAR_TYPES = [
    { id: 1, label: 'S/M', desc: 'รถเก๋งเล็ก-กลาง', icon: <Car size={32} /> },
    { id: 2, label: 'L/SUV', desc: 'รถเก๋งใหญ่-SUV', icon: <Car size={40} /> },
    { id: 3, label: 'XL/Van', desc: 'รถตู้/กระบะ', icon: <Truck size={40} /> },
];

const SERVICES = [
    { id: 1, name: 'Standard Wash', price: 180, desc: 'ล้างสี + ดูดฝุ่น' },
    { id: 2, name: 'Premium Wax', price: 350, desc: 'ล้างสี + เคลือบเงา' },
    { id: 3, name: 'Full Detailing', price: 1200, desc: 'ซักเบาะ + ขัดสี' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const Booking = ({ onBack }) => {
    
    const [step, setStep] = useState(1);
    const [customerProfile, setCustomerProfile] = useState(null);
    const [formData, setFormData] = useState({
        carType: '', service: '', date: '', time: '', plate: '', note: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [bookingSummary, setBookingSummary] = useState(null);

    // ✅ ตรวจสอบ Port ให้ตรง (3000 หรือ 3001)
    const API_BASE = 'http://localhost:3001';

    const updateData = (key, value) => setFormData({ ...formData, [key]: value });
    const getCarLabel = (id) => CAR_TYPES.find(c => c.id === id)?.label || '-';
    const getServiceName = (id) => SERVICES.find(s => s.id === id)?.name || '-';

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('access_token') || localStorage.getItem('token');
            if (!token) return;
            try {
                const response = await fetch(`${API_BASE}/auth/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setCustomerProfile(await response.json());
                }
            } catch (err) { console.error(err); }
        };
        fetchProfile();
    }, []);

    const handleSubmitBooking = async () => {
        try {
            let token = localStorage.getItem('access_token') || localStorage.getItem('token');
            if (!token) { alert('กรุณาล็อกอินใหม่'); return; }

            const selectedService = SERVICES.find(s => s.id === formData.service);
            const startDateTime = new Date(`${formData.date}T${formData.time}:00`);
            const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

            const payload = {
                carTypeId: formData.carType,
                serviceId: formData.service,
                startTime: startDateTime.toISOString(),
                endTime: endDateTime.toISOString(),
                totalPrice: selectedService ? selectedService.price : 0,
                plateNumber: formData.plate,
                additionalInfo: formData.note
            };

            // ✅ 1. แก้ไข URL ให้ถูกต้อง (/carwash/booking)
            const response = await fetch(`${API_BASE}/carwash/booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedData = await response.json();

                // ✅ 2. ดึงชื่อช่างอย่างถูกต้อง (จาก assignedStaff)
                let assignedStaffName = 'กำลังจัดสรรเจ้าหน้าที่...';
                if (savedData.assignedStaff && savedData.assignedStaff.username) {
                    assignedStaffName = `ช่าง ${savedData.assignedStaff.username}`;
                }

                setBookingSummary({
                    ...payload,
                    carLabel: getCarLabel(formData.carType),
                    serviceName: getServiceName(formData.service),
                    displayDate: formData.date,
                    displayTime: formData.time,
                    totalPrice: selectedService ? selectedService.price : 0,
                    customerName: customerProfile?.fullName || customerProfile?.username,
                    customerTel: customerProfile?.phoneNumber || '-',
                    
                    // แสดงชื่อช่าง
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
                            
                            {/* แสดงชื่อพนักงาน */}
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
                /* Form Steps - คงเดิม */
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
                                    <textarea placeholder="เช่น ขอเน้นล้อแม็ก" className="input-field" rows="3" style={{ resize: 'none', padding: '10px', height: 'auto' }} value={formData.note} onChange={(e) => updateData('note', e.target.value)} />
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