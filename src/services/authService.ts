import api from "../utils/axios";

// 🔥 กำหนดแค่ Path ย่อย เพราะ Base URL ถูกตั้งไว้ใน api แล้ว
const ENDPOINT = "/api/auth";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post(`${ENDPOINT}/login`, data);
  localStorage.setItem("token", res.data.token); // เก็บ Token ไว้ใช้เหมือนเดิม
  return res.data;
};

export const register = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post(`${ENDPOINT}/register`, data);
};

export const getMe = async () => {
  // 🎉 ไม่ต้องคอยเขียน headers แนบ Token เองแล้ว! api จัดการให้อัตโนมัติ
  const res = await api.get(`${ENDPOINT}/me`);
  return res.data;
};
