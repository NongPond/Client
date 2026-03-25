import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BoardList() {

  const [boards, setBoards] = useState<any[]>([]);
  const navigate = useNavigate();
  const activeBoards = boards.filter(b => !b.archived);
  const archivedBoards = boards.filter(b => b.archived);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmBoard, setConfirmBoard] = useState<any>(null);
  const [doubleConfirm, setDoubleConfirm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchBoards = async () => {

    const res = await axios.get(
      "http://localhost:5000/api/boards",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setBoards(res.data);

  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
  const handleClick = () => setOpenMenuId(null);
  window.addEventListener("click", handleClick);

  return () => window.removeEventListener("click", handleClick);
}, []);

  return (

    <div className="
          p-8 min-h-screen
          bg-white text-black
          dark:bg-[#0b1324] dark:text-white
        ">

      <h2 className="text-xl mb-4">ล่าสุด</h2>

      <div className="flex gap-4 flex-wrap">

        {/* BOARD LIST */}
        {activeBoards.map(board => (

          <div key={board._id} className="relative w-[250px] h-[120px]">

          {/* CARD */}
          <div
            onClick={() => navigate(`/board/${board._id}`)}
            className="
              relative h-full rounded-xl overflow-hidden
              cursor-pointer transition
              hover:scale-105 hover:shadow-xl
            "
          >
            {/* gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500" />

            {/* overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* content */}
            <div className="relative z-10 p-4 flex justify-between items-start h-full">
              
              <span className="text-white font-semibold text-lg">
                {board.name}
              </span>

            </div>
          </div>

          {/* ⋯ BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === board._id ? null : board._id);
            }}
            className="
              absolute top-2 right-2
              w-8 h-8 flex items-center justify-center
              rounded-md
              bg-black/30 hover:bg-black/50
              backdrop-blur-sm
              text-white
              transition
            "
          >
            ⋯
          </button>

          {/* DROPDOWN */}
          {openMenuId === board._id && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="
            absolute right-2 top-10 z-50
            rounded-lg shadow-xl overflow-hidden
            bg-white border border-gray-200
            dark:bg-gray-800 dark:border-gray-700
          "
          >
            <button
              onClick={() => {
                // 👇 แก้ตรงนี้: แค่สั่งให้เก็บข้อมูลบอร์ด และเปิด Popup
                setConfirmBoard(board);
                setOpenMenuId(null);
              }}
              className="
                w-full text-left
                px-3 py-1.5 text-xs
                bg-white text-gray-700
                hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-200
                dark:hover:bg-gray-700
                transition
              "
            >
              ปิดบอร์ด
            </button>
          </div>
          )}

        </div>

))}

        {/* CREATE BOARD */}
        <div
          onClick={() => setShowCreateModal(true)}
          className="
            w-[250px] h-[120px]
            rounded-xl flex flex-col items-center justify-center
            cursor-pointer transition

            border-2 border-dashed border-gray-300
            text-gray-500

            hover:bg-gray-100 hover:border-purple-400 hover:text-purple-500

            dark:border-gray-600 dark:text-gray-400
            dark:hover:bg-gray-700 dark:hover:text-white
          "
        >
          + สร้างบอร์ดใหม่
        </div>

      </div>

      <h2 className="text-xl mt-10 mb-4 text-gray-400">
  บอร์ดที่ปิด
</h2>

<div className="flex gap-4 flex-wrap">

  {archivedBoards.map(board => (

    <div
      key={board._id}
      className="relative w-[250px] h-[120px] opacity-70"
    >

      <div className="h-full bg-gray-700 rounded-xl p-4">
        {board.name}
      </div>

      {/* 🔥 ลบถาวร */}
      <button
        onClick={() => {
          setConfirmBoard({ ...board, delete: true });
        }}
        className="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded"
      >
        ลบถาวร
      </button>

      {/* 🔥 กู้คืน */}
      <button
        onClick={async () => {

          await axios.put(
            `http://localhost:5000/api/boards/${board._id}/unarchive`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          );

          fetchBoards();

        }}
        className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
      >
        กู้คืน
      </button>

    </div>

  ))}
  
</div>

{/* ===== CONFIRM POPUP ===== */}
{confirmBoard && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

    <div className="
          p-6 rounded-xl w-[320px] shadow-xl

          bg-white text-black
          dark:bg-gray-900 dark:text-white
        ">

      <h3 className="text-lg font-semibold mb-2">
        {confirmBoard.delete ? "ลบบอร์ด" : "ปิดบอร์ด"}
      </h3>

      <p className="text-sm text-gray-400 mb-4">
        คุณแน่ใจหรือไม่ว่าจะ
        {confirmBoard.delete ? "ลบ" : "ปิด"} "{confirmBoard.name}"
      </p>

      <div className="flex justify-end gap-2">

        <button
          onClick={() => setConfirmBoard(null)}
          className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600"
        >
          ยกเลิก
        </button>

        <button
          onClick={() => {
            if (confirmBoard.delete) {
              setDoubleConfirm(true); // 🔥 เปิด modal ซ้อน
            } else {
              // ปิดบอร์ดปกติ
              axios.put(
                `http://localhost:5000/api/boards/${confirmBoard._id}/archive`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                }
              ).then(() => {
                setConfirmBoard(null);
                fetchBoards();
              }).catch((err) => {
                // 👇 ดัก Error ตรงนี้
                setConfirmBoard(null);
                setErrorMsg(err.response?.data?.message || "คุณไม่มีสิทธิ์ปิดบอร์ดนี้");
              });
            }
          }}
          className={`px-3 py-1 rounded text-white ${
            confirmBoard.delete
              ? "bg-red-600 hover:bg-red-700"
              : "bg-yellow-500 hover:bg-yellow-600"
          }`}
        >
          ยืนยัน
        </button>

      </div>

    </div>

  </div>
)}

