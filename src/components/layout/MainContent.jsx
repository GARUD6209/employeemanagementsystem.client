import React from "react";
import { styled } from "@mui/material/styles";

const MainContentWrapper = styled("div")(({ theme, sidebarCollapsed }) => ({
  marginLeft: sidebarCollapsed ? "65px" : "250px",
  transition: "margin-left 0.3s ease",
  padding: "20px",
  width: `calc(100% - ${sidebarCollapsed ? "125px" : "310px"})`,
  height: "100vh",
  backgroundColor: "var(--background-color)",
  color: "var(--text-color)",
  display: "flex",
  flexDirection: "column",
  position: "fixed",
  top: 0,
  right: 0,
  bottom: 0,
  overflowY: "auto",
  "@media (max-width: 768px)": {
    marginLeft: "65px",
    width: "calc(100% - 120px)",
  },
}));

const MainContent = ({ children, isCollapsed }) => {
  return (
    <MainContentWrapper sidebarCollapsed={isCollapsed}>
      {children}
    </MainContentWrapper>
  );
};

export default MainContent;
