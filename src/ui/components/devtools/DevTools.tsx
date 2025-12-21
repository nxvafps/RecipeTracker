import { useState, useEffect } from "react";
import {
  DevToolsContainer,
  DevToolsHeader,
  DevToolsContent,
  DevToolsButton,
  DevToolsMessage,
  ToggleButton,
  TabContainer,
  Tab,
  StatBox,
  QueryInput,
  QueryResults,
} from "./styles.tsx";

type TabType = "actions" | "stats" | "query";

export const DevTools = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("actions");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM users;");
  const [queryResults, setQueryResults] = useState<any>(null);

  // Load stats when switching to stats tab
  useEffect(() => {
    if (activeTab === "stats" && isOpen) {
      loadStats();
    }
  }, [activeTab, isOpen]);

  const loadStats = async () => {
    try {
      const result = await window.electronAPI.devtools.getDatabaseStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error("Failed to load stats:", error);
    }
  };

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

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await window.electronAPI.devtools.seedDatabase();

      if (result.success) {
        setMessage({ text: result.message, type: "success" });
        loadStats(); // Refresh stats
      } else {
        setMessage({ text: result.message, type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "Failed to seed database: " + (error as Error).message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDatabase = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await window.electronAPI.devtools.exportDatabase();

      if (result.success && result.data) {
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `recipe-tracker-backup-${
          new Date().toISOString().split("T")[0]
        }.json`;
        link.click();
        URL.revokeObjectURL(url);

        setMessage({
          text: "Database exported successfully!",
          type: "success",
        });
      } else {
        setMessage({
          text: result.message || "Failed to export database",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Failed to export database: " + (error as Error).message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteQuery = async () => {
    if (!sqlQuery.trim()) {
      setMessage({ text: "Please enter a SQL query", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);
    setQueryResults(null);

    try {
      const result = await window.electronAPI.devtools.executeQuery(sqlQuery);

      if (result.success) {
        setQueryResults(result.results);
        setMessage({
          text: `Query executed successfully (${
            result.results?.length || 0
          } rows)`,
          type: "success",
        });
      } else {
        setMessage({ text: result.message || "Query failed", type: "error" });
      }
    } catch (error) {
      setMessage({
        text: "Failed to execute query: " + (error as Error).message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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

        <TabContainer>
          <Tab
            $active={activeTab === "actions"}
            onClick={() => setActiveTab("actions")}
          >
            Actions
          </Tab>
          <Tab
            $active={activeTab === "stats"}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </Tab>
          <Tab
            $active={activeTab === "query"}
            onClick={() => setActiveTab("query")}
          >
            SQL Query
          </Tab>
        </TabContainer>

        <DevToolsContent>
          {message && (
            <DevToolsMessage $type={message.type}>
              {message.text}
            </DevToolsMessage>
          )}

          {activeTab === "actions" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Database Management</h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    margin: "0 0 1rem 0",
                  }}
                >
                  Warning: These actions modify the database and may be
                  destructive.
                </p>
              </div>

              <DevToolsButton
                onClick={handleSeedDatabase}
                disabled={isLoading}
                style={{ marginBottom: "12px" }}
              >
                {isLoading ? "Seeding..." : "🌱 Seed Sample Data"}
              </DevToolsButton>

              <DevToolsButton
                onClick={handleExportDatabase}
                disabled={isLoading}
                style={{ marginBottom: "12px" }}
              >
                {isLoading ? "Exporting..." : "💾 Export Database"}
              </DevToolsButton>

              <DevToolsButton
                onClick={handleWipeDatabase}
                disabled={isLoading}
                $variant="danger"
              >
                {isLoading ? "Wiping Database..." : "🗑️ Wipe Database"}
              </DevToolsButton>

              <div
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.75rem",
                  opacity: 0.6,
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Seed:</strong> Creates sample users for testing.
                </p>
                <p style={{ margin: "4px 0 0 0" }}>
                  <strong>Export:</strong> Downloads database as JSON.
                </p>
                <p style={{ margin: "4px 0 0 0" }}>
                  <strong>Wipe:</strong> Deletes all data and resets the app.
                </p>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>Database Statistics</h4>
                <DevToolsButton
                  onClick={loadStats}
                  disabled={isLoading}
                  style={{ fontSize: "0.85rem", padding: "8px 12px" }}
                >
                  🔄 Refresh Stats
                </DevToolsButton>
              </div>

              {stats ? (
                <>
                  <StatBox>
                    <h5>Overview</h5>
                    <p>
                      <strong>Total Users:</strong> {stats.userCount}
                    </p>
                    <p>
                      <strong>Database Size:</strong>{" "}
                      {formatBytes(stats.fileSize)}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        opacity: 0.7,
                        marginTop: "8px",
                        wordBreak: "break-all",
                      }}
                    >
                      {stats.dbPath}
                    </p>
                  </StatBox>

                  <StatBox>
                    <h5>Tables</h5>
                    {stats.tables.map((table: any) => (
                      <p key={table.name}>
                        <strong>{table.name}:</strong> {table.rowCount} rows
                      </p>
                    ))}
                  </StatBox>
                </>
              ) : (
                <p style={{ textAlign: "center", opacity: 0.6 }}>
                  Click "Refresh Stats" to load database statistics
                </p>
              )}
            </div>
          )}

          {activeTab === "query" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0" }}>SQL Query Console</h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.8,
                    margin: "0 0 1rem 0",
                  }}
                >
                  Only SELECT and PRAGMA queries are allowed for safety.
                </p>
              </div>

              <QueryInput
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                placeholder="Enter SQL query (e.g., SELECT * FROM users;)"
              />

              <DevToolsButton onClick={handleExecuteQuery} disabled={isLoading}>
                {isLoading ? "Executing..." : "▶️ Execute Query"}
              </DevToolsButton>

              {queryResults && (
                <QueryResults>
                  {JSON.stringify(queryResults, null, 2)}
                </QueryResults>
              )}

              <div
                style={{
                  marginTop: "1rem",
                  fontSize: "0.75rem",
                  opacity: 0.6,
                }}
              >
                <p style={{ margin: 0 }}>
                  <strong>Example queries:</strong>
                </p>
                <p style={{ margin: "4px 0 0 0" }}>• SELECT * FROM users;</p>
                <p style={{ margin: "4px 0 0 0" }}>
                  • SELECT username, created_at FROM users;
                </p>
                <p style={{ margin: "4px 0 0 0" }}>
                  • PRAGMA table_info(users);
                </p>
              </div>
            </div>
          )}
        </DevToolsContent>
      </DevToolsContainer>
    </>
  );
};
