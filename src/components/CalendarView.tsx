import { useMemo, useState, useRef } from "react";
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
  const calendarRef = useRef<HTMLDivElement>(null);

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
      rounded-3xl p-8 min-h-[85vh] shadow-2xl
      bg-white text-black border border-gray-200
      dark:bg-[#0f172a] dark:text-white dark:border-slate-800
    ">

      {/* HEADER */}
      <div className="mb-8 flex justify-between items-center">

        <div className="text-2xl font-semibold tracking-wide text-black dark:text-white">
          📅 ปฏิทินงาน
        </div>

        <div className="flex items-center gap-4">

          {/* SELECT */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="
                appearance-none
                px-5 py-2.5 pr-10 rounded-xl shadow-md transition

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
              text-white px-4 py-2.5 rounded-xl
              shadow-lg transition
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
            rounded-2xl p-5 shadow-inner
            bg-gray-50 border border-gray-200
            dark:bg-[#111827] dark:border-slate-800
          "
        >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
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
