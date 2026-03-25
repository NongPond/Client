import { useEffect, useState } from "react";
import { getNotifications, markRead } from "../services/notificationService";

export default function Notifications() {
  const [list, setList] = useState<any[]>([]);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setList(data);
  };

  useEffect(() => {
    loadNotifications();

    // 🔥 โหลดใหม่ทุก 5 วิ
    const interval = setInterval(() => {
      loadNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🔔 แจ้งเตือน</h1>

      <div className="space-y-3">
        {list.map(n => (
          <div
            key={n._id}
            onClick={() => {
              markRead(n._id);
              setList(l =>
                l.map(x =>
                  x._id === n._id ? { ...x, read: true } : x
                )
              );
            }}
            className={`p-4 rounded-xl cursor-pointer transition ${
              n.read
                ? "bg-gray-800 text-gray-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
            }`}
          >
            {n.message}
          </div>
        ))}

        {list.length === 0 && (
          <div className="text-gray-400 text-center py-10">
            ไม่มีแจ้งเตือน
          </div>
        )}
      </div>
    </div>
  );
}
