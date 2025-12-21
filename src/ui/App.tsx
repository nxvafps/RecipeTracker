import { BrowserRouter, Routes, Route } from "react-router-dom";
import * as page from "./pages";
import { GlobalStyle, AppRoot, MainContent } from "./styles";
import { ThemeProvider } from "styled-components";
import theme from "./theme";
import * as components from "./components";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyle theme={theme} />
        <AppRoot>
          <components.layout.Sidebar />

          <MainContent>
            <Routes>
              <Route path="/" element={<page.Home />} />
              <Route path="/recipes" element={<page.Recipes />} />
              <Route path="/shopping" element={<page.ShoppingList />} />
            </Routes>
          </MainContent>
        </AppRoot>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
