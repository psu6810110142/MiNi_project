import React, { useState } from 'react';
import { Car, Truck, CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar, Home } from 'lucide-react';

// --- Mock Data (ย้ายมาไว้ที่นี่) ---
const CAR_TYPES = [
  { id: 's', label: 'S/M', desc: 'รถเก๋งเล็ก-กลาง', icon: <Car size={32} /> },
  { id: 'l', label: 'L/SUV', desc: 'รถเก๋งใหญ่-SUV', icon: <Car size={40} /> },
  { id: 'xl', label: 'XL/Van', desc: 'รถตู้/กระบะ', icon: <Truck size={40} /> },
];

const SERVICES = [
  { id: 'std', name: 'Standard Wash', price: 180, desc: 'ล้างสี + ดูดฝุ่น' },
  { id: 'prem', name: 'Premium Wax', price: 350, desc: 'ล้างสี + เคลือบเงา' },
  { id: 'full', name: 'Full Detailing', price: 1200, desc: 'ซักเบาะ + ขัดสี' },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

const Booking = ({ navigate, user }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ carType: null, service: null, date: '', time: '', name: '', tel: '', plate: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = (key, value) => setFormData({ ...formData, [key]: value });
  
  const handleSubmitBooking = () => {
     // ตรงนี้เชื่อมต่อ API ภายหลัง
     setIsSubmitted(true);
  };

  return (
    <div className="container">
        {/* Header หน้าจอง */}
        <div className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                <button onClick={() => navigate('home')} style={{background:'none', border:'none', cursor:'pointer'}}>
                    <Home size={24} color="#2563eb"/>
                </button>
                <h1 style={{margin:0}}>จองคิวล้างรถ</h1>
            </div>
            {user && <span style={{color:'#666'}}>👤 {user}</span>}
        </div>

        {/* Booking Success State */}
        {isSubmitted ? (
            <div style={{textAlign: 'center', padding: '50px'}}>
                <CheckCircle size={64} color="#16a34a" style={{margin:'0 auto 20px'}}/>
                <h2>จองคิวสำเร็จ!</h2>
                <p>ขอบคุณคุณ {formData.name}</p>
                <button onClick={() => window.location.reload()} className="btn btn-primary" style={{margin:'20px auto'}}>
                    กลับสู่หน้าหลัก
                </button>
            </div>
        ) : (
            <>
                {/* Progress Bar */}
                <div className="progress-bar">
                    {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="step-item">
                        <div className={`step-circle ${step >= s ? 'active' : ''}`}>{s}</div>
                        {s < 4 && <div className={`step-line ${step > s ? 'filled' : ''}`} />}
                    </div>
                    ))}
                </div>

                {/* Booking Steps Content */}
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
                            <div className="form-group"><label>วันที่</label><input type="date" className="input-field" value={formData.date} onChange={(e)=>updateData('date', e.target.value)}/></div>
                            <div className="time-grid">{TIME_SLOTS.map(t => <button key={t} onClick={()=>updateData('time', t)} className={`time-btn ${formData.time===t?'selected':''}`}>{t}</button>)}</div>
                        </div>
                    )}

                    {step === 4 && (
                        <div>
                            <h2 className="section-title"><MapPin /> ข้อมูลติดต่อ</h2>
                            <div className="form-group"><input placeholder="ชื่อ" className="input-field" value={formData.name} onChange={(e)=>updateData('name', e.target.value)}/></div>
                            <div className="form-group"><input placeholder="เบอร์โทร" className="input-field" value={formData.tel} onChange={(e)=>updateData('tel', e.target.value)}/></div>
                            <div className="form-group"><input placeholder="ทะเบียนรถ" className="input-field" value={formData.plate} onChange={(e)=>updateData('plate', e.target.value)}/></div>
                        </div>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="footer">
                    <button onClick={() => setStep(p => Math.max(p-1, 1))} disabled={step===1} className="btn btn-outline">
                        <ChevronLeft size={20}/> ย้อนกลับ
                    </button>
                    {step < 4 ? 
                        <button onClick={() => setStep(p => Math.min(p+1, 4))} 
                            disabled={(step===1 && !formData.carType) || (step===2 && !formData.service) || (step===3 && (!formData.date || !formData.time))}
                            className="btn btn-primary" style={{marginLeft:'auto'}}>
                            ถัดไป <ChevronRight size={20}/>
                        </button> :
                        <button onClick={handleSubmitBooking} 
                            disabled={!formData.name}
                            className="btn btn-primary" style={{marginLeft:'auto', backgroundColor:'#16a34a'}}>
                            ยืนยันการจอง <CheckCircle size={20}/>
                        </button>
                    }
                </div>
            </>
        )}
    </div>
  );
};

export default Booking;