import axios from "axios";

const api = axios.create({
  // ดึง URL มาจากไฟล์ .env (ตัวอย่างนี้สำหรับ Vite)
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// ใช้ Interceptor เพื่อแนบ Token ให้ทุก Request อัตโนมัติ
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;