import {
  SidebarContainer,
  SidebarTitle,
  SidebarNav,
  SidebarNavLink,
  UserSection,
  UserInfo,
  UserAvatar,
  UserName,
  LogoutButton,
} from "./styles";
import { NavLink } from "react-router-dom";

interface User {
  id: number;
  username: string;
}

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export const Sidebar = ({ user, onLogout }: SidebarProps) => {
  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

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

      <UserSection>
        <UserInfo>
          <UserAvatar>{getInitials(user.username)}</UserAvatar>
          <UserName>{user.username}</UserName>
        </UserInfo>
        <LogoutButton onClick={onLogout}>Sign Out</LogoutButton>
      </UserSection>
    </SidebarContainer>
  );
};
