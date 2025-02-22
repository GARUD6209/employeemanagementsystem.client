import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { AdminPanelSettings, Person } from "@mui/icons-material";
import AuthPageWrapper from "../components/common/AuthPageWrapper";

function RoleSelection({ setUserRole }) {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    if (role === "admin") {
      setUserRole("admin");
      navigate("/login?role=admin");
    } else if (role === "employee") {
      setUserRole("employee");
      navigate("/login?role=employee");
    }
  };

  return (
    <AuthPageWrapper>
      <Container maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 4,
            py: 4, // Add padding top and bottom
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            color="text.primary"
          >
            Select Your Role
          </Typography>
          <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AdminPanelSettings />}
              onClick={() => handleRoleSelect("admin")}
            >
              Admin
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Person />}
              onClick={() => handleRoleSelect("employee")}
            >
              Employee
            </Button>
          </Stack>
        </Box>
      </Container>
    </AuthPageWrapper>
  );
}

export default RoleSelection;
