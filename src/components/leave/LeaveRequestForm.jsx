import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { LeaveRequest } from "../../models/LeaveRequest";
import { leaveRequestService } from "../../services/LeaveRequestService";
import CustomDatePicker from "../common/CustomDatePicker";
import {
  Box,
  Paper,
  Typography,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

export const LeaveRequestForm = ({ onSubmitSuccess }) => {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: new Date(), // Changed to use Date object
    endDate: new Date(), // Changed to use Date object
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

  const handleDateChange = (field) => (date) => {
    setFormData({ ...formData, [field]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth?.userId) {
      console.error("No user ID available");
      return;
    }

    try {
      const leaveRequest = new LeaveRequest({
        userId: auth.userId,
        leaveType: formData.leaveType,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
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
        mt: 5,
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
          display: "flex",
          flexDirection: "column",
          gap: 3,
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
            backgroundColor: "var(--input-bg)",
            "& .MuiInputLabel-root": {
              color: "var(--text-secondary)",
            },
            "& .MuiSelect-icon": {
              color: "var(--text-secondary)",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--input-border)",
            },
            "& .MuiInputBase-input": {
              color: "var(--text-color)",
            },
          }}
        >
          {leaveTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "var(--text-secondary)" }}
          >
            Start Date
          </Typography>
          <CustomDatePicker
            value={formData.startDate}
            onChange={handleDateChange("startDate")}
          />
        </Box>

        <Box>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, color: "var(--text-secondary)" }}
          >
            End Date
          </Typography>
          <CustomDatePicker
            value={formData.endDate}
            onChange={handleDateChange("endDate")}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "var(--primary-color)",
            color: "white",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "var(--primary-color)",
              opacity: 0.9,
            },
          }}
        >
          Submit Request
        </Button>
      </Box>
    </Paper>
  );
};
