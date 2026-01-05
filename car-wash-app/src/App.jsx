import React, { useState } from 'react';
import { Car, Truck, CheckCircle, ChevronRight, ChevronLeft, MapPin, Calendar } from 'lucide-react';
import './App.css'; // <--- นำเข้าไฟล์ CSS ตรงนี้

// ... (Mock Data เดิม: CAR_TYPES, SERVICES, TIME_SLOTS เก็บไว้เหมือนเดิมได้เลยครับ)
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

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    carType: null, service: null, date: '', time: '', name: '', tel: '', plate: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const updateData = (key, value) => setFormData({ ...formData, [key]: value });

  const handleSubmit = () => setIsSubmitted(true);

  if (isSubmitted) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '50px' }}>
        <CheckCircle size={64} color="#16a34a" style={{ margin: '0 auto 20px' }} />
        <h2>จองคิวสำเร็จ!</h2>
        <p>ขอบคุณคุณ {formData.name}</p>
        <button onClick={() => window.location.reload()} className="btn btn-next" style={{ margin: '20px auto' }}>
          กลับสู่หน้าหลัก
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <h1>🚗 CleanWash Booking</h1>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="step-item">
            <div className={`step-circle ${step >= s ? 'active' : ''}`}>{s}</div>
            {s < 4 && <div className={`step-line ${step > s ? 'filled' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="content">
        
        {/* Step 1 */}
        {step === 1 && (
          <div>
            <h2 className="section-title"><Car /> เลือกขนาดรถ</h2>
            <div className="grid-cards">
              {CAR_TYPES.map((car) => (
                <div
                  key={car.id}
                  onClick={() => updateData('carType', car.id)}
                  className={`card-select ${formData.carType === car.id ? 'selected' : ''}`}
                >
                  {car.icon}
                  <strong>{car.label}</strong>
                  <small>{car.desc}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <h2 className="section-title"><CheckCircle /> เลือกบริการ</h2>
            <div>
              {SERVICES.map((srv) => (
                <div
                  key={srv.id}
                  onClick={() => updateData('service', srv.id)}
                  className={`service-item ${formData.service === srv.id ? 'selected' : ''}`}
                >
                  <div>
                    <strong>{srv.name}</strong>
                    <div style={{ fontSize: '0.9em', color: '#666' }}>{srv.desc}</div>
                  </div>
                  <div style={{ color: '#2563eb', fontWeight: 'bold' }}>{srv.price} ฿</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div>
            <h2 className="section-title"><Calendar /> วันและเวลา</h2>
            <div className="form-group">
              <label>วันที่</label>
              <input 
                type="date" 
                className="input-field"
                value={formData.date}
                onChange={(e) => updateData('date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>เวลา</label>
              <div className="time-grid">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => updateData('time', t)}
                    className={`time-btn ${formData.time === t ? 'selected' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div>
            <h2 className="section-title"><MapPin /> ข้อมูลติดต่อ</h2>
            <div className="form-group">
              <label>ชื่อ-สกุล</label>
              <input type="text" className="input-field" placeholder="ชื่อลูกค้า"
                value={formData.name} onChange={(e) => updateData('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>เบอร์โทร</label>
              <input type="tel" className="input-field" placeholder="08x-xxx-xxxx"
                value={formData.tel} onChange={(e) => updateData('tel', e.target.value)} />
            </div>
            <div className="form-group">
              <label>ทะเบียนรถ</label>
              <input type="text" className="input-field" placeholder="กข 1234"
                value={formData.plate} onChange={(e) => updateData('plate', e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="footer">
        <button onClick={prevStep} disabled={step === 1} className="btn btn-back">
          <ChevronLeft size={20} /> ย้อนกลับ
        </button>

        {step < 4 ? (
          <button 
            onClick={nextStep} 
            disabled={(step === 1 && !formData.carType) || (step === 2 && !formData.service) || (step === 3 && (!formData.date || !formData.time))}
            className="btn btn-next"
          >
            ถัดไป <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={!formData.name || !formData.tel || !formData.plate}
            className="btn btn-confirm"
          >
            ยืนยันการจอง <CheckCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;