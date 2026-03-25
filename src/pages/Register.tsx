import { useState } from "react";
import { register } from "../services/authService";
import { Link } from "react-router-dom"; // เอา useNavigate ออก เพราะเราจะไม่ให้มันเด้งไป Login ทันที

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [success, setSuccess] = useState(false); // เปลี่ยนเป็น boolean เพื่อสลับหน้า UI
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // เพิ่มสถานะกำลังโหลด

  // 🛡️ ฟังก์ชันตรวจสอบรูปแบบอีเมล (เวอร์ชันดักคำพิมพ์ผิด)
  const isValidEmail = (email: string) => {
    // 1. เช็ค Format พื้นฐานก่อนว่ามี @ และ .
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;

    // 2. แปลงเป็นพิมพ์เล็กทั้งหมดเพื่อเช็คคำผิด
    const lowerEmail = email.toLowerCase();

    // 3. รายชื่อคำลงท้ายที่คนมักพิมพ์ผิด
    const invalidEndings = [
      ".comm", 
      ".con", 
      ".coom", 
      ".cmo", 
      ".gmial.com", 
      ".gamil.com"
    ];

    // ถ้าอีเมลลงท้ายด้วยคำผิดเหล่านี้ ให้ return false (ไม่ผ่าน)
    const hasTypo = invalidEndings.some(ending => lowerEmail.endsWith(ending));
    if (hasTypo) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // 1. ตรวจสอบรูปแบบอีเมลก่อนส่งไป Backend
    if (!isValidEmail(form.email)) {
      setError("รูปแบบอีเมลไม่ถูกต้อง กรุณาใช้อีเมลจริง");
      return;
    }

    // 2. ตรวจสอบความยาวรหัสผ่าน (เผื่อไว้)
    if (form.password.length < 8) {
      setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setIsLoading(true);

    try {
      await register(form);
      // เปลี่ยนสถานะเป็นสำเร็จ เพื่อแสดงหน้าจอให้ไปเช็คอีเมล
      setSuccess(true);
    } catch {
      setError("อีเมลนี้อาจถูกใช้งานไปแล้ว หรือเกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ ถ้าสมัครสำเร็จ (ส่งข้อมูลให้ Backend แล้ว) ให้เปลี่ยน UI เป็นหน้าแจ้งเตือนเช็คอีเมล
  if (success) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a] px-4">
        {/* 🛡️ ใส่แอนิเมชัน zoom-in duration-500 กลับมาที่กล่อง */}
        <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-in fade-in slide-in-from-bottom-12 duration-700 ease-out">
          <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          {/* 🛡️ ใส่ transition-none ป้องกันตัวหนังสือย่อ/ขยายทับซ้อน */}
          <h2 className="text-2xl font-bold text-white mb-4 transition-none">ตรวจสอบอีเมลของคุณ</h2>
          <p className="text-slate-400 mb-8 leading-relaxed transition-none">
            เราได้ส่งลิงก์ยืนยันตัวตนไปที่ <span className="text-emerald-400 font-medium transition-none">{form.email}</span> แล้ว กรุณาคลิกลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชีของคุณ
          </p>
          <Link 
            to="/Login" 
            className="block w-full py-3 px-4 rounded-xl font-semibold text-white bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </div>
      </div>
    );
  }

  // 🖥️ UI หน้าสมัครสมาชิกปกติ
  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#0f172a]">
      {/* LEFT : REGISTER FORM */}
      <div className="flex items-center justify-center px-8 sm:px-16 lg:px-24">
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Get Started Now</h1>
          <p className="text-slate-400 mb-8 text-sm leading-relaxed">
            Create your account to start managing tasks and collaborate with your team.
          </p>

          {/* ❌ Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 p-4 text-sm animate-in shake duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl text-white bg-[#1e293b] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full px-4 py-3 rounded-xl text-white bg-[#1e293b] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-white bg-[#1e293b] border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-50 disabled:cursor-wait shadow-lg shadow-emerald-500/20 transform active:scale-[0.98] transition-all duration-200"
            >
              {isLoading ? "กำลังสร้างบัญชี..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center mt-8 text-slate-400">
            Already have an account? <Link to="/Login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>

      {/* RIGHT : ILLUSTRATION */}
      <div className="hidden md:block relative h-full w-full bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent opacity-30 z-10 pointer-events-none"></div>
        <img
          src="https://i.pinimg.com/1200x/92/7f/4d/927f4def98ce7e53ce822be34f0e1be6.jpg"
          alt="Register Illustration"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}