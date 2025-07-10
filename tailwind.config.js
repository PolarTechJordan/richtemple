/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 新中式配色方案
        rice: '#F2DEB0', // 宣纸色（浅米色/米白色）
        ink: '#2C2C2C',  // 墨色（深灰色）
        'ink-light': '#4A4A4A', // 浅墨色
        'ink-lighter': '#6B6B6B', // 更浅的墨色
        'ink-wash': '#E0D9CC', // 水墨色
        'red-temple': '#8B0000', // 庙宇红
        'gold-temple': '#FFD700', // 金色
        'jade': '#7CB342', // 玉色
      },
      fontFamily: {
        // 中文字体
        song: ['SimSun', 'STSong', 'serif'], // 宋体
        kai: ['KaiTi', 'STKaiti', 'serif'],  // 楷体
        hei: ['SimHei', 'STHeiti', 'sans-serif'], // 黑体
        // 英文字体
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ink-wash': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='none' stroke='%23E0D9CC' stroke-width='0.25'/%3E%3C/svg%3E\")",
      },
      animation: {
        'ripple': 'ripple 1.5s ease-out infinite',
        'ink-spread': 'inkSpread 3s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        inkSpread: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
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
      boxShadow: {
        'ink': '0 4px 6px -1px rgba(44, 44, 44, 0.1), 0 2px 4px -1px rgba(44, 44, 44, 0.06)',
        'ink-lg': '0 10px 15px -3px rgba(44, 44, 44, 0.1), 0 4px 6px -2px rgba(44, 44, 44, 0.05)',
        'temple': '0 0 20px rgba(139, 0, 0, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}; 