import { useNavigate } from "react-router-dom";

export default function GuestHome() {
  const navigate = useNavigate();

  return (
    <div className="
      min-h-screen
      bg-[#f8fafc] dark:bg-[#0b1324] 
      text-[#091E42] dark:text-white
      font-sans
      selection:bg-blue-200 selection:text-blue-900
    ">

      {/* ===== NAVBAR (Glassmorphism) ===== */}
      {/* 🛠️ แก้ไข: ปรับ px-4 สำหรับมือถือ และลด py ลงนิดหน่อย */}
      <div className="
        flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3 sm:py-4
        bg-white/80 dark:bg-[#0b1324]/80 backdrop-blur-md
        border-b border-gray-200/60 dark:border-gray-800
        sticky top-0 z-50 transition-all
      ">
        {/* LEFT: Logo & Menus */}
        <div className="flex items-center gap-2 sm:gap-8">
          {/* 🛠️ แก้ไข: ลดขนาด text โลโก้ในมือถือเป็น text-lg (เดิม 2xl) และไอคอนเป็น 2xl (เดิม 3xl) */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-lg sm:text-2xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer hover:opacity-80 transition">
            <span className="text-2xl sm:text-3xl drop-shadow-sm">🧩</span> 
            {/* 🛠️ แก้ไข: ใช้ whitespace-nowrap ป้องกันการตกบรรทัด */}
            <span className="tracking-tight whitespace-nowrap">Task Management</span> 
          </div>
        </div>

        {/* RIGHT: Auth Buttons */}
        {/* 🛠️ แก้ไข: ลด gap และบังคับไม่ให้บีบปุ่ม (shrink-0) */}
        <div className="flex gap-2 sm:gap-4 items-center shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="
                bg-[#1e293b] text-white 
                px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl font-medium text-xs sm:text-[15px]
                hover:bg-[#0f172a] hover:shadow-lg hover:shadow-gray-900/30 
                hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap
            "
          >
            เข้าสู่ระบบ
          </button>
          <button
            onClick={() => navigate("/register")}
            className="
                bg-blue-600 text-white 
                px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl font-medium text-xs sm:text-[15px]
                hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 
                hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap
            "
          >
            สมัครสมาชิก
          </button>
        </div>
      </div>

      {/* ===== HERO SECTION ===== */}
      {/* 🛠️ แก้ไข: ปรับ py สำหรับมือถือไม่ให้ห่างเกินไป */}
      <div className="
        max-w-[1200px] mx-auto
        flex flex-col lg:flex-row items-center justify-between
        px-6 lg:px-12 py-10 sm:py-16 lg:py-28 gap-10 lg:gap-8
      ">

        {/* LEFT CONTENT */}
        <div className="w-full lg:w-7/12 space-y-6 sm:space-y-8 relative z-10 text-center lg:text-left">
          {/* 🛠️ แก้ไข: ลดขนาด Heading มือถือเป็น text-3xl */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.3] sm:leading-[1.25] tracking-tight">
            <span className="text-gray-900 dark:text-white block sm:inline">
                จัดการงานง่าย ไร้รอยต่อ
            </span>{" "}
            ไม่มีสะดุดเรื่องเวลา เปลี่ยนความวุ่นวายให้เป็นความสำเร็จ
          </h1>

          <p className="text-base sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
            ลากและวางงานของคุณบนกระดาน Kanban ทำงานร่วมกับทีมได้อย่างอิสระ พร้อมระบบผู้ช่วยแนะนำเวลาว่างที่ทำให้คุณไม่พลาดทุกกำหนดการสำคัญ
          </p>

          {/* EMAIL INPUT FORM */}
          <div className="pt-2 max-w-lg mx-auto lg:mx-0">
            <div className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-gray-900 shadow-lg shadow-blue-900/5 rounded-2xl border border-gray-200 dark:border-gray-800 p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
              <input
                type="email"
                placeholder="กรอกอีเมลของคุณ..."
                className="
                  flex-1 px-4 py-3 rounded-xl 
                  bg-transparent
                  text-gray-900 dark:text-white placeholder-gray-400
                  focus:outline-none
                "
              />
              <button
                onClick={() => navigate("/register")}
                className="
                  bg-blue-600 hover:bg-blue-700
                  text-white font-medium text-base 
                  px-6 py-3 rounded-xl 
                  shadow-md shadow-blue-600/20
                  transition-all duration-200 hover:-translate-y-0.5
                  whitespace-nowrap 
                "
              >
                เริ่มใช้งานฟรี
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end lg:translate-x-12 mt-4 lg:mt-0">
          {/* Decorator Blur Blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-400/30 via-purple-400/20 to-orange-300/20 blur-3xl rounded-full -z-10 dark:opacity-50"></div>
          
          <img
            src="1.png"
            alt="Task Management App Preview"
            className="
            relative z-10 w-full h-auto max-w-md lg:max-w-full
            rounded-2xl border border-gray-200/50 dark:border-gray-700/50
            shadow-2xl shadow-blue-900/10 dark:shadow-black/50
            transform hover:-translate-y-2 hover:scale-[1.02]
            transition-all duration-500
          "
          />
        </div>

      </div>

      {/* ===== FEATURES SHOWCASE SECTION ===== */}
      <div className="relative bg-white dark:bg-[#0f172a] py-16 lg:py-28 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
            <h2 className="text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase text-sm">Features</h2>
            <h3 className="text-2xl sm:text-4xl font-bold text-[#091E42] dark:text-white">
              ฟีเจอร์ครบครันเพื่อประสิทธิภาพสูงสุด
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Cards (เนื้อหาเดิม ไม่เปลี่ยน) */}
            <div className="group bg-gray-50 dark:bg-[#1e293b] p-8 rounded-3xl hover:bg-white dark:hover:bg-[#0b1324] hover:shadow-2xl hover:shadow-blue-900/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">👥</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">จัดการบอร์ดและทีม</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2.5">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> หน้ารวมบอร์ดงานทั้งหมด</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> สร้างและจัดการสิทธิ์สมาชิก</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> เชิญเข้าร่วมผ่านอีเมล/ลิงก์</li>
              </ul>
            </div>

            <div className="group bg-gray-50 dark:bg-[#1e293b] p-8 rounded-3xl hover:bg-white dark:hover:bg-[#0b1324] hover:shadow-2xl hover:shadow-purple-900/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">📋</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Smart Kanban</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2.5">
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">✓</span> ลากและวาง (Drag & Drop)</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">✓</span> ตรวจสอบเวลาซ้ำอัจฉริยะ</li>
                <li className="flex items-start gap-2"><span className="text-purple-500 mt-0.5">✓</span> ระบบแนะนำเวลาว่าง</li>
              </ul>
            </div>

            <div className="group bg-gray-50 dark:bg-[#1e293b] p-8 rounded-3xl hover:bg-white dark:hover:bg-[#0b1324] hover:shadow-2xl hover:shadow-orange-900/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">📅</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">มุมมองปฏิทิน</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2.5">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> ดูตารางปฏิทินรวม</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> กรองดูงานแบบแยกหมวดหมู่</li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-0.5">✓</span> ดาวน์โหลดรูปภาพปฏิทิน</li>
              </ul>
            </div>

            <div className="group bg-gray-50 dark:bg-[#1e293b] p-8 rounded-3xl hover:bg-white dark:hover:bg-[#0b1324] hover:shadow-2xl hover:shadow-teal-900/5 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform">🔔</div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">ระบบแจ้งเตือน</h4>
              <ul className="text-gray-600 dark:text-gray-400 text-sm space-y-2.5">
                <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">✓</span> ดูรายการแจ้งเตือนทั้งหมด</li>
                <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">✓</span> เปลี่ยนธีมสว่าง/มืด ได้</li>
                <li className="flex items-start gap-2"><span className="text-teal-500 mt-0.5">✓</span> ตั้งค่ารับการแจ้งเตือน</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ===== FINAL CALL-TO-ACTION SECTION ===== */}
      <div className="relative py-16 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-900"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 dark:from-blue-800 dark:to-indigo-950 opacity-90"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6 sm:space-y-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight">
            พร้อมหลีกหนีความยุ่งเหยิงและปลดปล่อยศักยภาพการทำงานของคุณหรือยัง?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto">
            เริ่มต้นใช้งานฟรีวันนี้ ไม่ต้องติดตั้งโปรแกรม ใช้งานได้ทันทีบนเบราว์เซอร์ของคุณ
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate("/register")}
              className="
                bg-white text-blue-600 font-bold text-base sm:text-lg 
                px-8 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-xl shadow-black/10
                hover:bg-gray-50 hover:shadow-2xl hover:-translate-y-1
                transition-all duration-300 whitespace-nowrap
              "
            >
              เริ่มต้นใช้งานฟรีทันที
            </button>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="
        bg-white dark:bg-[#0b1324]
        border-t border-gray-100 dark:border-gray-800
        px-6 lg:px-12 py-8
      ">
        <div className="max-w-[1200px] mx-auto flex flex-col justify-center items-center gap-4">
          <div className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200">
            <span className="text-xl sm:text-2xl mr-1">🧩</span> Task Management
          </div>
        </div>
      </footer>

    </div>
  );
}