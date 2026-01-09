import React, { useEffect, useState } from 'react';

// ✅ 1. แก้ Interface ให้ตรงกับข้อมูลจริงที่ Backend ส่งมา (Booking Entity)
interface BookingItem {
  id: number;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  carwashCategory: {
    name: string;
    priceMultiplier: number;
  };
}

const HistoryPage: React.FC = () => {
  const [historyData, setHistoryData] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('access_token'); // หรือ 'token' เช็คชื่อให้ตรงกับตอน Login

        if (!token) {
          setError('ไม่พบ Token กรุณา Login ใหม่');
          setLoading(false);
          return;
        }

        // ✅ 2. แก้ URL: ต้องยิงไปที่ Controller ที่เรียกใช้ findMyBookings 
        // (ปกติถ้าไม่ได้ตั้งชื่อแปลกๆ น่าจะเป็น /carwash-category/my-bookings หรือ /bookings/my-bookings)
        // **ลองเช็คไฟล์ Controller ของคุณนะครับว่าตั้ง Path ไว้ว่าอะไร**
        const response = await fetch('http://localhost:3000/carwash-category/my-bookings', { 
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
            // ถ้า 404 แปลว่า URL ผิด, ถ้า 401 แปลว่า Token ผิด
            if(response.status === 404) throw new Error('ไม่พบลิงก์ API (เช็ค URL ใน Controller)');
            throw new Error('โหลดข้อมูลไม่สำเร็จ');
        }

        const data = await response.json();
        setHistoryData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('th-TH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusColor = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-yellow-100 text-yellow-800';
        case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
        case 'COMPLETED': return 'bg-green-100 text-green-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">ประวัติการจองคิว</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {historyData.length === 0 ? (
          <div className="p-6 text-center text-gray-500">ไม่พบประวัติการจอง</div>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  วัน/เวลาที่จอง
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ประเภทรถ
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id}>
                  {/* วันที่จอง */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {formatDate(item.startTime)}
                  </td>
                  
                  {/* ประเภทรถ (ดึงจาก carwashCategory.name) */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                    {item.carwashCategory?.name || '-'}
                  </td>

                  {/* ราคา */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-600">
                    {item.totalPrice} ฿
                  </td>

                  {/* สถานะ */}
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;