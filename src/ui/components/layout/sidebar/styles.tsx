import styled, { css } from "styled-components";
import type { Theme } from "../../../theme";

const dividerGlowStyles = css`
  content: "";
  position: absolute;
  right: 0;
  top: ${({ theme }: { theme: Theme }) => theme.spacing.sidebarPadding};
  bottom: ${({ theme }: { theme: Theme }) => theme.spacing.sidebarPadding};
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    ${({ theme }: { theme: Theme }) => theme.colors.divider},
    rgba(255, 255, 255, 0)
  );
  box-shadow: 0 0 10px
    ${({ theme }: { theme: Theme }) => theme.colors.dividerHighlight};
  opacity: 0.7;
  pointer-events: none;
  transition: opacity 160ms ease, box-shadow 160ms ease;
`;

const activeIndicatorStyles = css`
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
`;

export const SidebarContainer = styled.aside<{ theme: Theme }>`
  width: 220px;
  min-width: 200px;
  padding-left: ${({ theme }) => theme.spacing.sidebarPadding};
  padding-top: ${({ theme }) => theme.spacing.sidebarPadding};
  padding-bottom: ${({ theme }) => theme.spacing.sidebarPadding};
  box-sizing: border-box;
  position: relative;

  &::after {
    ${dividerGlowStyles}
  }

  &:hover::after {
    opacity: 1;
    box-shadow: 0 0 18px ${({ theme }) => theme.colors.dividerHighlight};
  }

  @media (max-width: 640px) {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: ${({ theme }) => theme.spacing.sidebarMobilePadding};
  }
`;

export const SidebarTitle = styled.h2`
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
`;

export const SidebarNav = styled.nav`
  @media (max-width: 640px) {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
  }
`;

export const SidebarNavLink = styled.a`
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

  &::before {
    ${activeIndicatorStyles}
  }

  &:hover {
    background: ${({ theme }) => theme.colors.linkHoverBg};
    transform: translateX(4px);
  }

  &:focus-visible {
    outline: 3px solid rgba(100, 108, 255, 0.16);
    outline-offset: 2px;
  }

  &.active {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    box-shadow: ${({ theme }) => theme.shadows.active};
  }

  &.active::before {
    background: ${({ theme }) => theme.colors.primary};
    opacity: 1;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }

  @media (max-width: 640px) {
    padding: 0.4rem 0.6rem;

    &::before {
      display: none;
    }
  }
`;
