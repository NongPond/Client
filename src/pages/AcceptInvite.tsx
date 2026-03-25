import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AcceptInvite() {

  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("กำลังยอมรับคำเชิญ...");

  useEffect(() => {

    const acceptInvite = async () => {

      const authToken = localStorage.getItem("token");

      /* ===== NOT LOGIN ===== */

      if (!authToken) {

        setMessage("กรุณาเข้าสู่ระบบก่อน");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1500);

        return;

      }

      /* ===== NO TOKEN ===== */

      if (!token) {

        setMessage("ลิงก์เชิญไม่ถูกต้อง");

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1500);

        return;

      }

      try {

        const res = await axios.get(
          `http://localhost:5000/api/tasks/invite/${token}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          }
        );

        if (res.data?.boardId) {

          setMessage("เข้าร่วมบอร์ดสำเร็จ 🎉");

        } else {

          setMessage("รับคำเชิญเรียบร้อย");

        }

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 1200);

      } catch (err: any) {

        console.error("Invite error:", err);

        setMessage(
          err?.response?.data?.message ||
          "ไม่สามารถรับคำเชิญได้"
        );

        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);

      }

    };

    acceptInvite();

  }, [token, navigate]);



  return (

    <div className="h-screen flex items-center justify-center text-white bg-gray-900">

      <div className="bg-gray-800 px-8 py-6 rounded-xl shadow-lg text-center">

        <div className="text-lg font-medium mb-2">
          📩 Invite
        </div>

        <div className="text-gray-300 text-sm">
          {message}
        </div>

      </div>

    </div>

  );

}
