import { io } from "socket.io-client";

// 🔥 เปลี่ยนจาก localhost เป็นลิงก์ Backend ของคุณ
const BACKEND_URL = "https://server-1-89ke.onrender.com";

const socket = io(BACKEND_URL, {
  // เพิ่ม 2 บรรทัดนี้เผื่อไว้ เพื่อให้มั่นใจว่ามันจะเชื่อมต่อข้ามโดเมนได้ชัวร์ๆ
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;


