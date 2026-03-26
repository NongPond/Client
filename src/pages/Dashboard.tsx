import {
  DndContext,
  pointerWithin,
  type DragEndEvent
} from "@dnd-kit/core";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import Column from "../components/Column";
import ShareBoardModal from "../components/ShareBoardModal";
import TaskDetailModal from "../components/TaskDetailModal";
import CalendarView from "../components/CalendarView";
import NotificationDropdown from "../components/NotificationDropdown";
import { getTasks, updateTask, deleteTask } from "../services/taskService";
import { getNotifications } from "../services/notificationService";
import { useParams } from "react-router-dom";
import axios from "axios";
import Tooltip from "../components/Tooltip";

// 🌟 กำหนด Base URL ไว้ตรงนี้เพื่อให้จัดการง่ายขึ้น!
const API_BASE_URL = "https://server-1-89ke.onrender.com";

type Status = "todo" | "doing" | "done";

type Task = {
  _id: string;
  title: string;
  status: Status;
  description?: string;
  startTime?: string;
  endTime?: string;
  boardId?: any;
  permission?: "editor" | "viewer";
};

type ColumnType = {
  id: Status;
  title: string;
  tasks: Task[];
};

export default function Dashboard() {

  const navigate = useNavigate();
  const [view, setView] = useState<"board" | "calendar">("board");
  const [openNoti, setOpenNoti] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [columns, setColumns] = useState<ColumnType[]>([
    { id: "todo", title: "สิ่งที่ต้องทำ", tasks: [] },
    { id: "doing", title: "กำลังทำ", tasks: [] },
    { id: "done", title: "เสร็จ", tasks: [] }
  ]);

  const [, setLoading] = useState(true);
  const [openShare, setOpenShare] = useState(false);
  const [openTask, setOpenTask] = useState<Task | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { boardId } = useParams();
  const [boardName, setBoardName] = useState("");

  const [openBoards, setOpenBoards] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);

  const [search, setSearch] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  const activeBoards = boards.filter(b => !b.archived);
  const [openWorkspace, setOpenWorkspace] = useState(true);


  /* ================= LOAD TASKS ================= */

  const loadTasks = async () => {

    if (!boardId) {
    setLoading(false);
    return;
  }

  try {

    setLoading(true);

    const tasks: Task[] = await getTasks(boardId);

    const grouped: Record<Status, Task[]> = {
      todo: [],
      doing: [],
      done: []
    };

    tasks.forEach(task => {
      grouped[task.status].push(task);
    });

      setColumns([
    { id: "todo", title: "สิ่งที่ต้องทำ", tasks: grouped.todo },
    { id: "doing", title: "กำลังทำ", tasks: grouped.doing },
    { id: "done", title: "เสร็จ", tasks: grouped.done }
  ]);

  } catch (err) {

    console.error("LOAD TASK ERROR:", err);

  } finally {

    setLoading(false);

  }

};

  useEffect(() => {
  loadTasks();
}, [boardId]);

