import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  Container,
  FormControlLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AuthService } from "../services/AuthService";
import { useAuth } from "../contexts/AuthContext";
import AuthPageWrapper from "../components/common/AuthPageWrapper";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, selectedRole, errorMessage, redirecting } = useAuth();
  const authService = new AuthService();

  useEffect(() => {
    const checkRole = async () => {
      if (
        !selectedRole ||
        !["admin", "employee"].includes(selectedRole.toLowerCase())
      ) {
        setError("Invalid role selected");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/", { replace: true });
      }
    };

    checkRole();
  }, [selectedRole, navigate]);

  // If no role is selected, show loading or redirect immediately
  if (!selectedRole) {
    return (
      <AuthPageWrapper>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="primary" variant="h6">
            No role selected. Redirecting to role selection...
          </Typography>
        </Box>
      </AuthPageWrapper>
    );
  }

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "rememberme") setRememberme(checked);
  };

  const [showPassword, setShowPassword] = useState("password");

  const handleClick = () => {
    setShowPassword(showPassword === "password" ? "text" : "password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("No role selected. Please select a role first.");
      setTimeout(() => navigate("/", { replace: true }), 1000);
      return;
    }

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setError("");
      const loginSuccess = await login(
        email,
        password,
        selectedRole,
        rememberme
      );

      if (loginSuccess) {
        // Verify user role after successful login
        const authData = await authService.checkAuth();

        if (authData.role.toLowerCase() !== selectedRole.toLowerCase()) {
          setError(`Access denied. You don't have ${selectedRole} privileges.`);
          await authService.logout(); // Logout if role doesn't match

          return;
        }

        navigate("/home");
      } else {
        setError("Invalid credentials.");
      }
    } catch (error) {
      console.error(error);
      setError("Error logging in. Please try again.");
    }
  };

  return (
    <AuthPageWrapper>
      {redirecting ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 4,
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />
          <Typography color="primary" variant="h6">
            {errorMessage}
          </Typography>
        </Box>
      ) : (
        <Container maxWidth="xs">
          <Box
            sx={{
              mt: 8,
              p: 4,
              boxShadow: 3,
              borderRadius: 2,
              bgcolor: "var(--bg-color) !important", // Dark mode friendly
              color: "black", // White text for contrast
            }}
          >
            <Typography variant="h5" align="center" gutterBottom>
              Login as {selectedRole}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                sx={{
                  input: { color: "black" },
                  label: { color: "black" },
                  bgcolor: "var(--bg-color) !important",
                }} // Dark input styling
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                variant="outlined"
                type={showPassword}
                name="password"
                value={password}
                onChange={handleChange}
                sx={{
                  input: { color: "black" },
                  label: { color: "black" },
                  bgcolor: "var(--bg-color) !important",
                }} // Dark input styling
                InputProps={{
                  endAdornment: (
                    <Button
                      onClick={handleClick}
                      sx={{ color: "var(--text-color)" }}
                    >
                      {showPassword === "password" ? "Show" : "Hide"}
                    </Button>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberme"
                    checked={rememberme}
                    onChange={handleChange}
                    sx={{ color: "black" }}
                  />
                }
                label={
                  <Typography sx={{ color: "black" }}>Remember Me</Typography>
                }
              />
              {error && (
                <Alert
                  severity="error"
                  sx={{ mt: 2, bgcolor: "#D32F2F", color: "black" }}
                >
                  {error}
                </Alert>
              )}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, bgcolor: "#1976D2" }}
              >
                Login
              </Button>
            </form>
          </Box>
        </Container>
      )}
    </AuthPageWrapper>
  );
}

export default Login;