{doubleConfirm && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60]">

    <div className="
          w-[420px] rounded-2xl p-6 shadow-2xl

          bg-white text-black border border-gray-200
          dark:bg-[#0f172a] dark:text-white dark:border-white/10
        ">

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 text-red-400 text-xl">
          ⚠️
        </div>
        <div>
          <div className="text-lg font-semibold text-white">
            ยืนยันการลบถาวร
          </div>
          <div className="text-xs text-gray-400">
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-300 mb-6">
        คุณกำลังจะลบบอร์ด
        <span className="text-red-400 font-semibold">
          {" "}{confirmBoard?.name}
        </span>
        <br />
        ข้อมูลทั้งหมดจะหายถาวร
      </div>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setDoubleConfirm(false)}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
        >
          ยกเลิก
        </button>

        <button
          onClick={async () => {
            try {
              await axios.delete(
                `http://localhost:5000/api/boards/${confirmBoard._id}`,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                  }
                }
              );

              setDoubleConfirm(false);
              setConfirmBoard(null);
              fetchBoards();

            } catch {
              alert("ผิดพลาด");
            }
          }}
          className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
        >
          ลบถาวร
        </button>

      </div>

    </div>

  </div>
)}

{/* ===== CREATE BOARD MODAL ===== */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="
            relative w-[90%] max-w-[420px] 
            bg-[#111827] dark:bg-[#0f172a] 
            border border-slate-700/50 
            rounded-2xl p-6 shadow-2xl 
            transform transition-all animate-in zoom-in-95 duration-200
          ">

            {/* ปุ่มกากบาท (Close) มุมขวาบน */}
            <button
              onClick={() => {
                setShowCreateModal(false);
                setNewBoardName("");
              }}
              className="
                absolute top-4 right-4
                w-8 h-8 flex items-center justify-center
                rounded-full border border-transparent hover:border-slate-600
                text-slate-400 hover:text-white hover:bg-slate-800
                transition-all duration-200
              "
            >
              ✕
            </button>

            {/* HEADER */}
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
              <span className="text-xl">✨</span> สร้างบอร์ดใหม่
            </h3>

            {/* INPUT */}
            <div className="mb-2">
              <input
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                placeholder="กรอกชื่อบอร์ดที่นี่..."
                autoFocus
                className="
                  w-full px-4 py-3 rounded-xl
                  bg-[#020617] border border-slate-700
                  text-white placeholder-slate-500
                  focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500
                  transition-all duration-200
                "
              />
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName("");
                }}
                className="
                  px-5 py-2.5 rounded-xl font-medium
                  text-slate-300 bg-slate-800 hover:bg-slate-700 
                  transition-colors duration-200
                "
              >
                ยกเลิก
              </button>

              <button
                onClick={async () => {
                  if (!newBoardName.trim()) return;

                  try {
                    await axios.post(
                      "http://localhost:5000/api/boards",
                      { name: newBoardName },
                      {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                      }
                    );

                    setShowCreateModal(false);
                    setNewBoardName("");
                    fetchBoards();

                  } catch {
                    // แนะนำ: เปลี่ยน alert เป็นการเรียกใช้ Error Modal ของคุณแทนได้ครับ
                    alert("สร้างไม่สำเร็จ"); 
                  }
                }}
                disabled={!newBoardName.trim()}
                className="
                  px-6 py-2.5 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-violet-600 to-purple-600 
                  hover:from-violet-500 hover:to-purple-500
                  disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-purple-500/25
                  transform active:scale-95 transition-all duration-200
                "
              >
                สร้างบอร์ด
              </button>

            </div>

          </div>

        </div>
      )}

