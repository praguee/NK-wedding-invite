import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:     ['var(--font-cormorant)', 'Georgia', 'serif'],
        serif:    ['var(--font-cormorant)', 'Georgia', 'serif'],
        display:  ['var(--font-cinzel)', 'Georgia', 'serif'],
        script:   ['var(--font-great-vibes)', 'cursive'],
      },
    },
  },
  plugins: [],
}

export default config
