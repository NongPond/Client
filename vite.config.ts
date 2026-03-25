import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['client-1-f85a.onrender.com'], // เพิ่มบรรทัดนี้เข้าไปครับ
    // หรือถ้าขี้เกียจพิมพ์ชื่อเว็บยาวๆ จะใส่เป็น allowedHosts: true ก็ได้ครับ
  }
})
