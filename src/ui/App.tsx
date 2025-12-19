import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Recipes from "./Recipes.tsx";
import ShoppingList from "./ShoppingList.tsx";
import { GlobalStyle, AppRoot, Sidebar, MainContent } from "./styles.tsx";
import { ThemeProvider } from "styled-components";
import theme from "./theme";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <AppRoot>
          <Sidebar>
            <h2>Recipe Planner</h2>
            <nav>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Home
              </NavLink>
              <NavLink
                to="/recipes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Recipes
              </NavLink>
              <NavLink
                to="/shopping"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                Shopping List
              </NavLink>
            </nav>
          </Sidebar>

          <MainContent>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h1>Recipe Planner</h1>
                    <p>Welcome — choose a page from the sidebar.</p>
                  </>
                }
              />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/shopping" element={<ShoppingList />} />
            </Routes>
          </MainContent>
        </AppRoot>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
