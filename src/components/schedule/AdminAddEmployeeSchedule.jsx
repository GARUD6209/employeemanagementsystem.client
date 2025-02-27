import React, { useState } from "react";
import { TextField, Button, Box, Typography, Paper, Fade } from "@mui/material";
import EmployeeScheduleCalendar from "./EmployeeScheduleCalendar";

const AdminAddEmployeeSchedule = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [confirmedId, setConfirmedId] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    setEmployeeId(value);
  };

  const handleSubmit = () => {
    if (
      employeeId.trim() !== "" &&
      !isNaN(employeeId) &&
      parseInt(employeeId) > 0
    ) {
      setConfirmedId(parseInt(employeeId));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          color: "var(--text-primary)",
          bgcolor: "var(--bg-color)",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Enter Employee ID
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            label="Employee ID"
            value={employeeId}
            onChange={handleInputChange}
            error={
              employeeId !== "" &&
              (isNaN(employeeId) || parseInt(employeeId) <= 0)
            }
            helperText={
              employeeId !== "" &&
              (isNaN(employeeId) || parseInt(employeeId) <= 0)
                ? "Please enter a valid employee ID"
                : ""
            }
            sx={{ minWidth: "200px" }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !employeeId || isNaN(employeeId) || parseInt(employeeId) <= 0
            }
          >
            Submit
          </Button>
        </Box>
      </Paper>

      {confirmedId && (
        <Fade in={true} timeout={500}>
          <Box sx={{ mt: 3 }}>
            <Paper
              sx={{
                p: 2,
                mb: 2,
                color: "var(--text-primary)",
                bgcolor: "var(--bg-color)",
                borderLeft: "4px solid var(--primary-color)",
              }}
            >
              <Typography variant="h6">
                Viewing Schedule for Employee #{confirmedId}
              </Typography>
            </Paper>
            <EmployeeScheduleCalendar
              key={confirmedId}
              employeeId={confirmedId}
            />
          </Box>
        </Fade>
      )}
    </Box>
  );
};

export default AdminAddEmployeeSchedule;
