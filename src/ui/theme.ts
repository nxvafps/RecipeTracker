const theme = {
  colors: {
    // dark pastel purple background
    background: "#0f0b14",
    // light pastel text for contrast on dark background
    text: "#f4ecff",
    // soft pastel lavender primary (links, accents)
    primary: "#caa6ff",
    // slightly deeper for hover states
    primaryHover: "#b083ff",
    // dark-but-warm button background
    buttonBg: "#15101a",
    // subtle hover background for links (light pastel glow)
    linkHoverBg: "rgba(202,166,255,0.08)",
    // soft gradient mixing pastel purple & pink for active states (subtle on dark)
    activeGradient:
      "linear-gradient(90deg, rgba(202,166,255,0.12), rgba(255,182,215,0.04))",
    divider: "rgba(255,255,255,0.08)",
    dividerHighlight: "rgba(202,166,255,0.06)",
  },
  spacing: {
    sidebarPadding: "1rem",
    sidebarMobilePadding: "0.75rem",
    mainPadding: "2rem",
  },
  radii: {
    default: "8px",
  },
  shadows: {
    // slightly stronger, tinted shadow to read on dark backgrounds
    active: "0 6px 18px rgba(88, 44, 150, 0.36)",
  },
} as const;

export type Theme = typeof theme;
export default theme;
