import styled from "styled-components";
import type { Theme } from "../theme";

export const AppRoot = styled.div<{ theme: Theme }>`
  display: flex;
  min-height: 100vh;
  width: 100%;
  margin: 0;
`;

export const MainContent = styled.main<{ theme: Theme }>`
  flex: 1;
  margin-left: 220px;
  padding: ${({ theme }) => theme.spacing.mainPadding};
  box-sizing: border-box;
  overflow-y: auto;
  height: 100vh;
`;
