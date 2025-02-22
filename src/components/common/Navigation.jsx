import React from "react";
import { Link } from "react-router-dom";
import SidebarWrapper from "../sidebar/SidebarWrapper";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

function Navigation({ authorized, setAuthorized, userRole, setUserRole }) {
  return (
    <>
      {authorized ? (
        <SidebarWrapper
          useRole={userRole}
          setAuthorized={setAuthorized}
          setUserRole={setUserRole}
        />
      ) : (
        <AppBar
          position="fixed"
          sx={{
            zIndex: 1,
            bgcolor: "var(--bg-color)",
            boxShadow: 1,
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/"
                sx={{ color: "var(--text-color)" }}
              >
                Landing
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{ color: "var(--text-color)" }}
              >
                Register
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}

export default Navigation;
