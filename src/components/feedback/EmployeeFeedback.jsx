import React, { useEffect, useState } from "react";
import { FeedbackService } from "../../services/FeedbackService";
import { useAuth } from "../../contexts/AuthContext";
import Feedback from "../../models/feedback.model";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { EmployeeService } from "../../services/EmployeeService";

const EmployeeFeedback = () => {
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const feedbackService = new FeedbackService();

  const { employeeId } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const feedback = new Feedback(
        0, // feedbackId will be assigned by the server
        formData.title,
        formData.content,
        new Date().toISOString(),
        Number(employeeId) // Make sure employeeId is a number
      );

      await feedbackService.createFeedback(feedback);

      setSnackbar({
        open: true,
        message: "Feedback submitted successfully!",
        severity: "success",
      });
      setFormData({ title: "", content: "" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSnackbar({
        open: true,
        message: error.response?.data || "Error submitting feedback",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          bgcolor: "var(--paper-bg)",
          color: "var(--text-primary)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 4,
            color: "var(--text-primary)",
          }}
        >
          Submit Feedback
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--input-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-color)",
                },
                "& input": {
                  color: "var(--text-primary)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
              },
            }}
          />

          <TextField
            label="Feedback Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            multiline
            rows={4}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--input-border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--primary-color)",
                },
                "& textarea": {
                  color: "var(--text-primary)",
                },
              },
              "& .MuiInputLabel-root": {
                color: "var(--text-secondary)",
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: "var(--primary-color)",
              color: "#fff",
              "&:hover": {
                bgcolor: "var(--primary-color)",
                opacity: 0.9,
              },
              alignSelf: "flex-end",
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          zIndex: 1001,
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeeFeedback;
