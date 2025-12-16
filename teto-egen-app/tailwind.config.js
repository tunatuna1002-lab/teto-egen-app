/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // 팔레트 A (러블리 노을)
        'lovely-purple': '#8B7FFF',
        'lovely-pink': '#FF6FAE',
        'lovely-blue': '#6B7CFF',
        'lovely-bg': '#F7F8FF',
        
        // 팔레트 B (미니멀 파스텔)
        'minimal-mint': '#2DD4BF',
        'minimal-sky': '#60A5FA',
        'minimal-bg': '#F8FAFF',
        
        // 공용
        'glass-white': 'rgba(255, 255, 255, 0.75)',
        'glass-border': 'rgba(255, 255, 255, 0.7)',
        'glass-shadow': 'rgba(0, 0, 0, 0.06)',
        'charcoal': '#0f172a',
        'charcoal-light': '#334155',
      },
      backdropBlur: {
        'glass': '18px',
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}