import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 🔥 อนุญาตให้ Render เข้าถึงได้ (หรือใส่ true เพื่ออนุญาตทั้งหมดก็ได้)
    allowedHosts: ['client-104p.onrender.com'], 
  },
  preview: {
    // 🔥 เผื่อไว้ในกรณีที่รันโหมด preview
    allowedHosts: ['client-104p.onrender.com'],
  }
})
