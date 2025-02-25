import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Dialog,
  DialogContent,
} from "@mui/material";
import { EmployeeService } from "../../services/EmployeeService";
import EditEmployeeForm from "./EditEmployeeForm";
import { useAuth } from "../../contexts/AuthContext";

const EmployeeProfile = ({ employee }) => (
  <Grid container spacing={2}>
    <Grid item xs={12} sm={4}>
      <img
        src={employee.photo || "/default-avatar.png"}
        alt={`${employee.firstName} ${employee.lastName}`}
        style={{ width: "100%", borderRadius: "8px" }}
      />
    </Grid>
    <Grid item xs={12} sm={8}>
      <Typography variant="h5" gutterBottom>
        {employee.firstName} {employee.lastName}
      </Typography>
      <Typography>Email: {employee.email}</Typography>
      <Typography>Job Role: {employee.jobRole}</Typography>
      <Typography>Department: {employee.departmentName}</Typography>
      <Typography>Contact: {employee.contact}</Typography>
      <Typography>Emergency Contact: {employee.emergencyContact}</Typography>
      <Typography>Address: {employee.address}</Typography>
    </Grid>
  </Grid>
);

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userId, userRole } = useAuth();
  const employeeService = new EmployeeService();

  useEffect(() => {
    loadEmployeeData();
  }, [userId]);

  const loadEmployeeData = async () => {
    try {
      const employeeId = await employeeService.getEmployeeIdByUserId(userId);
      if (employeeId) {
        const employeeData = await employeeService.getEmployeeById(employeeId);
        setEmployee(employeeData);
      }
    } catch (error) {
      console.error("Error loading employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async (updatedEmployee) => {
    try {
      // Only allow updating non-restricted fields for employees
      if (userRole !== "admin") {
        const restrictedFields = [
          "salary",
          "jobRole",
          "departmentId",
          "trainingRequired",
        ];
        restrictedFields.forEach((field) => {
          updatedEmployee[field] = employee[field];
        });
      }
      await employeeService.updateEmployee(
        employee.employeeId,
        updatedEmployee
      );
      await loadEmployeeData();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update employee information");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!employee) {
    return <Typography>No employee data found.</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        sx={{ p: 3, bgcolor: "var(--paper-bg)", color: "var(--text-primary)" }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Employee Dashboard</Typography>
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
            sx={{
              bgcolor: "var(--primary-color)",
              "&:hover": { bgcolor: "var(--hover-color)" },
            }}
          >
            Edit Profile
          </Button>
        </Box>

        <EmployeeProfile employee={employee} />

        <Dialog
          open={isEditing}
          onClose={() => setIsEditing(false)}
          fullWidth
          maxWidth="md"
          PaperProps={{
            sx: { bgcolor: "var(--paper-bg)", color: "var(--text-primary)" },
          }}
        >
          <DialogContent>
            <EditEmployeeForm
              employee={employee}
              onSave={handleEditSave}
              onCancel={() => setIsEditing(false)}
              formTitle={"Edit Profile"}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default EmployeeDashboard;
