import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";
import EmployeeList from "./EmployeeList";
import {
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EmployeeService } from "../../services/EmployeeService";
import { UserService } from "../../services/UserService"; // Import UserService
import "./EmployeePage.css";

const EmployeePage = () => {
  const { userRole } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [addingEmployee, setAddingEmployee] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [errorColor, setErrorColor] = useState("");
  const employeeService = new EmployeeService();
  const userService = new UserService();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await employeeService.getAllEmployees();
      // console.log("Fetched employees:", data); // Debugging log
      setEmployees(data);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (employeeData) => {
    setError("");
    try {
      if (editingEmployee && editingEmployee.employeeId) {
        await employeeService.updateEmployee(
          editingEmployee.employeeId, // Use the ID from editingEmployee, not from the form
          employeeData
        );
      } else {
        await userService.registerUser(employeeData); // Use UserService to register a new user
      }
      fetchEmployees();
      setEditingEmployee(null);
      setAddingEmployee(false); // Reset addingEmployee state
      setDialogMessage("Employee saved successfully!");
      setDialogOpen(true);
      setErrorColor("var(--success-color)");
    } catch (error) {
      setError(error.response?.data?.message || error.message); // Improved error handling
      console.error("Error saving employee:", error);
      setDialogMessage(
        "Error saving employee: " +
          (error.response?.data?.message || error.message)
      );
      setDialogOpen(true);
      setErrorColor("var(--warning-color)");
    }
  };

  const handleEdit = async (id) => {
    if (userRole !== "admin") {
      setError("Unauthorized to edit employees");
      return;
    }
    try {
      const employeeToEdit = await employeeService.getEmployeeById(id);
      setEditingEmployee(employeeToEdit);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employee:", error);
    }
  };

  const handleDelete = async (id) => {
    if (userRole !== "admin") {
      setError("Unauthorized to delete employees");
      return;
    }
    setError("");
    try {
      await employeeService.deleteEmployee(id);
      fetchEmployees();
      setDialogMessage("Employee deleted successfully!");
      setDialogOpen(true);
      setErrorColor("var(--success-color)");
    } catch (error) {
      setError(error.message);
      console.error("Error deleting employee:", error);
      setDialogMessage("Error deleting employee: " + error.message);
      setDialogOpen(true);
      setErrorColor("var(--warning-color)");
    }
  };

  return (
    <div className="employee-page-container">
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "var(--text-color)" }}
      >
        Employee Management
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => setAddingEmployee(true)} // Set addingEmployee state to true
          />
          <Dialog
            open={!!editingEmployee}
            onClose={() => setEditingEmployee(null)}
            maxWidth="md"
            PaperProps={{
              sx: { bgcolor: "var(--paper-bg)", color: "var(--text-primary)" },
            }}
          >
            <DialogTitle
            // sx={{
            //   m: 0,
            //   p: 2,
            //   fontWeight: 700,
            //   fontSize: 22,
            //   color: "var(--text-color)",
            //   background: "#232323",
            // }}
            >
              Edit Employee
              <IconButton
                aria-label="close"
                onClick={() => setEditingEmployee(null)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
            // style={{
            //   padding: 24,
            //   overflowY: "auto",
            //   maxHeight: "75vh",
            //   background: "#232323",
            // }}
            >
              {editingEmployee && (
                <EditEmployeeForm
                  employee={editingEmployee}
                  onSave={handleSave}
                  onCancel={() => setEditingEmployee(null)}
                  formTitle={null} // Remove duplicate title inside form
                />
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            open={addingEmployee}
            onClose={() => setAddingEmployee(false)}
            maxWidth="md"
            PaperProps={{
              sx: { bgcolor: "var(--bg-color)", color: "var(--text-primary)" },
            }}
          >
            <DialogTitle
            // sx={{
            //   m: 0,
            //   p: 2,
            //   fontWeight: 700,
            //   fontSize: 22,
            //   color: "var(--text-color)",
            //   background: "#232323",
            // }}
            >
              Add Employee
              <IconButton
                aria-label="close"
                onClick={() => setAddingEmployee(false)}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent
              style={{
                padding: 24,
                overflowY: "auto",
                maxHeight: "75vh",
              }}
            >
              {addingEmployee && (
                <AddEmployeeForm
                  onSave={handleSave}
                  onCancel={() => setAddingEmployee(false)}
                  formTitle={null} // Remove duplicate title inside form
                />
              )}
            </DialogContent>
          </Dialog>
          <Dialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: "var(--bg-color)",
                color: "var(--color)",
              },
            }}
          >
            <DialogTitle sx={{ borderBottom: "1px solid var(--color)" }}>
              Message
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                sx={{
                  color: errorColor,
                  marginTop: 2,
                }}
              >
                {dialogMessage}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setDialogOpen(false)}
                sx={{
                  color: "var(--color)",
                  "&:hover": {
                    backgroundColor: "rgba(var(--color-rgb), 0.1)",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default EmployeePage;
