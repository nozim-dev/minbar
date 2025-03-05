/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    boxShadow: {
      shadowInput: "0px 1px 3px 0 rgba(0,0,0,10%)"
    },
    fontFamily: {
      openSans: "Open Sans",
      PTserif: "PT Serif",
    },
    backgroundImage: {
      ReadMoreBtn: "linear-gradient(rgba(255,255,255,75%),rgba(255,255,255))",
      profileImage: "url('./images/profile.jpg')",
      coverImage: "url('./images/banner.avif')",
    }
  },
  plugins: [],
}