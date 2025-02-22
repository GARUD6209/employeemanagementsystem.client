import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Alert,
  Paper,
} from "@mui/material";
import AuthPageWrapper from "../components/common/AuthPageWrapper";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((data) => {
          if (data.ok) setError("Successful register.");
          else setError("Error registering.");
        })
        .catch((error) => {
          console.error(error);
          setError("Error registering.");
        });
    }
  };

  return (
    <AuthPageWrapper>
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 2,
            bgcolor: "var(--bg-color) !important", // Dark theme background
            color: "black", // Light text color
          }}
        >
          <Typography variant="h5" align="center" gutterBottom>
            Register
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
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: {
                  color: "black",
                  bgcolor: "var(--bg-color) !important",
                },
              }}
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
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: {
                  color: "black",
                  bgcolor: "var(--bg-color) !important",
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Confirm Password"
              variant="outlined"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{
                style: {
                  color: "black",
                  bgcolor: "var(--bg-color) !important",
                },
              }}
            />
            {error && (
              <Alert
                severity="error"
                sx={{ mt: 2, bgcolor: "#333333", color: "black" }}
              >
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </AuthPageWrapper>
  );
}

export default Register;
