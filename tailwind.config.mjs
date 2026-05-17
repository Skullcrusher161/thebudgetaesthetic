/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:    "#0F0F0F",
        paper:  "#F7F5F0",
        warm:   "#EDE8DF",
        slate:  "#2A2F35",
        steel:  "#4A5260",
        accent: "#C8A96A",
        glow:   "#7DD3C8",
        dim:    "#8A8F98",
      },
      fontFamily: {
        display: ["'Syne'", "system-ui", "sans-serif"],
        mono:    ["'DM Mono'", "'Courier New'", "monospace"],
        serif:   ["'Instrument Serif'", "Georgia", "serif"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        glass:        "0 4px 24px rgba(15,15,15,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
        card:         "0 2px 16px rgba(15,15,15,0.06), 0 1px 4px rgba(15,15,15,0.04)",
        "card-hover": "0 12px 48px rgba(15,15,15,0.12), 0 4px 12px rgba(15,15,15,0.06)",
        "btn-accent": "0 4px 18px rgba(200,169,106,0.35)",
        glow:         "0 0 20px rgba(125,211,200,0.25)",
      },
      animation: {
        "fade-up":    "fadeUp 0.65s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in":    "fadeIn 0.5s ease both",
        "slide-down": "slideDown 0.35s ease both",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:      { from: { opacity: 0, transform: "translateY(20px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
        slideDown:   { from: { opacity: 0, transform: "translateY(-10px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        "pulse-glow":{ "0%,100%": { boxShadow: "0 0 0 0 rgba(125,211,200,0.3)" }, "50%": { boxShadow: "0 0 0 8px rgba(125,211,200,0)" } },
      },
      typography: (theme) => ({
        tba: {
          css: {
            "--tw-prose-body":    theme("colors.slate"),
            "--tw-prose-headings":theme("colors.ink"),
            "--tw-prose-links":   theme("colors.accent"),
            color: theme("colors.slate"),
            fontFamily: theme("fontFamily.mono").join(", "),
            lineHeight: "1.85",
            "h1,h2,h3,h4": { fontFamily: theme("fontFamily.display").join(", ") },
            a: { color: theme("colors.accent"), textDecorationColor: theme("colors.accent"), textUnderlineOffset: "3px" },
            blockquote: { borderLeftColor: theme("colors.accent"), fontFamily: theme("fontFamily.serif").join(", "), fontStyle: "italic" },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
