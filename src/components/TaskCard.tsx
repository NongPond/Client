import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

type Permission = "editor" | "viewer";

type TaskCardProps = {
  task: {
    _id: string;
    title: string;
    startTime?: string;
    endTime?: string;
    category?: string;
    permission?: Permission;
  };
  onDelete: (id: string) => void;
  onSelect: (task: any) => void;
  selected?: boolean;
};

export default function TaskCard({
  task,
  onDelete,
  onSelect,
  selected
}: TaskCardProps) {

  const [confirmDelete, setConfirmDelete] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task._id
  });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition
  };

  const canEdit = task.permission !== "viewer";

  const formatTime = (date?: string) => {
    if (!date) return "";

    return new Date(date).toLocaleString("th-TH", {
      dateStyle: "short",
      timeStyle: "short"
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const confirmDeleteTask = () => {
    onDelete(task._id);
    setConfirmDelete(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => onSelect(task)}
        className={`
          group rounded-lg shadow-md p-3 text-sm cursor-pointer relative
          transition border
          ${selected
            ? "bg-gray-100 text-black"
            : "dark:bg-gray-600 dark:text-white"}
            shadow-md hover:shadow-lg
        `}
      >

        {/* DRAG HANDLE */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="
            absolute top-2 right-2
            cursor-grab active:cursor-grabbing
            text-gray-300 hover:text-white
            text-lg
          "
          title="ลากการ์ด"
        >
          ⠿
        </div>

        {/* CATEGORY */}
        {task.category && (
          <div className="mb-1">
            <span className="bg-purple-500 text-white text-[10px] px-2 py-1 rounded-full">
              {task.category}
            </span>
          </div>
        )}

        {/* TITLE */}
        <div className="pr-6 font-medium break-words">
          {task.title}
        </div>

        {/* TIME */}
        {task.startTime && task.endTime && (
          <div className="text-xs text-gray-300 mt-2">
            ⏰ {formatTime(task.startTime)}
            <br />
            ถึง {formatTime(task.endTime)}
          </div>
        )}

        {/* DELETE */}
        {canEdit && (
          <button
            onClick={handleDelete}
            className="
              absolute right-2 bottom-2
              text-red-400 hover:text-red-500
              opacity-0 group-hover:opacity-100
              transition
            "
            title="ลบการ์ด"
          >
            🗑️
          </button>
        )}

      </div>

      {/* DELETE CONFIRM MODAL */}

      {confirmDelete && (
        <ConfirmDeleteModal
          title="ลบการ์ด"
          message="การ์ดนี้จะถูกลบออกจากบอร์ดอย่างถาวร และไม่สามารถกู้คืนได้"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={confirmDeleteTask}
        />
      )}
    </>
  );
}
