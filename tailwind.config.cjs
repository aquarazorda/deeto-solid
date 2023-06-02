/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "yellow-red": "url('/assets/bg/yellow_red.svg')"
      },
      borderRadius: {
        "no-left-top": "0rem 2.5rem 2.5rem",
      },
      boxShadow: {
        'primary-input': "rgba(59, 0, 135, 0.22) 0px 0px 0.625rem inset" 
      },
      animation: {
        'contentShow': 'contentShow 250ms ease-out',
        'contentHide': 'contentHide 250ms ease-in forwards',
      },
      keyframes: {
        contentShow: {
          from: {
            opacity: 0,
            transform: 'scale(0.96)',
          },
          to: {
            opacity: 1,
            transform: 'scale(1)',
          },
        },
        contentHide: {
          from: {
            opacity: 1,
            transform: 'scale(1)',
          },
          to: {
            opacity: 0,
            transform: 'scale(0.96)',
          },
        },
      },
    },
    colors: {
      "white": "#FFFFFF",
      "primary-purple": "#481453",
      "primary-yellow": "#ffc400",
      "yellow-bg": "rgba(255, 255, 255, 0.65)"
    },
    fontFamily: {
      sans: "DM Sans, sans-serif",
      inter: "Inter, sans-serif",
    }
  },
  plugins: [
    require("@kobalte/tailwindcss")
  ],
};
