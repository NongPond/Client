import {
  SortableContext,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { useState } from "react";
import { createTask } from "../services/taskService";
import type { TaskStatus } from "../services/taskService";

type Suggestion = {
  suggestedStart: string
  suggestedEnd: string
}

type ColumnProps = {
  column: any
  boardId: string
  permission?: "editor" | "viewer"
  onAdd: (columnId: TaskStatus, task: any) => void
  onDelete: (id: string) => void
  onEdit?: any
  onSelect: (task: any) => void
  selectedTask?: any
}

export default function Column({
  column,
  boardId,
  permission,
  onAdd,
  onDelete,
  onSelect,
  selectedTask
}: ColumnProps) {

  const [newTitle, setNewTitle] = useState("")
  const [category, setCategory] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState("")
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const { setNodeRef } = useDroppable({
    id: column.id
  })

  /* แปลงเวลาให้ input ใช้ได้ */

  const formatInputDate = (date: string) => {

    const d = new Date(date)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")

    const hour = String(d.getHours()).padStart(2, "0")
    const minute = String(d.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hour}:${minute}`
  }

  const submitAdd = async () => {

    /* MEMBER เพิ่มไม่ได้ */

    if (permission === "viewer") {
      setError("คุณไม่มีสิทธิ์เพิ่มงาน")
      return
    }

    setError("")
    setSuggestions([])

    if (!newTitle.trim()) {
      setError("กรุณากรอกชื่องาน")
      return
    }

    if (!startTime || !endTime) {
      setError("กรุณาเลือกช่วงเวลา")
      return
    }

    if (new Date(endTime) <= new Date(startTime)) {
      setError("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม")
      return
    }

    const result = await createTask({
      title: newTitle,
      status: column.id,
      startTime,
      endTime,
      boardId,
      category: category.trim() || undefined
    })

    if (result.success) {

      onAdd(column.id, result.data)

      setNewTitle("")
      setCategory("")
      setStartTime("")
      setEndTime("")
      setAdding(false)

      return
    }

    if ("conflict" in result && result.conflict) {

      setSuggestions(
        result.suggestions ||
        (result.suggestion ? [result.suggestion] : [])
      )

      setError("เวลาซ้ำ กรุณาเลือกช่วงเวลาที่แนะนำ")
      return

    }

    if ("message" in result) {
      setError(result.message)
      return
    }

    setError("เกิดข้อผิดพลาด")
  }

  return (
      <div className="
        w-full sm:w-72 md:w-80
        rounded p-4 flex flex-col
        bg-white text-black
        dark:bg-gray-700 dark:text-white
      ">

      <h2 className="font-semibold mb-4">{column.title}</h2>

      <div
      ref={setNodeRef}
      className="flex-1 min-h-[150px]"
    >

        <SortableContext
          items={column.tasks.map((t: any) => t._id)}
          strategy={verticalListSortingStrategy}
        >

          <div className="flex flex-col gap-3">

            {column.tasks.map((task: any) => (

              <TaskCard
                key={task._id}
                task={task}
                onDelete={onDelete}
                onSelect={onSelect}
                selected={selectedTask?._id === task._id}
              />

            ))}

          </div>

        </SortableContext>

      </div>

      {adding ? (

        <div className="mt-3">

          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            className="w-full mb-2 p-1 rounded bg-gray-800 text-white text-sm"
            placeholder="Task title"
            autoFocus
          />

          <input
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full mb-2 p-1 rounded bg-gray-800 text-white text-sm"
            placeholder="หมวดหมู่"
          />

          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="w-full mb-2 p-1 rounded bg-gray-800 text-white text-sm"
          />

          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="w-full mb-2 p-1 rounded bg-gray-800 text-white text-sm"
          />

          {error && (
            <div className="text-red-400 text-xs mb-2">
              {error}
            </div>
          )}

          {suggestions.length > 0 && (

            <div className="bg-yellow-600 text-black p-2 rounded text-xs mb-2 space-y-2">

              <div className="font-semibold">แนะนำเวลา</div>

              {suggestions.map((s: Suggestion, i: number) => (

                <div key={i} className="bg-yellow-500 p-2 rounded">

                  {new Date(s.suggestedStart).toLocaleString()}
                  {" - "}
                  {new Date(s.suggestedEnd).toLocaleString()}

                  <button
                    onClick={() => {

                      setStartTime(formatInputDate(s.suggestedStart))
                      setEndTime(formatInputDate(s.suggestedEnd))

                      setSuggestions([])
                      setError("")

                    }}
                    className="block mt-2 bg-green-600 text-white px-2 py-1 rounded"
                  >
                    ใช้เวลานี้
                  </button>

                </div>

              ))}

            </div>

          )}

          <div className="flex gap-2 mt-2">

            <button
              onClick={submitAdd}
              className="text-sm text-green-400 hover:text-green-300"
            >
              เพิ่มการ์ด
            </button>

            <button
              onClick={() => {
                setAdding(false)
                setError("")
                setSuggestions([])
              }}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              ยกเลิก
            </button>

          </div>

        </div>

      ) : (

        permission !== "viewer" && (
          <button
            onClick={() => setAdding(true)}
            className="
              mt-4 text-sm text-left
              bg-gray-200 text-black
              hover:bg-gray-300
              dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
            "
          >
            + เพิ่มการ์ด
          </button>
        )

      )}

    </div>
  )
}