import React, { useState, useEffect } from 'react';
import { Car, Truck, CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const Booking = ({ user }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // 1. ปรับ State: ตัด Name/Tel ออก เพิ่ม Note (สิ่งที่ต้องการเพิ่มเติม)
    const [formData, setFormData] = useState({
        carType: null,
        service: null,
        date: '',
        time: '',
        plate: '',
        note: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [bookingSummary, setBookingSummary] = useState(null); // เก็บข้อมูลไว้โชว์หน้าสรุป

    const updateData = (key, value) => setFormData({ ...formData, [key]: value });

    // Helpers สำหรับดึงชื่อมาโชว์
    const getCarLabel = (id) => CAR_TYPES.find(c => c.id === id)?.label || '-';
    const getServiceName = (id) => SERVICES.find(s => s.id === id)?.name || '-';


    const handleSubmitBooking = async () => {
        try {
            let token = localStorage.getItem('access_token');

            // 🔥 SUPER CLEANER: บังคับเอาเฉพาะตัวอักษรภาษาอังกฤษ, ตัวเลข, จุด(.), ขีด(-) และ Underscore(_) เท่านั้น
            // สิ่งแปลกปลอมอื่นๆ เช่น ช่องว่าง, ฟันหนู, หรือตัวอักษรล่องหน จะถูกดีดออกหมด
            if (token) {
                token = token.replace(/[^a-zA-Z0-9._-]/g, '');
            }

            // เช็กอีกที ถ้าไม่มี Token หรือ Token สั้นผิดปกติ ให้ดีดกลับ
            if (!token || token.length < 10) {
                alert('ไม่พบ Token หรือ Token ไม่สมบูรณ์ กรุณาล็อกอินใหม่');
                return;
            }

            // 🕵️‍♂️ Debug ดูสิ่งที่ส่งไปจริงๆ
            console.log("🚀 FINAL TOKEN being sent:", token);
            console.log("📦 HEADER:", `Bearer ${token}`);

            // 2. เตรียมข้อมูล (Payload)
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
                additionalInfo: formData.note // ส่ง note ไปด้วย
            };

            console.log('Sending Payload:', payload);

            // 3. ยิง API
            const response = await fetch('http://localhost:3000/carwash-category/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // ✅ ต้องมีเว้นวรรค 1 เคาะ ระหว่าง Bearer กับ Token
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);

                // บันทึกข้อมูลเพื่อโชว์หน้าสรุป
                setBookingSummary({
                    ...payload,
                    carLabel: getCarLabel(formData.carType),
                    serviceName: getServiceName(formData.service),
                    displayDate: formData.date,
                    displayTime: formData.time,
                    totalPrice: selectedService ? selectedService.price : 0
                });

                setIsSubmitted(true);
            } else {
                const errorData = await response.json();
                // ถ้า Backend ตอบกลับว่า 401 (Unauthorized) แปลว่า Token หมดอายุ หรือ ผิด
                if (response.status === 401) {
                    alert('Session หมดอายุ หรือ Token ไม่ถูกต้อง กรุณาล็อกอินใหม่');
                } else {
                    alert(`จองไม่สำเร็จ: ${errorData.message || 'Server Error'}`);
                }
                console.error('Server Error:', errorData);
            }

        } catch (error) {
            console.error('Connection Error:', error);
            alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ (Connection Refused)');
        }
    };

    return (
        <div className="container">
            {/* Header */}
            <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <Home size={24} color="#2563eb" />
                    </button>
                    <h1 style={{ margin: 0 }}>จองคิวล้างรถ</h1>
                </div>
                {user && <span style={{ color: '#666' }}>👤 {user}</span>}
            </div>

            {/* 4. หน้าสรุปรายการ (Summary) เมื่อจองสำเร็จ */}
            {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
                    <CheckCircle size={64} color="#16a34a" style={{ margin: '0 auto 20px' }} />
                    <h2 style={{ color: '#16a34a', marginBottom: '10px' }}>จองคิวสำเร็จ!</h2>
                    <p style={{ color: '#666', marginBottom: '20px' }}>ระบบได้รับข้อมูลการจองของคุณแล้ว</p>

                    {/* การ์ดสรุป */}
                    <div style={{
                        textAlign: 'left',
                        background: '#fff',
                        padding: '25px',
                        borderRadius: '16px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        border: '1px solid #e2e8f0'
                    }}>
                        <h3 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px', color: '#1e293b' }}>
                            📄 รายละเอียดการจอง
                        </h3>
                        <div style={{ display: 'grid', gap: '12px', fontSize: '0.95rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>ทะเบียนรถ:</span>
                                <span style={{ fontWeight: '600' }}>{bookingSummary?.plateNumber}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>ขนาดรถ:</span>
                                <span style={{ fontWeight: '600' }}>{bookingSummary?.carLabel}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>บริการ:</span>
                                <span style={{ fontWeight: '600' }}>{bookingSummary?.serviceName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>วัน-เวลา:</span>
                                <span style={{ fontWeight: '600' }}>{bookingSummary?.displayDate} | {bookingSummary?.displayTime} น.</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>เพิ่มเติม:</span>
                                <span style={{ fontWeight: '600', maxWidth: '200px', textAlign: 'right' }}>{bookingSummary?.additionalInfo || '-'}</span>
                            </div>
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', color: '#2563eb' }}>
                                <strong>ยอดรวมสุทธิ</strong>
                                <strong>{bookingSummary?.totalPrice} บาท</strong>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '30px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {/* ปุ่มนี้ถ้ายังไม่มีหน้า History ก็ให้กดแล้วกลับหน้าแรกไปก่อน */}
                        <button onClick={() => navigate('/history')} className="btn btn-outline">
                            ดูประวัติการจอง
                        </button>
                        <button onClick={() => window.location.reload()} className="btn btn-primary">
                            กลับหน้าหลัก
                        </button>
                    </div>
                </div>
            ) : (
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
                        {/* Step 1: Car Type */}
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

                        {/* Step 2: Service */}
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

                        {/* Step 3: Date & Time */}
                        {step === 3 && (
                            <div>
                                <h2 className="section-title"><Calendar /> วันและเวลา</h2>
                                <div className="form-group"><label>วันที่</label><input type="date" className="input-field" value={formData.date} onChange={(e) => updateData('date', e.target.value)} /></div>
                                <div className="time-grid">{TIME_SLOTS.map(t => <button key={t} onClick={() => updateData('time', t)} className={`time-btn ${formData.time === t ? 'selected' : ''}`}>{t}</button>)}</div>
                            </div>
                        )}

                        {/* Step 4: Info (แก้ใหม่ เหลือแค่ทะเบียนกับ Note) */}
                        {step === 4 && (
                            <div>
                                <h2 className="section-title"><MapPin /> ข้อมูลเพิ่มเติม</h2>
                                <div className="form-group">
                                    <label style={{ fontWeight: 'bold' }}>ทะเบียนรถ <span style={{ color: 'red' }}>*</span></label>
                                    <input
                                        placeholder="เช่น กก-1234"
                                        className="input-field"
                                        value={formData.plate}
                                        onChange={(e) => updateData('plate', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ fontWeight: 'bold' }}>สิ่งที่ต้องการเพิ่มเติม (ถ้ามี)</label>
                                    <textarea
                                        placeholder="เช่น ขอเน้นล้อแม็ก, ไม่ต้องลงแว็กซ์"
                                        className="input-field"
                                        rows="3"
                                        style={{ resize: 'none', padding: '10px', height: 'auto' }}
                                        value={formData.note}
                                        onChange={(e) => updateData('note', e.target.value)}
                                    />
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
                            <button onClick={handleSubmitBooking}
                                disabled={!formData.plate} // บังคับแค่ทะเบียนรถ
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