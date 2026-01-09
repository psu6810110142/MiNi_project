import axios from 'axios';


const API_URL = 'http://localhost:3000'; // URL Backend ของคุณ

export const getMyHistory = async () => {
  const token = localStorage.getItem('access_token');

  // เปลี่ยนมาใช้ fetch แทน
  const response = await fetch(`${API_URL}/history`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};