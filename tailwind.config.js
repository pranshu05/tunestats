/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'fade-in': {
                  '0%': { opacity: '0', transform: 'translateY(-20px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-delay': {
                  '0%': { opacity: '0', transform: 'translateY(-20px)' },
                  '100%': { opacity: '1', transform: 'translateY(0)' },
                },
              },
              animation: {
                'fade-in': 'fade-in 1s ease-out',
                'fade-in-delay': 'fade-in 1.5s ease-out',
              },
        },
    },
    plugins: [],
};