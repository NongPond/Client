import { io } from "socket.io-client";

const BACKEND_URL = "https://server-1-89ke.onrender.com";

const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

export default socket;


