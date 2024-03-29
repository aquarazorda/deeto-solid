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
        'primary-input': "rgba(59, 0, 135, 0.22) 0px 0px 0.625rem inset",
        'ref-box': "rgba(0, 0, 0, 0.1) 0px 0.25rem 0.375rem -0.063rem, rgba(0, 0, 0, 0.05) 0px 0.125rem 0.25rem -0.125rem"
      },
      animation: {
        'contentShow': 'contentShow 250ms ease-out',
        'contentHide': 'contentHide 250ms ease-in forwards',
        'rotate': 'rotate 2s linear infinite',
        'dash': 'dash 1.5s ease-in-out infinite'
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
        rotate: {
          to: {
            transform: 'rotate(360deg)'
          }
        },
        dash: {
          "0%": {
            "stroke-dasharray": "1, 150",
            "stroke-dashoffset": 0
          },
          "50%": {
            "stroke-dasharray": "90, 150",
            "stroke-dashoffset": -35
          },
          "100%": {
            "stroke-dasharray": "90, 150",
            "stroke-dashoffset": -124
          }
        }
      },
    },
    colors: {
      "white": "#FFFFFF",
      "primary-purple": "#481453",
      "primary-yellow": "#ffc400",
      "purple-dark": "#2e1334",
      "yellow-bg": "rgba(255, 255, 255, 0.65)",
      "black": "black",
      "white-900": "#F9F8FA",
      "secondary-green": "#00ba55"
    },
    fontFamily: {
      sans: "DM Sans, sans-serif",
      inter: "Inter, sans-serif",
    },
  },
  plugins: [
    require("@kobalte/tailwindcss")
  ],
};
