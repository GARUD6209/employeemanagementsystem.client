import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AddEmployeeForm from "./AddEmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";
import EmployeeList from "./EmployeeList";
import { Typography, CircularProgress, Alert } from "@mui/material";
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
          employeeData.employeeId,
          employeeData
        );
      } else {
        await userService.registerUser(employeeData); // Use UserService to register a new user
      }
      fetchEmployees();
      setEditingEmployee(null);
      setAddingEmployee(false); // Reset addingEmployee state
      alert("Employee saved successfully!");
    } catch (error) {
      setError(error.response?.data?.message || error.message); // Improved error handling
      console.error("Error saving employee:", error);
      alert(
        "Error saving employee: " +
          (error.response?.data?.message || error.message)
      );
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
      alert("Employee deleted successfully!");
    } catch (error) {
      setError(error.message);
      console.error("Error deleting employee:", error);
      alert("Error deleting employee: " + error.message);
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
      ) : editingEmployee ? (
        <EditEmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => setEditingEmployee(null)}
          formTitle={"Edit Employee"}
        />
      ) : addingEmployee ? (
        <AddEmployeeForm
          onSave={handleSave}
          onCancel={() => setAddingEmployee(false)}
        />
      ) : (
        <>
          <EmployeeList
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={() => setAddingEmployee(true)} // Set addingEmployee state to true
          />
        </>
      )}
    </div>
  );
};

export default EmployeePage;
