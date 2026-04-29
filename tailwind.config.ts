import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景を再び漆黒へ
        void: "#000000", 
        // テキストを純白へ
        moonlight: "#FFFFFF",
        azure: {
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
        },
        bronze: {
          400: "#B48B5E",
          500: "#8B5E3C",
          600: "#6D432A",
        },
        gothic: {
          dark: "#1A1A1A",
          accent: "#4A4A4A",
          silver: "#BDBDBD",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        'geometry-pulse': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 3s infinite linear',
        'slow-spin': 'spin 30s linear infinite',
        'fall': 'fall 10s linear infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25,.46,.45,.94) both infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fall: {
          '0%': { transform: 'translateY(-10vh) translateX(-5vw) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.3' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(110vh) translateX(20vw) rotate(360deg)', opacity: '0' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
