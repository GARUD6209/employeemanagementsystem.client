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
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          p: 4,
          boxShadow: 3,
          borderRadius: 2,
          bgcolor: "#1E1E1E", // Dark mode friendly
          color: "#fff", // White text for contrast
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
              input: { color: "#fff" },
              label: { color: "#ccc" },
              bgcolor: "#333",
            }} // Dark input styling
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            sx={{
              input: { color: "#fff" },
              label: { color: "#ccc" },
              bgcolor: "#333",
            }} // Dark input styling
          />
          <FormControlLabel
            control={
              <Checkbox
                name="rememberme"
                checked={rememberme}
                onChange={handleChange}
                sx={{ color: "#fff" }}
              />
            }
            label={<Typography sx={{ color: "#fff" }}>Remember Me</Typography>}
          />
          {error && (
            <Alert
              severity="error"
              sx={{ mt: 2, bgcolor: "#D32F2F", color: "#fff" }}
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
  );
}

export default Login;
