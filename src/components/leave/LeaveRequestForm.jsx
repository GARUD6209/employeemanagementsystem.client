import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LeaveRequest } from "../../models/LeaveRequest";
import { leaveRequestService } from "../../services/LeaveRequestService";
import {
  TextField,
  Button,
  Box,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";

export const LeaveRequestForm = ({ onSubmitSuccess }) => {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
  });

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Personal Leave",
    "Study Leave",
    "Other",
  ];

  if (!auth?.authorized || auth?.userRole === "admin") {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.userId) {
      console.error("No user ID available");
      return;
    }

    try {
      const leaveRequest = new LeaveRequest({
        userId: auth.userId,
        ...formData,
      });
      await leaveRequestService.createLeaveRequest(leaveRequest);
      onSubmitSuccess();
    } catch (error) {
      console.error("Failed to submit leave request:", error);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: "var(--paper-bg)",
        borderRadius: "8px",
        border: "1px solid var(--divider-color)",
        padding: "16px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: "var(--text-primary)",
          borderBottom: "2px solid var(--primary-color)",
          pb: 1,
        }}
      >
        New Leave Request
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          "& .MuiTextField-root": { mb: 2 },
          "& .MuiInputBase-root": {
            backgroundColor: "var(--input-bg)",
            color: "var(--text-primary)",
            "& fieldset": {
              borderColor: "var(--input-border)",
            },
            "&:hover fieldset": {
              borderColor: "var(--primary-color)",
            },
          },
        }}
      >
        <TextField
          select
          fullWidth
          label="Leave Type"
          value={formData.leaveType}
          onChange={(e) =>
            setFormData({ ...formData, leaveType: e.target.value })
          }
          required
          sx={{
            "& .MuiInputLabel-root": {
              color: "var(--text-secondary)",
            },
            "& .MuiSelect-icon": {
              color: "var(--text-secondary)",
            },
          }}
        >
          {leaveTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Start Date"
          value={formData.startDate}
          onChange={(e) =>
            setFormData({ ...formData, startDate: e.target.value })
          }
          required
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          type="date"
          label="End Date"
          value={formData.endDate}
          onChange={(e) =>
            setFormData({ ...formData, endDate: e.target.value })
          }
          required
          InputLabelProps={{ shrink: true }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "var(--primary-color)",
            "&:hover": {
              backgroundColor: "var(--hover-color)",
            },
            color: "white",
            fontWeight: "bold",
          }}
        >
          Submit Request
        </Button>
      </Box>
    </Paper>
  );
};
