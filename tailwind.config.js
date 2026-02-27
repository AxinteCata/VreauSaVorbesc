/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aac: {
          primary: '#1e3a5f',
          primaryLight: '#2d5a8a',
          surface: '#f0f4f8',
          tile: '#ffffff',
          border: '#c9d4e0',
          success: '#2d6a4f',
          muted: '#64748b'
        }
      },
      minHeight: { tile: '5rem' },
      spacing: { 18: '4.5rem' },
      borderRadius: { card: '1rem', button: '0.75rem' }
    }
  },
  plugins: []
};