{/* ===== ERROR MODAL แจ้งเตือน ===== */}
      {errorMsg && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="
            relative w-[90%] max-w-[300px]
            bg-white dark:bg-[#1e293b]
            border border-gray-100 dark:border-slate-700
            rounded-2xl shadow-xl p-5
            transform transition-all animate-in zoom-in-95 duration-200
          ">

            {/* ปุ่มกากบาท (Close) ใส่เส้นขอบกลมๆ แบบในภาพ */}
            <button
              onClick={() => setErrorMsg(null)}
              className="
                absolute top-3 right-3
                w-7 h-7 flex items-center justify-center
                rounded-full border border-gray-300 dark:border-gray-600
                text-gray-400 hover:text-gray-600 hover:bg-gray-50
                dark:hover:bg-slate-700 dark:text-gray-400 dark:hover:text-white
                transition-colors
              "
            >
              ✕
            </button>

            {/* เนื้อหาด้านใน */}
            <div className="flex flex-col items-center text-center mt-2">

              {/* ไอคอนแจ้งเตือน (สีแดงอ่อนๆ) */}
              <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/20 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 text-[#ef4444]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                แจ้งเตือนระบบ
              </h3>

              {/* 🔥 ดักจับภาษาอังกฤษ ถ้าเป็น No permission ให้แปลเป็นไทย */}
              <p className="text-[#64748b] dark:text-slate-300 text-sm leading-relaxed mb-5 px-2">
                {errorMsg === "No permission"
                  ? "คุณไม่มีสิทธิ์ดำเนินการในส่วนนี้"
                  : errorMsg}
              </p>

              {/* ปุ่มตกลง (สีแดงตามแบบ) */}
              <button
                onClick={() => setErrorMsg(null)}
                className="
                  w-full py-2.5 px-4
                  rounded-xl font-bold text-white text-sm tracking-wide
                  bg-[#ef4444] hover:bg-[#dc2626]
                  shadow-lg shadow-red-500/30 dark:shadow-none
                  transform active:scale-95 transition-all duration-200
                "
              >
                ตกลง
              </button>
            </div>

          </div>
        </div>
      )} 

    </div>

  );

}