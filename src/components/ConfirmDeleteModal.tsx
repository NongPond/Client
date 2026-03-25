type Props = {
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDeleteModal({
  title = "ลบการ์ด",
  message = "การ์ดนี้จะถูกลบออกจากบอร์ดอย่างถาวร และไม่สามารถกู้คืนได้",
  onConfirm,
  onCancel
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">

      <div className="
        w-[380px] 
        bg-white border border-gray-200
        dark:bg-[#0f172a] dark:border-white/10 
        rounded-2xl 
        shadow-xl dark:shadow-2xl 
        p-6 
        animate-fadeIn
        transition-colors duration-200
      ">

        {/* header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
            {title}
          </h2>

          <button
            onClick={onCancel}
            className="
              w-8 h-8 flex items-center justify-center rounded-lg 
              bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900
              dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-400 dark:hover:text-white 
              transition-colors
            "
          >
            ✕
          </button>
        </div>

        {/* message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 transition-colors">
          {message}
        </p>

        {/* buttons */}
        <div className="flex justify-end gap-3">

          <button
            onClick={onCancel}
            className="
              px-4 py-2
              rounded-lg
              bg-white hover:bg-gray-50 border border-gray-300 text-gray-700
              dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-gray-300
              text-sm
              transition-colors
            "
          >
            ยกเลิก
          </button>

          <button
            onClick={onConfirm}
            className="
              px-4 py-2
              rounded-lg
              bg-gradient-to-r
              from-red-600 to-red-500
              hover:from-red-700 hover:to-red-600
              text-white
              text-sm
              shadow-lg shadow-red-500/30 dark:shadow-none
              transition-all
            "
          >
            ลบ
          </button>

        </div>

      </div>

    </div>
  )
}