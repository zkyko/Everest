import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B2B2B',
        'primary-dark': '#1A1A1A',
        accent: '#F4A261',
        'accent-dark': '#E76F51',
        'bg-main': '#FAFAFA',
        'bg-surface': '#FFFFFF',
        'bg-card': '#FFFFFF',
        'bg-elevated': '#F5F5F5',
        'bg-dark': '#2B2B2B',
        'text-main': '#1A1A1A',
        'text-muted': '#6B6B6B',
        'text-dim': '#9B9B9B',
        'text-light': '#FFFFFF',
        'status-low': '#10B981',
        'status-medium': '#F59E0B',
        'status-high': '#F97316',
        'status-very-high': '#EF4444',
        border: '#E5E5E5',
        'border-dark': '#D4D4D4',
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        'l': '12px',
        'm': '8px',
        's': '6px',
      },
    },
  },
  plugins: [],
}
export default config

