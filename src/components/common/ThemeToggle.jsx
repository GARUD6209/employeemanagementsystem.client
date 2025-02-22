import React, { useState, useEffect } from "react";
import "./ThemeToggle.css";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Box from "@mui/material/Box";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: "10px",
        right: "24px",
        zIndex: 1200,
        "& button": {
          backgroundColor: "transparent",
          border: "none",
          color: "var(--text-color)",
          cursor: "pointer",
          padding: "8px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      }}
    >
      <button onClick={toggleTheme}>
        {theme === "dark" ? (
          <LightModeIcon sx={{ fontSize: 24 }} />
        ) : (
          <DarkModeIcon sx={{ fontSize: 24 }} />
        )}
      </button>
    </Box>
  );
};

export default ThemeToggle;
