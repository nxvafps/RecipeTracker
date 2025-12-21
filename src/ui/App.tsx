import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import * as page from "./pages";
import { GlobalStyle, AppRoot, MainContent } from "./styles";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import * as components from "./components";
import * as devtools from "./components/devtools";

interface User {
  id: number;
  username: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isDev, setIsDev] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await window.electronAPI.auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // Check if running in dev mode
        const devMode = await window.electronAPI.devtools.isDev();
        setIsDev(devMode);
      } catch (error) {
        console.error("Failed to check auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleRegisterSuccess = () => {
    setAuthMode("login");
  };

  const handleLogout = async () => {
    try {
      await window.electronAPI.auth.logout();
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          Loading...
        </div>
      </ThemeProvider>
    );
  }

  // Show auth screens if not logged in
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        {authMode === "login" ? (
          <components.auth.Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setAuthMode("register")}
          />
        ) : (
          <components.auth.Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setAuthMode("login")}
          />
        )}

        {/* DevTools panel - available on auth screens in dev mode */}
        {isDev && <devtools.DevTools />}
      </ThemeProvider>
    );
  }

  // Show main app if logged in
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <AppRoot>
          <components.layout.Sidebar user={user} onLogout={handleLogout} />

          <MainContent>
            <Routes>
              <Route path="/" element={<page.Home />} />
              <Route path="/ingredients" element={<page.Ingredients />} />
              <Route path="/recipes" element={<page.Recipes />} />
              <Route path="/shopping" element={<page.ShoppingList />} />
            </Routes>
          </MainContent>

          {/* DevTools panel - only shown in development mode */}
          {isDev && <devtools.DevTools />}
        </AppRoot>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
