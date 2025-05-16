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
import EditEmployeeForm from "../employee/EditEmployeeForm";
import { useAuth } from "../../contexts/AuthContext";
import { EmployeeService } from "../../services/EmployeeService";
import Profile from "../common/Profile";

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userRole, employeeId } = useAuth();
  const employeeService = new EmployeeService();

  useEffect(() => {
    if (employeeId) {
      const loadEmployeeData = async () => {
        try {
          // console.log("Fetching employee data for ID:", employeeId);
          const employeeData = await employeeService.getEmployeeById(
            employeeId
          );
          // console.log("API response for employee:", employeeData);
          if (!employeeData || Object.keys(employeeData).length === 0) {
            setEmployee(null);
            alert("No employee data returned from API.");
          } else {
            employeeData.employeeId = employeeId;
            setEmployee(employeeData);
          }
        } catch (error) {
          console.error("Error loading employee data:", error);
          alert("Failed to load employee data. " + (error?.message || ""));
          setEmployee(null);
        } finally {
          setLoading(false);
        }
      };
      loadEmployeeData();
    }
  }, [employeeId]);

  const handleEditSave = async (updatedEmployee) => {
    try {
      // Only allow updating non-restricted fields for employees
      if (userRole == "employee") {
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

        <Profile employee={employee} />

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
