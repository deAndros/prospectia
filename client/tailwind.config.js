/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#09090b', // zinc-950
        surface: '#18181b', // zinc-900
        border: '#27272a', // zinc-800
        primary: '#6366f1', // indigo-500
        'primary-hover': '#4f46e5', // indigo-600
        text: '#fafafa', // zinc-50
        'text-muted': '#a1a1aa', // zinc-400
      }
    },
  },
  plugins: [],
}
