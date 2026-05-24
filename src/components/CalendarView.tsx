import { useMemo, useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type Task = {
  _id: string;
  title: string;
  startTime?: string;
  endTime?: string;
  category?: string;
  sharedWith?: any[];
};

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  
  const calendarRef = useRef<HTMLDivElement>(null); // สำหรับดาวน์โหลดภาพ
  const fullCalendarRef = useRef<FullCalendar>(null); // สำหรับควบคุม FullCalendar API

  // ตรวจจับขนาดหน้าจอเพื่อปรับเปลี่ยน View ของ FullCalendar ให้เหมาะกับมือถือผ่าน API
  useEffect(() => {
    const handleResize = () => {
      const newView = window.innerWidth < 768 ? "timeGridDay" : "timeGridWeek";
      
      if (newView !== calendarView) {
        setCalendarView(newView);
        
        // เรียกใช้งาน API เพื่อสลับหน้าจอมุมมองปฏิทิน
        if (fullCalendarRef.current) {
          fullCalendarRef.current.getApi().changeView(newView);
        }
      }
    };

    // เรียกทำงานครั้งแรกตอนคอมโพเนนต์ถูกติดตั้ง
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calendarView]);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    tasks.forEach(t => {
      if (t.category) unique.add(t.category);
    });
    return ["ทั้งหมด", ...Array.from(unique)];
  }, [tasks]);

  const getColor = (task: Task) => {
    const now = new Date();
    const end = task.endTime ? new Date(task.endTime) : null;

    if (end && end < now) return "#dc2626";

    if (task.sharedWith && task.sharedWith.length > 0) {
      return "#f97316";
    }

    if (task.category) {
      const colors: Record<string, string> = {
        การบ้าน: "#8b5cf6",
        ส่วนตัว: "#10b981",
        งานกลุ่ม: "#f59e0b"
      };
      return colors[task.category] || "#3b82f6";
    }

    return "#3b82f6";
  };

  const filteredTasks = tasks.filter(t => {
    if (selectedCategory === "ทั้งหมด") return true;
    return t.category === selectedCategory;
  });

  const handleDownloadImage = async () => {
    if (!calendarRef.current) return;

    try {
      const dataUrl = await htmlToImage.toPng(calendarRef.current, {
        backgroundColor: "#0f172a",
        pixelRatio: 2
      });

      const link = document.createElement("a");
      link.download = `calendar-${selectedCategory}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="
      rounded-3xl p-4 sm:p-6 md:p-8 min-h-[85vh] shadow-2xl
      bg-white text-black border border-gray-200
      dark:bg-[#0f172a] dark:text-white dark:border-slate-800
    ">

      {/* HEADER */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

        <div className="text-xl md:text-2xl font-semibold tracking-wide text-black dark:text-white">
          📅 ปฏิทินงาน
        </div>

        {/* ปุ่มกดและกล่องเลือกขยายเต็มความกว้างในมือถือเพื่อให้กดง่าย */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">

          {/* SELECT */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="
                appearance-none w-full sm:w-auto
                px-4 py-2 md:px-5 md:py-2.5 pr-10 rounded-xl shadow-md transition

                bg-white text-black border border-gray-300
                hover:border-purple-500
                focus:outline-none focus:ring-2 focus:ring-purple-500

                dark:bg-slate-800 dark:text-white dark:border-slate-600
              "
            >
              {categories.map(cat => (
                <option
                  key={cat}
                  value={cat}
                  className="bg-white text-black dark:bg-slate-900 dark:text-white"
                >
                  {cat}
                </option>
              ))}
            </select>

            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              ▾
            </div>
          </div>

          {/* DOWNLOAD */}
          <button
            onClick={handleDownloadImage}
            className="
              bg-purple-600 hover:bg-purple-700
              text-white px-4 py-2 md:py-2.5 rounded-xl
              shadow-lg transition text-sm md:text-base whitespace-nowrap
            "
          >
            📸 ดาวน์โหลด
          </button>

        </div>
      </div>

      {/* CALENDAR */}
      <div
        ref={calendarRef}
        className="
          calendar-wrapper
          rounded-2xl p-2 md:p-5 shadow-inner
          bg-gray-50 border border-gray-200
          dark:bg-[#111827] dark:border-slate-800
        "
      >
        <FullCalendar
          ref={fullCalendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          viewClassNames="responsive-calendar"
          initialView={calendarView} 
          allDaySlot={false}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          events={filteredTasks
            .filter(t => t.startTime && t.endTime)
            .map(t => ({
              id: t._id,
              title: t.title,
              start: t.startTime,
              end: t.endTime,
              backgroundColor: getColor(t),
              borderColor: getColor(t)
            }))
          }
          height="auto"
          contentHeight="auto"
          nowIndicator={true}
          editable={false}
        />
      </div>

    </div>
  );
}
