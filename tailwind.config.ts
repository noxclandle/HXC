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
        // 背景色を白（オフホワイト）ベースへ
        void: "#F8F9FA", 
        // テキスト色を濃いグレー/紺へ
        moonlight: "#1E293B",
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
          dark: "#FFFFFF",
          accent: "#E2E8F0",
          silver: "#94A3B8",
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
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
