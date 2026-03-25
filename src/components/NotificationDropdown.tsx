import { useEffect, useState } from "react";
import {
  getNotifications,
  markRead,
  deleteNotification,
  clearAllNotifications
} from "../services/notificationService";

type Notification = {
  _id: string;
  message: string;
  read: boolean;
};

type Props = {
  onClose?: () => void;
  onUnreadChange?: (count: number) => void;
};

export default function NotificationDropdown({
  onClose,
  onUnreadChange
}: Props) {

  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= UPDATE UNREAD ================= */

  const updateUnread = (data: Notification[]) => {
    const unread = data.filter(n => !n.read).length;
    onUnreadChange?.(unread);
  };

  /* ================= LOAD ================= */

  const load = async () => {

    try {

      const data = await getNotifications();

      setList(data);
      updateUnread(data);

    } catch (err) {

      console.error("Load notification error:", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    load();
  }, []);

  /* ================= READ ================= */

  const handleRead = async (id: string) => {

    try {

      await markRead(id);

      const updated = list.map(n =>
        n._id === id ? { ...n, read: true } : n
      );

      setList(updated);
      updateUnread(updated);

    } catch (err) {

      console.error("Read notification error:", err);

    }

  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {

    try {

      await deleteNotification(id);

      const updated = list.filter(n => n._id !== id);

      setList(updated);
      updateUnread(updated);

    } catch (err) {

      console.error("Delete notification error:", err);

    }

  };

  /* ================= CLEAR ALL ================= */

  const handleClearAll = async () => {

    try {

      await clearAllNotifications();

      setList([]);
      onUnreadChange?.(0);

    } catch (err) {

      console.error("Clear notifications error:", err);

    }

  };

  return (

    <div className="
        p-3 max-h-96 overflow-y-auto
        bg-white text-black
        dark:bg-gray-800 dark:text-white
      ">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-3">

        <h3 className="font-semibold text-sm">
          🔔 แจ้งเตือน
        </h3>

        <div className="flex items-center gap-2">

          {list.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-white-400 hover:text-white-300 text-xs"
            >
              ลบทั้งหมด
            </button>
          )}

          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              text-gray-500 hover:text-black hover:bg-gray-200
              dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700
              text-lg
            "
          >
            ✕
          </button>

        </div>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-gray-400 text-sm text-center py-4">
          
        </div>
      )}

      {/* LIST */}

      {!loading && (
        <div className="space-y-2">

          {list.map(n => (
            <div
              key={n._id}
              className={`
                flex items-center justify-between gap-3
                p-3 rounded-lg text-sm group transition-all duration-200
                ${n.read
                  ? "bg-[#2d3748] text-gray-300" 
                  : "bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"}
              `}
              onClick={() => {
                if (!n.read) handleRead(n._id);
              }}
            >
              
              {/* ข้อความแจ้งเตือน */}
              <span className="flex-1 truncate">
                {n.message}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(n._id);
                }}
                className="
                  flex items-center justify-center
                  w-7 h-7 rounded-md bg-transparent border-none
                  hover:bg-red-500/20
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200 focus:outline-none
                "
                title="ลบ"
              >
                {/* ใช้ Emoji แทนรูปภาพไปเลย รับรองว่าขึ้นชัวร์ๆ */}
                <span className="text-base leading-none">🗑️</span>
              </button>
            </div>
          ))}

          {list.length === 0 && (

            <div className="text-gray-400 text-sm text-center py-4">
              ไม่มีแจ้งเตือน
            </div>

          )}

        </div>
      )}

    </div>

  );
}