useEffect(() => {

  if (!boardId) return;

  // 🌟 ใช้ API_BASE_URL แทน localhost
  axios.get(`${API_BASE_URL}/api/boards/${boardId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => {
    setBoardName(res.data.name);
  })
  .catch(err => {
    console.error("LOAD BOARD ERROR:", err);
  });

}, [boardId]);

/// ================= LOAD Theme User =================
const [user, setUser] = useState<any>(null);
const [theme, setTheme] = useState("light");

useEffect(() => {
  // 🌟 ใช้ API_BASE_URL แทน localhost
  axios.get(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  .then(res => {
    console.log("USER:", res.data); 
    setUser(res.data);
  })
  .catch(err => {
    console.error("ERROR:", err);
  });
}, []);

const getInitials = (name: string) =>
  name?.split(" ").map(n => n[0]).join("").toUpperCase();


  /* ================= CONNECT SOCKET ================= */

  useEffect(() => {

  const token = localStorage.getItem("token");
  if (!token) return;

  const payload = JSON.parse(atob(token.split(".")[1]));
  const userId = payload.id;

  // 🌟 ใช้ API_BASE_URL แทน localhost
  const newSocket: Socket = io(API_BASE_URL, {
    transports: ["websocket"]
  });

  newSocket.emit("join", userId);

  newSocket.on("taskUpdated", () => {
    loadTasks(); // 🔥 จะใช้ boardId ล่าสุด
  });

  newSocket.on("newNotification", () => {
    setUnreadCount(prev => prev + 1);
  });

  setSocket(newSocket);

  return () => {
    newSocket.disconnect();
  };

}, [boardId]); // 🔥 สำคัญมาก

  /* ================= JOIN BOARD ROOM ================= */

  useEffect(() => {

    if (!socket || !boardId) return;

    socket.emit("joinBoard", boardId);

  }, [socket, boardId]);



  /* ================= LOAD NOTIFICATIONS ================= */

  useEffect(() => {

    const loadUnread = async () => {

      const data = await getNotifications();
      const unread = data.filter((n: any) => !n.read).length;

      setUnreadCount(unread);

    };

    loadUnread();

  }, []);

  /// ================= THEME =================
  useEffect(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
    setTheme("dark");
  } else {
    document.documentElement.classList.remove("dark");
    setTheme("light");
  }
}, []);

  /* ================= LOAD BOARDS ================= */

  useEffect(() => {

  const fetchBoards = async () => {

    try {
      // 🌟 ใช้ API_BASE_URL แทน localhost
      const res = await axios.get(
        `${API_BASE_URL}/api/boards`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setBoards(res.data);

    } catch (err) {
      console.error("LOAD BOARDS ERROR:", err);
    }

  };

  fetchBoards();

}, []);

const filteredBoards = activeBoards.filter(b =>
  b.name.toLowerCase().includes(search.toLowerCase())
);

  /* ================= DRAG ================= */

  const handleDragEnd = (event: DragEndEvent) => {

    const { active, over } = event;

    if (!over) return;

    const fromColumn = columns.find(col =>
      col.tasks.some(t => t._id === active.id)
    );

    if (!fromColumn) return;

    const task = fromColumn.tasks.find(t => t._id === active.id);
    if (!task) return;

    /* MEMBER ลากไม่ได้ */

    if (task.permission === "viewer") {
      return;
    }

    const toColumn =
      columns.find(col => col.id === over.id) ||
      columns.find(col => col.tasks.some(t => t._id === over.id));

    if (!toColumn || fromColumn.id === toColumn.id) return;

    setColumns(cols =>
      cols.map(col => {

        if (col.id === fromColumn.id) {
          return {
            ...col,
            tasks: col.tasks.filter(t => t._id !== task._id)
          };
        }

        if (col.id === toColumn.id) {
          return {
            ...col,
            tasks: [...col.tasks, { ...task, status: toColumn.id }]
          };
        }

        return col;

      })
    );

    updateTask(task._id, { status: toColumn.id });

  };

  /* ================= ADD ================= */

  const addTask = (columnId: Status, taskData: Task) => {

    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? { ...col, tasks: [...col.tasks, taskData] }
          : col
      )
    );

  };

  /* ================= DELETE ================= */

  const deleteTaskById = async (taskId: string) => {

  try {

    await deleteTask(taskId);

    setColumns(cols =>
      cols.map(col => ({
        ...col,
        tasks: col.tasks.filter(t => t._id !== taskId)
      }))
    );

  } catch (err: any) {

  setErrorMsg("คุณไม่มีสิทธิ์ลบ Task นี้");

}

};

  return (

    <div className="
      min-h-screen w-full flex flex-col
      bg-gray-100 text-black
      dark:bg-gray-900 dark:text-white
    ">
      <header className="
        min-h-[56px] h-auto w-full flex flex-wrap items-center justify-between px-4 sm:px-6 py-2 shadow-md z-30
        bg-gray-200 text-black
        dark:bg-gradient-to-r dark:from-purple-700 dark:to-purple-500 dark:text-white
        gap-y-2
      ">

        <div
        onClick={() => navigate("/boards")}
        className="font-bold text-xl cursor-pointer hover:opacity-80"
      >
        Task Management
        {boardId && ` - ${boardName}`}
      </div>

        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 md:gap-4 flex-1">
          
        {/* SWITCH BOARD */}
        <div className="relative">
    <Tooltip text="สลับบอร์ด">
      <button
        onClick={() => setOpenBoards(prev => !prev)}
        className="bg-white text-black px-2.5 sm:px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
      >
        <span>🔄</span>
        <span className="hidden sm:inline">สลับบอร์ด</span>
      </button>
        </Tooltip>

      {openBoards && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpenBoards(false)}
          />

          {/* panel */}
          <div className="
                absolute left-0 mt-2 w-[420px]
                bg-white text-black
                dark:bg-[#1f2937] dark:text-white
                rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700
                z-50 p-4

                max-h-[500px] overflow-y-auto
              ">

            {/* SEARCH */}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 ค้นหาบอร์ดของคุณ"
              className="
                w-full mb-4 px-3 py-2 rounded-lg
                bg-white text-black
                border border-gray-300
                placeholder-gray-400
                focus:ring-2 focus:ring-purple-500
                outline-none

                dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:placeholder-gray-400
              "
            />

            {/* RECENT */}
            {search ? (

            // 🔍 ตอนค้นหา
            <div className="grid grid-cols-2 gap-3">
              {filteredBoards.map(board => (
                <div
                  key={board._id}
                  onClick={() => {
                    navigate(`/board/${board._id}`);
                    setOpenBoards(false);
                  }}
                  className="h-[90px] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
                >
                  <div className="h-[60%] bg-gradient-to-r from-purple-500 to-pink-500" />
                  <div className="p-2 text-sm bg-gray-900 text-white">
                    {board.name}
                  </div>
                </div>
              ))}
            </div>

          ) : (

            // 🕒 ตอนปกติ (ไม่ค้นหา)
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">🕒 เมื่อเร็ว ๆ นี้</p>

              <div className="grid grid-cols-2 gap-3">
                {activeBoards.slice(0, 4).map(board => (
                  <div
                    key={board._id}
                    onClick={() => {
                      navigate(`/board/${board._id}`);
                      setOpenBoards(false);
                    }}
                    className="h-[90px] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
                  >
                    <div className="h-[60%] bg-gradient-to-r from-purple-500 to-pink-500" />
                    <div className="p-2 text-sm bg-gray-900 text-white">
                      {board.name}

                    </div>
                  </div>
                ))}
              </div>
            </div>

          )}

            {/* WORKSPACE */}
            {search === "" && (
            <div>
              <button
                onClick={() => setOpenWorkspace(prev => !prev)}
                className="
                  flex items-center gap-2
                  px-3 py-2 rounded-lg
                  text-sm font-medium
                  bg-gray-200 text-gray-700
                  hover:bg-gray-300
                  dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                  transition
                "
              >
                <span
                  className={`
                    transform transition-transform duration-300
                    ${openWorkspace ? "rotate-90" : "rotate-0"}
                  `}
                >
                  ▶
                </span>

                บอร์ดทั้งหมด
              </button>

              {openWorkspace && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {(search ? filteredBoards : activeBoards).map(board => (
                    <div
                      key={board._id}
                      onClick={() => {
                        navigate(`/board/${board._id}`);
                        setOpenBoards(false);
                      }}
                      className="h-[90px] rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition"
                    >
                      <div className="h-[60%] bg-gradient-to-r from-purple-500 to-pink-500" />
                      <div className="p-2 text-sm bg-gray-900 text-white">
                        {board.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
)}
          </div>
        </>
      )}

    </div>

<Tooltip text="บอร์ด">
    <button
      onClick={() => setView("board")}
      className={`px-2.5 sm:px-3 py-1.5 rounded text-sm flex items-center gap-1.5 ${
        view === "board" ? "bg-white text-black" : "bg-purple-600 text-white"
      }`}
    >
      <span>📋</span>
      <span className="hidden sm:inline">บอร์ด</span>
    </button>
  </Tooltip>

<Tooltip text="ปฏิทิน">
    <button
      onClick={() => setView("calendar")}
      className={`px-2.5 sm:px-3 py-1.5 rounded text-sm flex items-center gap-1.5 ${
        view === "calendar" ? "bg-white text-black" : "bg-purple-600 text-white"
      }`}
    >
      <span>📅</span>
      <span className="hidden sm:inline">ปฏิทิน</span>
    </button>
  </Tooltip>

          <div className="relative">

<Tooltip text="แจ้งเตือน">
      <button
        onClick={() => setOpenNoti(prev => !prev)}
        className="relative bg-white text-black px-2.5 sm:px-3 py-1.5 rounded text-sm flex items-center"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>
    </Tooltip>

            {openNoti && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpenNoti(false)}
                />

                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-2xl border border-gray-700 z-50">

                  <NotificationDropdown
                    onClose={() => setOpenNoti(false)}
                    onUnreadChange={setUnreadCount}
                  />

                </div>
              </>
            )}

          </div>

<Tooltip text="แชร์บอร์ด">
    <button
      onClick={() => setOpenShare(true)}
      className="bg-white text-black px-2.5 sm:px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
    >
      <span>👥</span>
      <span className="hidden sm:inline">แชร์</span>
    </button>
  </Tooltip>

        <div className="relative ml-1">

        {/* avatar */}
        <div
          onClick={() => setOpenProfile(prev => !prev)}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold cursor-pointer"
        >
          {user ? getInitials(user.name) : "?"}
        </div>

        {openProfile && (
          <>
            {/* backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpenProfile(false)}
            />

            {/* dropdown */}
            <div className="
                  absolute right-0 mt-2 w-64
                  bg-white text-black border border-gray-200
                  dark:bg-[#1f2937] dark:text-white dark:border-gray-700
                  rounded-xl shadow-2xl z-50 p-4
                ">

              {/* profile */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                  {user ? getInitials(user.name) : ""}
                </div>

                <div>
                  <div className="font-semibold">
                    {user?.name || "กำลังโหลด..."}
                  </div>
                  <div className="text-sm text-gray-500">
                    {user?.email || ""}
                  </div>
                </div>
              </div>

              <hr className="mb-3" />

              {/* theme toggle */}
              <button
                onClick={() => {
                  const newTheme = theme === "light" ? "dark" : "light";
                  setTheme(newTheme);

                  localStorage.setItem("theme", newTheme); 

                  if (newTheme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }

                }}
                className="
                    w-full px-4 py-2.5 rounded-xl text-left
                    flex items-center gap-2

                    bg-gray-100 hover:bg-gray-200 text-gray-800
                    shadow-sm

                    dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white

                    transition duration-200
                  "
              >
                🎨 เปลี่ยนธีม ({theme === "light" ? "Light" : "Dark"})
              </button>

              <hr className="my-2" />

              {/* logout */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="
                  w-full px-4 py-2.5 rounded-xl text-left
                  flex items-center gap-2

                  bg-red-50 hover:bg-red-100 text-red-600
                  shadow-sm

                  dark:bg-red-500/10 dark:hover:bg-red-500/20 dark:text-red-400

                  transition duration-200
                "
              >
                ออกจากระบบ
              </button>

            </div>
          </>
        )}

      </div>

        </div>

      </header>



      <div className="flex-1 overflow-auto">

        {view === "board" && (

          <DndContext
            collisionDetection={pointerWithin}
            onDragEnd={handleDragEnd}
          >

            <div className="flex flex-nowrap items-start gap-4 md:gap-6 p-4 md:p-6 overflow-x-auto min-h-[calc(100vh-56px)]">

              {columns.map(column => (

             <div key={column.id} className="w-[85vw] sm:w-[320px] shrink-0">
                  <Column
                    column={column}
                    boardId={boardId as string}
                    permission={column.tasks[0]?.permission}
                    onAdd={addTask}
                    onDelete={deleteTaskById}
                    onSelect={setOpenTask}
                  />
                </div>

              ))}

            </div>

          </DndContext>

        )}

        {view === "calendar" && (

          <div className="p-6">
            <CalendarView
              tasks={columns.flatMap(col => col.tasks)}
            />
          </div>

        )}

      </div>



      {openTask && (

        <TaskDetailModal
          task={openTask}
          onClose={() => setOpenTask(null)}
          onUpdated={(updated: Task) => {

            setOpenTask(updated);

            setColumns(cols =>
              cols.map(col => ({
                ...col,
                tasks: col.tasks.map(t =>
                  t._id === updated._id ? updated : t
                )
              }))
            );

          }}
        />

      )}



      {openShare && boardId && (

        <ShareBoardModal
          boardId={boardId}
          onClose={() => setOpenShare(false)}
        />

      )}

          {errorMsg && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity">
          
          <div className="
            w-[360px] 
            bg-white dark:bg-[#0f172a] 
            border border-gray-200 dark:border-white/10 
            rounded-2xl shadow-2xl p-6 relative
            transition-colors duration-200
          ">

            {/* close button (แก้ UI ปุ่มปิดให้สวยเนียนเข้ากับธีมใหม่) */}
            <button
              onClick={() => setErrorMsg(null)}
              className="
                absolute top-4 right-4
                w-8 h-8 flex items-center justify-center
                rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900
                dark:bg-[#1e293b] dark:hover:bg-slate-800 dark:text-gray-400 dark:hover:text-white
                border border-transparent dark:border-white/5
                transition-all duration-200
              "
            >
              ✕
            </button>

            {/* title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              แจ้งเตือน
            </h3>

            {/* message */}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 transition-colors">
              {errorMsg}
            </p>

            {/* button */}
            <div className="flex justify-end">
              <button
                onClick={() => setErrorMsg(null)}
                className="
                  px-5 py-2.5
                  rounded-xl font-medium
                  bg-gradient-to-r from-violet-600 to-indigo-600
                  hover:from-violet-700 hover:to-indigo-700
                  text-white text-sm
                  shadow-lg shadow-purple-500/30 dark:shadow-none
                  transition-all duration-200
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