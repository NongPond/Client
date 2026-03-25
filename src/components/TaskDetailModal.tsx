import { useEffect, useState } from "react";
import { updateTask } from "../services/taskService";
import AlertModal from "./AlertModal";

type Props = {
  task: any;
  onClose: () => void;
  onUpdated: (task: any) => void;
};

export default function TaskDetailModal({
  task,
  onClose,
  onUpdated
}: Props) {

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [saving, setSaving] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  /* ===== PERMISSION ===== */
  const isViewer = task.permission === "viewer";

  /* ===== CREATOR NAME ===== */
  const creatorName =
    task.createdBy?.name ||
    task.ownerId?.name ||
    "ไม่ทราบชื่อ";

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
  }, [task]);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (isViewer) {
      setAlertMsg("คุณไม่มีสิทธิ์แก้ไข Task นี้");
      return;
    }

    setSaving(true);

    const result = await updateTask(task._id, {
      title,
      description
    });

    if (result.success) {
      onUpdated(result.data);
      onClose();
    } else {
      if ("message" in result) {
        const messageMap: Record<string, string> = {
          "Member cannot edit task": "คุณไม่มีสิทธิ์แก้ไขงานนี้",
          "Forbidden": "คุณไม่มีสิทธิ์แก้ไขงานนี้",
          "Update task failed": "ไม่สามารถบันทึกงานได้"
        };
        setAlertMsg(messageMap[result.message] || "เกิดข้อผิดพลาด");
      } else {
        setAlertMsg("เกิดการชนของเวลา (Task conflict)");
      }
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center transition-opacity">

      {/* Main Container */}
      <div className="
        w-[980px] max-w-[95%] h-[680px] 
        bg-white dark:bg-[#0f172a] 
        rounded-3xl shadow-2xl overflow-hidden relative 
        border border-gray-200 dark:border-white/10
        transition-colors duration-200
      ">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-90 font-medium">
                รายละเอียดงาน
              </div>
              <input
                value={title}
                disabled={isViewer}
                onChange={e => setTitle(e.target.value)}
                className="
                  mt-1 text-4xl font-extrabold tracking-tight
                  bg-transparent outline-none
                  border-b border-transparent
                  focus:border-white/50
                  disabled:opacity-60
                  transition
                  w-full min-w-[300px]
                "
              />
              {isViewer && (
                <div className="text-xs text-yellow-300 mt-2">
                  🔒 โหมดดูอย่างเดียว (Viewer)
                </div>
              )}
            </div>

            {/* ปุ่มปิด (ปรับตามภาพต้นแบบ UI ใหม่) */}
            <button
              onClick={onClose}
              className="
                w-12 h-12 flex items-center justify-center
                rounded-2xl bg-[#1e293b] hover:bg-[#0f172a]
                text-gray-400 hover:text-white text-xl
                border border-white/5
                shadow-lg
                transition-all duration-200
              "
            >
              ✕
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="flex h-[calc(100%-140px)]">

          {/* LEFT CONTENT */}
          <div className="flex-1 p-8 overflow-y-auto space-y-6">

            {task.startTime && task.endTime && (
              <div className="
                bg-gray-50 dark:bg-white/5 
                border border-gray-200 dark:border-white/10 
                rounded-xl p-4 transition-colors
              ">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  ⏰ เวลา
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                  {new Date(task.startTime).toLocaleString()}
                  {" → "}
                  {new Date(task.endTime).toLocaleString()}
                </div>
              </div>
            )}

            {task.category && (
              <div className="
                inline-block px-4 py-1 rounded-full text-sm font-medium
                bg-purple-100 text-purple-700
                dark:bg-purple-600/30 dark:text-purple-300
                transition-colors
              ">
                🏷 {task.category}
              </div>
            )}

            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                📝 รายละเอียด
              </div>
              <textarea
                value={description}
                disabled={isViewer}
                onChange={e => setDescription(e.target.value)}
                placeholder="เพิ่มรายละเอียดงาน..."
                className="
                  w-full h-56 resize-none
                  rounded-2xl p-4
                  bg-gray-50 border border-gray-200 text-gray-900
                  dark:bg-[#020617] dark:border-white/10 dark:text-gray-200
                  disabled:opacity-60
                  focus:ring-2 focus:ring-purple-500 outline-none
                  transition-colors duration-200
                "
              />
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="
            w-[260px] p-6 space-y-4
            bg-gray-50 border-l border-gray-200
            dark:bg-[#020617] dark:border-white/10
            transition-colors duration-200
          ">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              📌 สถานะ
            </div>
            <div className="
              px-4 py-2 rounded-xl text-center font-medium
              bg-white border border-gray-200 text-gray-800
              dark:bg-white/10 dark:border-transparent dark:text-white
              transition-colors
            ">
              {
                {
                  todo: "สิ่งที่ต้องทำ",
                  doing: "กำลังทำ",
                  done: "เสร็จ"
                }[task.status as "todo" | "doing" | "done"]
              }
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
              👤 ผู้สร้าง
            </div>
            <div className="
              px-4 py-2 rounded-xl text-center font-medium
              bg-white border border-gray-200 text-gray-800
              dark:bg-white/10 dark:border-transparent dark:text-white
              transition-colors
            ">
              {creatorName}
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="
          absolute bottom-0 left-0 w-full p-6 flex justify-end gap-4
          bg-white border-t border-gray-200
          dark:bg-[#0f172a] dark:border-white/10
          transition-colors duration-200
        ">
          <button
            onClick={onClose}
            className="
              px-6 py-3 rounded-xl text-sm font-medium
              bg-white hover:bg-gray-50 border border-gray-300 text-gray-700
              dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-gray-300
              transition-colors
            "
          >
            ยกเลิก
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="
              px-6 py-3 rounded-xl text-sm font-medium
              bg-gradient-to-r from-violet-600 to-indigo-600
              hover:from-violet-700 hover:to-indigo-700
              text-white
              shadow-lg shadow-purple-500/30 dark:shadow-none
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
            "
          >
            💾 บันทึกการเปลี่ยนแปลง
          </button>
        </div>

      </div>

      {/* ALERT MODAL */}
      {alertMsg && (
        <AlertModal
          message={alertMsg}
          onClose={() => setAlertMsg(null)}
        />
      )}

    </div>
  );
}