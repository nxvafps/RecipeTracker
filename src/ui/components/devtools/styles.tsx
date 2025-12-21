import styled from "styled-components";

export const ToggleButton = styled.button<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  z-index: 999;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  ${({ $isOpen }) =>
    $isOpen &&
    `
    opacity: 0.7;
  `}
`;

export const DevToolsContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: ${({ $isOpen }) => ($isOpen ? "80px" : "-400px")};
  right: 20px;
  width: 400px;
  max-width: calc(100vw - 40px);
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: bottom 0.3s ease;
  z-index: 998;
  overflow: hidden;
`;

export const DevToolsHeader = styled.div`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

export const DevToolsContent = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.colors.text};
`;

export const DevToolsButton = styled.button<{
  $variant?: "primary" | "danger";
}>`
  width: 100%;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant, theme }) => {
    if ($variant === "danger") {
      return `
        background: #dc3545;
        color: white;

        &:hover:not(:disabled) {
          background: #c82333;
        }
      `;
    }
    return `
      background: ${theme.colors.primary};
      color: white;

      &:hover:not(:disabled) {
        background: ${theme.colors.primaryHover};
      }
    `;
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

export const DevToolsMessage = styled.div<{
  $type: "success" | "error" | "info";
}>`
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 0.9rem;

  ${({ $type }) => {
    switch ($type) {
      case "success":
        return `
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        `;
      case "error":
        return `
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        `;
      case "info":
        return `
          background: #d1ecf1;
          color: #0c5460;
          border: 1px solid #bee5eb;
        `;
    }
  }}
`;
