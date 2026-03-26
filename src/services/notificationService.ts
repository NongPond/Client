import api from "../utils/axios";

// 🔥 เราใช้แค่ Path ต่อท้ายก็พอ เพราะ Base URL และ Token ถูกจัดการใน api แล้ว!
const ENDPOINT = "/api/notifications";

export const getNotifications = async () => {
  const res = await api.get(ENDPOINT);
  return res.data;
};

export const deleteNotification = async (id: string) => {
  await api.delete(`${ENDPOINT}/${id}`);
};

export const markRead = async (id: string) => {
  await api.put(`${ENDPOINT}/${id}/read`);
};

/* ===== CLEAR ALL ===== */

export const clearAllNotifications = async () => {
  await api.delete(`${ENDPOINT}/clear/all`);
};
