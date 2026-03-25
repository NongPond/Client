import axios from "axios";

// 🔥 เปลี่ยนตรงนี้เป็นลิงก์ Backend ของคุณ
const BASE_URL = "https://server-1-89ke.onrender.com"; 
const API = `${BASE_URL}/api/auth`;

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await axios.post(`${API}/login`, data);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return axios.post(`${API}/register`, data);
};

export const getMe = async () => {
  // 🔥 เปลี่ยนลิงก์ตรงนี้ด้วยครับ
  const res = await axios.get(`${BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  return res.data;
};
