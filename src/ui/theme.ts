const theme = {
  colors: {
    background: "#120612",
    surface: "#1a0d1a",
    text: "#fff6fb",
    textSecondary: "#b399a8",
    primary: "#ffb3d9",
    primaryHover: "#ff85c2",
    buttonBg: "#200814",
    linkHoverBg: "rgba(255,179,217,0.08)",
    activeGradient:
      "linear-gradient(90deg, rgba(255,179,217,0.12), rgba(255,223,230,0.04))",
    divider: "rgba(255,179,217,0.06)",
    dividerHighlight: "rgba(255,182,215,0.08)",
    border: "#33243a",
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
    active: "0 6px 18px rgba(255,128,178,0.24)",
  },
} as const;

export type Theme = typeof theme;
export default theme;
