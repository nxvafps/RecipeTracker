import {
  SidebarContainer,
  SidebarTitle,
  SidebarNav,
  SidebarNavLink,
} from "./styles";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarTitle>Recipe Planner</SidebarTitle>
      <SidebarNav>
        <SidebarNavLink
          as={NavLink}
          to="/"
          end
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </SidebarNavLink>
        <SidebarNavLink
          as={NavLink}
          to="/recipes"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Recipes
        </SidebarNavLink>
        <SidebarNavLink
          as={NavLink}
          to="/shopping"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Shopping List
        </SidebarNavLink>
      </SidebarNav>
    </SidebarContainer>
  );
};
