import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
            "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        border: 'border 4s ease infinite',
      },
      keyframes: {
        border: {
          '0%, 100%': {backgroundPosition: '0% 50%'},
          '50%': {backgroundPosition: '100% 50%'},
        },
      },
      dropShadow: {
        '5px': '0 0 5px rgba(0, 0, 255, 1)',
        '10px': '0 0 10px rgba(0, 0, 255, 1)',
        '15px': '0 0 15px rgba(0, 0, 255, 1)',
        '5px-white': '0 0 5px rgba(255, 255, 255, 1)',
        //'10px-white': '0 0 10px rgba(255, 255, 255, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
