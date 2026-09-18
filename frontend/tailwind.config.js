/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f0f7ff',
          100: '#e0effe',
          500: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
          950: '#082f49',
        },
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        vital: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        med: {
          bg: '#0A0A0F',
          card: '#12121A',
          nested: '#1A1A24',
          border: '#2B2B3E',
          subtleBorder: '#1F1F2E',
          lime: '#C9F24B',
          purple: '#8B5CF6',
          blue: '#3B82F6',
          text: '#F2F2F5',
          muted: '#A0A0B0',
          subtle: '#6B7280',
          red: '#FF4D4D',
          green: '#4ADE80',
          amber: '#FBBF24',
        }
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite'
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(100%)' }
        }
      }
    },
  },
  plugins: [],
}

