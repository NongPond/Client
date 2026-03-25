type Props = {
  message: string
  onClose: () => void
}

export default function AlertModal({ message, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="
          w-[360px]
          bg-white border border-gray-200
          dark:bg-[#0f172a] dark:border-white/10
          rounded-2xl
          shadow-xl dark:shadow-2xl
          p-6
          relative
          animate-fadeIn
          transition-colors duration-200
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* close button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3
            w-8 h-8
            flex items-center justify-center
            rounded-lg
            bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900
            dark:bg-white/5 dark:hover:bg-white/10 dark:text-gray-400 dark:hover:text-white
            transition-colors
          "
        >
          ✕
        </button>

        {/* title */}
        <div className="flex items-center gap-2 mb-3">
          <div className="
            w-7 h-7
            flex items-center justify-center
            rounded-full
            bg-purple-100 text-purple-600
            dark:bg-purple-600/20 dark:text-purple-400
            transition-colors
          ">
            ⚠
          </div>

          <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors">
            แจ้งเตือน
          </h2>
        </div>

        {/* message */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 transition-colors">
          {message}
        </p>

        {/* button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2
              rounded-lg
              bg-gradient-to-r
              from-purple-600 to-indigo-600
              hover:from-purple-700 hover:to-indigo-700
              text-white
              text-sm
              shadow-lg shadow-purple-500/30 dark:shadow-none
              transition-all
            "
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  )
}
