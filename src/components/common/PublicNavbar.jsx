import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const PublicNavbar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1,
        bgcolor: "var(--background-color)",
        boxShadow: 1,
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <Button component={Link} to="/" sx={{ color: "var(--color)" }}>
            Landing
          </Button>
          <Button
            component={Link}
            to="/register"
            sx={{ color: "var(--color)" }}
          >
            Register
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PublicNavbar;
