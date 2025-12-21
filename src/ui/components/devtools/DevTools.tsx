import { useState } from "react";
import {
  DevToolsContainer,
  DevToolsHeader,
  DevToolsContent,
  DevToolsButton,
  DevToolsMessage,
  ToggleButton,
} from "./styles";

export const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleWipeDatabase = async () => {
    const confirmed = window.confirm(
      "⚠️ Are you sure you want to wipe the entire database? This will delete all users, recipes, and shopping lists. This action cannot be undone!"
    );

    if (!confirmed) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await window.electronAPI.devtools.wipeDatabase();

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        // Reload the app after 2 seconds
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "Failed to wipe database: " + (error as Error).message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToggleButton onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen}>
        🛠️ DevTools
      </ToggleButton>

      <DevToolsContainer $isOpen={isOpen}>
        <DevToolsHeader>
          <h3>🔧 Developer Tools</h3>
          <span style={{ fontSize: "0.85rem", opacity: 0.7 }}>
            Development Mode Only
          </span>
        </DevToolsHeader>

        <DevToolsContent>
          <div style={{ marginBottom: "1rem" }}>
            <h4 style={{ margin: "0 0 0.5rem 0" }}>Database Management</h4>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: "0 0 1rem 0" }}>
              Warning: These actions are destructive and cannot be undone.
            </p>
          </div>

          {message && (
            <DevToolsMessage $type={message.type}>
              {message.text}
            </DevToolsMessage>
          )}

          <DevToolsButton
            onClick={handleWipeDatabase}
            disabled={isLoading}
            $variant="danger"
          >
            {isLoading ? "Wiping Database..." : "🗑️ Wipe Database"}
          </DevToolsButton>

          <div style={{ marginTop: "1.5rem", fontSize: "0.75rem", opacity: 0.6 }}>
            <p style={{ margin: 0 }}>
              Wiping the database will delete all tables and recreate them,
              effectively resetting the app to its initial state.
            </p>
          </div>
        </DevToolsContent>
      </DevToolsContainer>
    </>
  );
};
