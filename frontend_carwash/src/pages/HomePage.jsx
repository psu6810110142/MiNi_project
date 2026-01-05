import React from 'react';
import { Sparkles, ChevronRight, Clock, ShieldCheck, Star, Zap } from 'lucide-react';

const HomePage = ({ navigate }) => (
  <div className="home-wrapper">
    {/* --- ส่วนของ CSS (ใส่ไว้ตรงนี้เลย ไม่ต้องสร้างไฟล์แยก) --- */}
    <style>{`
      .home-wrapper { padding-bottom: 40px; font-family: 'Prompt', sans-serif; }
      
      /* Navbar */
      .home-navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; background: white; position: sticky; top: 0; z-index: 50; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
      .home-brand { display: flex; align-items: center; gap: 10px; }
      .brand-icon-bg { width: 32px; height: 32px; background: linear-gradient(135deg, #2563eb, #1d4ed8); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
      .brand-text { font-size: 1.2rem; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
      .nav-actions { display: flex; align-items: center; gap: 8px; }
      .btn-text-sm { background: none; border: none; font-size: 0.9rem; font-weight: 600; color: #64748b; cursor: pointer; }
      .btn-primary-sm { background-color: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
      .btn-primary-sm:hover { background-color: #1d4ed8; }

      /* Hero Card */
      .hero-card { margin: 10px 20px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); border-radius: 24px; padding: 40px 25px; color: white; text-align: center; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4); position: relative; overflow: hidden; }
      .hero-card::before { content: ''; position: absolute; top: -50%; right: -50%; width: 200%; height: 200%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%); pointer-events: none; }
      .hero-badge { display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; margin-bottom: 15px; backdrop-filter: blur(4px); }
      .hero-content h1 { font-size: 1.8rem; margin: 0 0 10px; line-height: 1.3; font-weight: 800; }
      .hero-content p { font-size: 0.95rem; opacity: 0.9; margin: 0 0 25px; font-weight: 300; }
      
      /* ปุ่มจอง */
      .btn-hero-action { width: 100%; background: white; color: #2563eb; border: none; padding: 14px; border-radius: 16px; font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; transition: transform 0.2s; }
      .btn-hero-action:hover { transform: scale(1.02); }

      /* Stats */
      .stats-container { display: flex; justify-content: space-around; align-items: center; margin: 20px 20px; padding: 15px; background: white; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
      .stat-box { text-align: center; }
      .stat-number { display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 1.1rem; font-weight: 800; color: #0f172a; }
      .stat-label { font-size: 0.75rem; color: #64748b; margin-top: 2px; }
      .stat-divider { width: 1px; height: 30px; background-color: #e2e8f0; }

      /* Features */
      .features-section { padding: 10px 25px; }
      .features-section h3 { font-size: 1.1rem; color: #ffffffff; margin-bottom: 15px; }
      .feature-row { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; background: white; padding: 15px; border-radius: 16px; border: 1px solid #f8fafc; }
      .feature-icon-box { min-width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
      .feature-icon-box.blue { background: #eff6ff; color: #2563eb; }
      .feature-icon-box.green { background: #f0fdf4; color: #16a34a; }
      .feature-icon-box.purple { background: #faf5ff; color: #9333ea; }
      .feature-row h4 { margin: 0 0 4px; font-size: 1rem; color: #0f172a; }
      .feature-row p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5; }
    `}</style>

    {/* --- ส่วนของเนื้อหา (JSX) --- */}
    <nav className="home-navbar">
      <div className="home-brand">
        <div className="brand-icon-bg"><Sparkles size={20} color="white" /></div>
        <span className="brand-text">CleanWash</span>
      </div>
      <div className="nav-actions">
        <button onClick={() => navigate('login')} className="btn-text-sm">เข้าสู่ระบบ</button>
        <button onClick={() => navigate('register')} className="btn-primary-sm">สมัครสมาชิก</button>
      </div>
    </nav>

    <header className="hero-card">
      <div className="hero-content">
        <div className="hero-badge">✨ บริการล้างรถพรีเมียม</div>
        <h1>ดูแลรถที่คุณรัก<br/>ให้เงางามเหมือนใหม่</h1>
        <p>จองคิวง่ายผ่านมือถือ ไม่ต้องเสียเวลานั่งรอที่ร้าน</p>
        
        <button onClick={() => navigate('booking')} className="btn-hero-action">
          จองคิวล้างรถทันที <ChevronRight size={20} />
        </button>
      </div>
    </header>

    <div className="stats-container">
        <div className="stat-box">
            <span className="stat-number">4.9 <Star size={12} fill="#f59e0b" stroke="none"/></span>
            <span className="stat-label">คะแนนรีวิว</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-box">
            <span className="stat-number">30</span>
            <span className="stat-label">นาที/คัน</span>
        </div>
        <div className="stat-divider"></div>
        <div className="stat-box">
            <span className="stat-number">1k+</span>
            <span className="stat-label">ลูกค้าวางใจ</span>
        </div>
    </div>

    <section className="features-section">
      <h3>ทำไมต้องเลือกเรา?</h3>
      <div className="features-list">
        <div className="feature-row">
          <div className="feature-icon-box blue"><Clock size={24} /></div>
          <div>
            <h4>ตรงเวลา ไม่ต้องรอ</h4>
            <p>ระบบจองคิวแม่นยำ มาถึงปุ๊บ ได้ล้างปั๊บ</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-icon-box green"><ShieldCheck size={24} /></div>
          <div>
            <h4>ใส่ใจทุกรายละเอียด</h4>
            <p>ใช้น้ำยาเกรดนำเข้า ถนอมสีรถ ไม่เกิดรอยขนแมว</p>
          </div>
        </div>
        <div className="feature-row">
          <div className="feature-icon-box purple"><Zap size={24} /></div>
          <div>
            <h4>สะอาด รวดเร็ว</h4>
            <p>ทีมงานมืออาชีพ พร้อมเครื่องมือทันสมัย</p>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default HomePage;