import type { Config } from "tailwindcss"

export default {
  content: ["./contents/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}", "./popup.tsx"],
  theme: { extend: {} },
  plugins: []
} satisfies Config
