import { useMemo, useState, useRef, useEffect } from "react";
import * as htmlToImage from "html-to-image";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list"; // เพิ่ม Plugin สำหรับดูแบบรายการในมือถือ

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
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // เช็คขนาดหน้าจอเพื่อปรับ View
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    if (end && end < now) return "#dc2626"; // เลยกำหนด (แดง)
    if (task.sharedWith && task.sharedWith.length > 0) return "#f97316"; // งานแชร์ (ส้ม)
    
    const colors: Record<string, string> = {
      การบ้าน: "#8b5cf6",
      ส่วนตัว: "#10b981",
      งานกลุ่ม: "#f59e0b"
    };
    return (task.category && colors[task.category]) || "#3b82f6";
  };

  // กรองงานและเตรียมข้อมูลให้ FullCalendar
  const events = useMemo(() => {
    return tasks
      .filter(t => {
        const matchesCategory = selectedCategory === "ทั้งหมด" || t.category === selectedCategory;
        return matchesCategory && t.startTime && t.endTime;
      })
      .map(t => ({
        id: t._id,
        title: t.title,
        start: t.startTime, // ใช้ ISO string ตรงๆ
        end: t.endTime,
        backgroundColor: getColor(t),
        borderColor: getColor(t),
        extendedProps: { category: t.category }
      }));
  }, [tasks, selectedCategory]);

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
    <div className="rounded-3xl p-4 md:p-8 min-h-[85vh] shadow-2xl bg-white text-black border border-gray-200 dark:bg-[#0f172a] dark:text-white dark:border-slate-800">
      
      {/* HEADER - ปรับให้ Stack กันในมือถือ */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-xl md:text-2xl font-semibold tracking-wide">
          📅 ปฏิทินงาน
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-4 w-full sm:w-auto">
          {/* SELECT */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full appearance-none px-4 py-2 pr-10 rounded-xl shadow-md bg-gray-100 dark:bg-slate-800 border border-transparent focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">▾</div>
          </div>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={handleDownloadImage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-lg transition text-sm flex items-center gap-2"
          >
            📸 <span className="hidden sm:inline">ดาวน์โหลด</span>
          </button>
        </div>
      </div>

      {/* CALENDAR WRAPPER */}
      <div
        ref={calendarRef}
        className="calendar-wrapper rounded-2xl p-2 md:p-5 shadow-inner bg-gray-50 border border-gray-200 dark:bg-[#111827] dark:border-slate-800"
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
          // ในมือถือใช้ view รายวัน หรือ รายการ จะลื่นกว่า
          initialView={isMobile ? "listWeek" : "timeGridWeek"}
          allDaySlot={false}
          timeZone="local" // สำคัญ: ให้ใช้เวลาตามเครื่อง user
          locale="th" // ภาษาไทย
          headerToolbar={isMobile ? {
            left: "prev,next",
            center: "title",
            right: "timeGridDay,listWeek"
          } : {
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          events={events}
          height="auto"
          nowIndicator={true}
          stickyHeaderDates={true}
          handleWindowResize={true}
          expandRows={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
        />
      </div>
    </div>
  );
}
