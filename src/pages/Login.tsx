import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login({ email, password });

      // 🔥 เก็บ token
      localStorage.setItem("token", res.token);

      setSuccess(true);

      setTimeout(() => {
        navigate("/boards");
      }, 1000);

    } catch {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <>
      {/* ✅ SUCCESS BANNER : ปรับแต่งเป็นสไตล์ Glassmorphism มีแอนิเมชันสไลด์ลงมา */}
      {success && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-8 fade-in duration-300">
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md text-emerald-400 px-6 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/10 text-sm font-semibold tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            เข้าสู่ระบบสำเร็จ กำลังนำพาท่านไป...
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-[#0f172a]">
        
        {/* LEFT : LOGIN FORM */}
        <div className="flex items-center justify-center px-8 sm:px-16 lg:px-24">
          <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header */}
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">
              Enter your credentials to access your account and continue your work.
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
              
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Email address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="
                    w-full px-4 py-3 rounded-xl text-white
                    bg-[#1e293b] border border-slate-700
                    placeholder:text-slate-500
                    focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                    transition-all duration-200
                  "
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300">Password</label>
                  
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="
                    w-full px-4 py-3 rounded-xl text-white
                    bg-[#1e293b] border border-slate-700
                    placeholder:text-slate-500
                    focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500
                    transition-all duration-200
                  "
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={success}
                className="
                  w-full mt-2 py-3 px-4 rounded-xl font-semibold text-white
                  bg-gradient-to-r from-emerald-500 to-green-600
                  hover:from-emerald-400 hover:to-green-500
                  disabled:opacity-50 disabled:cursor-wait
                  shadow-lg shadow-emerald-500/20
                  transform active:scale-[0.98] transition-all duration-200
                "
              >
                {success ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="text-sm text-center mt-8 text-slate-400">
              Don’t have an account?{" "}
              <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* RIGHT : ILLUSTRATION */}
        <div className="hidden md:block relative h-full w-full bg-slate-100">
          {/* เพิ่ม Gradient overlay เบาๆ ให้รูปดูเนียนเข้ากับ Dark mode ทางซ้าย */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-transparent opacity-30 z-10 pointer-events-none"></div>
          <img
            src="image.png"
            alt="Login Illustration"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

      </div>
    </>
  );
}
