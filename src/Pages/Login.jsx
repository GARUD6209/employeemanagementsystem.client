import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Checkbox,
  Button,
  Typography,
  Box,
  Container,
  FormControlLabel,
  Alert,
} from "@mui/material";
import AuthPageWrapper from "../components/common/AuthPageWrapper";

function Login({ setAuthorized }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberme] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const role = new URLSearchParams(location.search).get("role");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
    } else {
      setError("");
      const loginUrl = rememberme
        ? `/login?useCookies=true&role=${role}`
        : `/login?useSessionCookies=true&role=${role}`;

      fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((data) => {
          if (data.ok) {
            setAuthorized(true);

            navigate("/home");
          } else {
            setError("Error Logging In.");
          }
        })
        .catch((error) => {
          console.error(error);
          setError("Error Logging in.");
        });
    }
  };

  return (
    <AuthPageWrapper>
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
            Login as {role}
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
                    sx={{ color: "var(--bg-color)" }}
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
    </AuthPageWrapper>
  );
}

export default Login;
