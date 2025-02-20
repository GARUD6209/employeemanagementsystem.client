import React, { useState, useEffect } from "react";
import "./ThemeToggle.css";

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
    <button className="theme-toggle" onClick={toggleTheme}>
      Switch to {theme === "dark" ? "Light" : "Dark"} Theme
    </button>
  );
};

export default ThemeToggle;
