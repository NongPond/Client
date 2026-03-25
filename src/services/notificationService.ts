import axios from "axios";

// 🔥 เปลี่ยนจาก localhost เป็นลิงก์หลังบ้าน
const API = "https://server-1-89ke.onrender.com/api/notifications";

const getAuth = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
});

export const getNotifications = async () => {
  const res = await axios.get(API, getAuth());
  return res.data;
};

export const deleteNotification = async (id: string) => {
  await axios.delete(`${API}/${id}`, getAuth());
};

export const markRead = async (id: string) => {
  await axios.put(`${API}/${id}/read`, {}, getAuth());
};

/* ===== CLEAR ALL ===== */

export const clearAllNotifications = async () => {
  await axios.delete(`${API}/clear/all`, getAuth());
};
