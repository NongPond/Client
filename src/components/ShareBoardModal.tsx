import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { shareBoard } from "../services/taskService";

type Member = {
  userId: string;
  email: string;
  role: "owner" | "editor" | "member";
};

type Props = {
  boardId: string;
  onClose: () => void;
};

export default function ShareBoardModal({ boardId, onClose }: Props) {

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "member">("editor");
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const payload = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  const myEmail = payload?.email;

  /* LOAD MEMBERS */

  const loadMembers = async () => {
    const res = await fetch(
      `http://localhost:5000/api/tasks/board/${boardId}/members`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    const data = await res.json();
    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, [boardId]);

  /* REALTIME */

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("taskUpdated", () => {
      loadMembers();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* SHARE */

  const handleShare = async () => {
    if (!email.trim()) {
      setError("กรุณากรอกอีเมล");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await shareBoard(boardId, email, role);
      setEmail("");
      loadMembers();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "แชร์ไม่สำเร็จ"
      );
    } finally {
      setLoading(false);
    }
  };

  /* UPDATE ROLE */

  const updateRole = async (userId: string, newRole: string) => {
    await fetch(
      `http://localhost:5000/api/tasks/board/${boardId}/member/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      }
    );
    loadMembers();
  };

  /* REMOVE MEMBER */

  const removeMember = async (userId: string) => {
    await fetch(
      `http://localhost:5000/api/tasks/board/${boardId}/member/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    loadMembers();
  };

  /* LEAVE BOARD */

  const leaveBoard = async () => {
    await fetch(
      `http://localhost:5000/api/tasks/${boardId}/leave`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    window.location.reload();
  };

  const myMember = members.find(m => m.email === myEmail);
  const isOwner = myMember?.role === "owner";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      
      {/* แก้ไขพื้นหลัง Modal หลักให้รองรับ Light/Dark */}
      <div className="bg-white dark:bg-gray-800 w-[450px] rounded-xl p-6 shadow-2xl text-gray-900 dark:text-white transition-colors duration-200">
        
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-bold text-lg flex items-center gap-2">
            👥 แชร์บอร์ด
          </h2>
          <button
            onClick={onClose}
            className="
              w-8 h-8 flex items-center justify-center
              rounded-full
              text-gray-500 hover:text-black hover:bg-gray-200
              dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700
              text-lg transition-colors
            "
          >
            ✕
          </button>
        </div>

        {/* SHARE */}
        <div className="flex gap-2 mb-4">
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="อีเมลผู้ใช้"
            className="
              flex-1 p-2 rounded text-sm
              bg-gray-100 border border-gray-300 text-gray-900 
              dark:bg-gray-700 dark:border-transparent dark:text-white
              focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
            "
          />
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="
              text-sm rounded px-2
              bg-gray-100 border border-gray-300 text-gray-900
              dark:bg-gray-700 dark:border-transparent dark:text-white
              focus:outline-none transition-colors
            "
          >
            <option value="editor">Editor</option>
            <option value="member">Member</option>
          </select>
          <button
            onClick={handleShare}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 rounded text-sm disabled:opacity-50 transition-colors"
          >
            แชร์
          </button>
        </div>

        {error && (
          <div className="text-red-500 dark:text-red-400 text-sm mb-2">
            {error}
          </div>
        )}

        {/* MEMBER LIST */}
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {members.map((m) => (
            <div
              key={m.userId}
              className="
                flex justify-between items-center px-3 py-2 rounded-lg
                bg-gray-50 border border-gray-200
                dark:bg-gray-700 dark:border-transparent transition-colors
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {m.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {m.email}
                    {m.email === myEmail && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (คุณ)
                      </span>
                    )}
                    {m.role === "owner" && (
                      <span className="ml-1 text-yellow-400">👑</span>
                    )}
                  </div>
                  {isOwner && m.role !== "owner" && (
                    <select
                      value={m.role}
                      onChange={(e) =>
                        updateRole(m.userId, e.target.value)
                      }
                      className="
                        text-xs rounded px-2 mt-1
                        bg-gray-200 border border-gray-300 text-gray-900
                        dark:bg-gray-600 dark:border-transparent dark:text-white
                        focus:outline-none transition-colors
                      "
                    >
                      <option value="editor">Editor</option>
                      <option value="member">Member</option>
                    </select>
                  )}
                </div>
              </div>

              {isOwner && m.role !== "owner" && (
                <button
                  onClick={() => removeMember(m.userId)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs transition-colors"
                >
                  เอาออกจากบอร์ด
                </button>
              )}

              {!isOwner && m.email === myEmail && (
                <button
                  onClick={leaveBoard}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs transition-colors"
                >
                  ออกจากบอร์ด
                </button>
              )}
            </div>
          ))}

          {members.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
              ยังไม่มีสมาชิก
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
