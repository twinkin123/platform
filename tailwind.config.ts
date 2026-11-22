import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#f2f5fa", muted: "#8d99ab", dim: "#5b6675" },
        surface: { DEFAULT: "#07090d", card: "#121821", line: "#1c2431" },
        lime: { DEFAULT: "#b6ff3d", deep: "#3fb800" },
        vio: "#7b5cff",
        pos: "#00e07a",
        neg: "#ff4d5e"
      },
      borderRadius: { sm: "6px", md: "9px", lg: "13px" },
      boxShadow: { lift: "0 10px 24px -12px #000c", sheet: "0 24px 60px -24px #000e" },
      fontFamily: { sans: ["var(--font-inter)", "system-ui"] }
    }
  }
} satisfies Config;
