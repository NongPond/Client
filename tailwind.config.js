/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      
      fontFamily: {
        sans: ['Prompt', 'sans-serif'], // ตั้งเป็นฟอนต์หลัก
      },

      /* ===== COLORS ===== */
      colors: {
        darkBg: "#0f172a",
        darkCard: "#020617"
      },

      /* ===== SHADOW ===== */
      boxShadow: {
        modal: "0 20px 60px rgba(0,0,0,0.5)"
      },

      /* ===== ANIMATION ===== */
      animation: {
        modal: "modal .2s ease-out",
        fade: "fade .25s ease-out"
      },

      keyframes: {
        modal: {
          "0%": {
            opacity: "0",
            transform: "scale(.95)"
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)"
          }
        },

        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        }
      }

    },
  },
  plugins: [],
}