import { useEffect, useState, useRef } from "react"; // ✅ 1. เพิ่ม useRef
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios"; 

export default function Verify() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); 

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  
  // ✅ 2. สร้างตัวแปรกันการยิง API ซ้ำ
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const confirmEmail = async () => {
      // ✅ 3. ถ้าเคยยิง API ไปแล้ว ให้หยุดทำงานทันที (ป้องกัน React ยิงเบิ้ล 2 รอบ)
      if (hasFetched.current) return; 
      hasFetched.current = true;

      try {
        await axios.post("http://localhost:5000/api/auth/verify", {
          token: token 
        });
        
        setStatus("success"); // สำเร็จ!
      } catch (error) {
        console.error("Verification Error:", error);
        setStatus("error"); // ล้มเหลว!
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] px-4">
      <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
        
        {/* กำลังโหลด */}
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">กำลังยืนยันอีเมล...</h2>
            <p className="text-slate-400">กรุณารอสักครู่ ระบบกำลังตรวจสอบข้อมูลของคุณ</p>
          </>
        )}

        {/* สำเร็จ */}
        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">ยืนยันอีเมลสำเร็จ!</h2>
            <p className="text-slate-400 mb-8">บัญชีของคุณพร้อมใช้งานแล้ว ตอนนี้คุณสามารถเข้าสู่ระบบได้เลย</p>
            <Link to="/Login" className="block w-full py-3 px-4 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors">
              ไปหน้าเข้าสู่ระบบ
            </Link>
          </>
        )}

        {/* เกิดข้อผิดพลาด */}
        {status === "error" && (
          <>
             <div className="w-20 h-20 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">ลิงก์ไม่ถูกต้องหรือหมดอายุ</h2>
            <p className="text-slate-400 mb-8">ไม่สามารถยืนยันอีเมลได้ ลิงก์นี้อาจถูกใช้งานไปแล้ว หรือหมดอายุการใช้งาน</p>
            <Link to="/Register" className="block w-full py-3 px-4 rounded-xl font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-colors">
              กลับไปหน้าสมัครสมาชิก
            </Link>
          </>
        )}

      </div>
    </div>
  );
}