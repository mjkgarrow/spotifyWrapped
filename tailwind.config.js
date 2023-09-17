/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin': 'spin 2s ease-in-out infinite',
      },
      height: {
        screen: ['100vh', '100dvh'],
      },

    },
  },
}