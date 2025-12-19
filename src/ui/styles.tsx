import styled, { createGlobalStyle } from "styled-components";
import type { Theme } from "./theme";

export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
}

html, body {
  margin: 0;
  padding: 0;
  min-width: 320px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* links/buttons */
a {
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: inherit;
}
a:hover {
  color: ${({ theme }) => theme.colors.primaryHover};
}

/* headings / buttons */
h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: ${({ theme }) => theme.colors.buttonBg};
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: ${({ theme }) => theme.colors.primary};
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

/* small helpers from App.css */
#root {
  margin: 0 auto;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* layout components */
`;

export const AppRoot = styled.div<{ theme: Theme }>`
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
`;

export const Sidebar = styled.aside<{ theme: Theme }>`
  width: 220px;
  min-width: 200px;
  padding-left: ${({ theme }) => theme.spacing.sidebarPadding};
  padding-top: ${({ theme }) => theme.spacing.sidebarPadding};
  padding-bottom: ${({ theme }) => theme.spacing.sidebarPadding};
  box-sizing: border-box;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: ${({ theme }) => theme.spacing.sidebarPadding};
    bottom: ${({ theme }) => theme.spacing.sidebarPadding};
    width: 1px;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      ${({ theme }) => theme.colors.divider},
      rgba(255, 255, 255, 0)
    );
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.dividerHighlight};
    opacity: 0.7;
    pointer-events: none;
    transition: opacity 160ms ease, box-shadow 160ms ease;
  }

  &:hover::after {
    opacity: 1;
    box-shadow: 0 0 18px ${({ theme }) => theme.colors.dividerHighlight};
  }

  h2 {
    margin: 0 0 0.75rem 0;
    font-size: 1.1rem;
  }

  nav a {
    position: relative;
    display: block;
    padding: 0.6rem 0.9rem 0.6rem calc(0.9rem + 8px);
    margin: 0.25rem 0;
    color: inherit;
    text-decoration: none;
    border-radius: ${({ theme }) => theme.radii.default};
    transition: background 160ms ease, transform 120ms ease, color 160ms ease;
    font-weight: 500;
    box-sizing: border-box;
  }

  nav a::before {
    content: "";
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 56%;
    border-radius: 2px;
    background: transparent;
    transition: background 160ms ease, box-shadow 160ms ease, opacity 160ms ease;
    opacity: 0;
  }

  nav a:hover {
    background: ${({ theme }) => theme.colors.linkHoverBg};
    transform: translateX(4px);
  }

  nav a:focus-visible {
    outline: 3px solid rgba(100, 108, 255, 0.16);
    outline-offset: 2px;
  }

  nav a.active {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    box-shadow: ${({ theme }) => theme.shadows.active};
  }
  nav a.active::before {
    background: ${({ theme }) => theme.colors.primary};
    opacity: 1;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 640px) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: ${({ theme }) => theme.spacing.sidebarMobilePadding};

    nav {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;
    }

    nav a {
      padding: 0.4rem 0.6rem;
    }
    nav a::before {
      display: none;
    }
  }
`;

export const MainContent = styled.main<{ theme: Theme }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.mainPadding};
  box-sizing: border-box;
`;
