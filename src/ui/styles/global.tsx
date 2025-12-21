import { createGlobalStyle } from "styled-components";
import type { Theme } from "../theme";

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

a {
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: inherit;
}
a:hover {
  color: ${({ theme }) => theme.colors.primaryHover};
}

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
`;
