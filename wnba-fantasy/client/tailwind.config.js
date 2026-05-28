/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        wnba: {
          orange: '#F56600',
          blue: '#002D72',
          dark: '#0D1117',
          card: '#161B22',
          border: '#30363D',
          surface: '#21262D',
          muted: '#8B949E',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
