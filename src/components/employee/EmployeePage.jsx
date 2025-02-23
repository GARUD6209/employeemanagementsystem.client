import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";
import { Typography, Container, CircularProgress, Alert } from "@mui/material";
import { EmployeeService } from "../../services/EmployeeService";
import Employee from "../../models/employee.model";
import "./EmployeePage.css";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const employeeService = new EmployeeService();

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
        await employeeService.createEmployee(employeeData);
      }
      fetchEmployees();
      setEditingEmployee(null);
      alert("Employee saved successfully!");
    } catch (error) {
      setError(error.message);
      console.error("Error saving employee:", error);
      alert("Error saving employee: " + error.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const employeeToEdit = await employeeService.getEmployeeById(id);
      setEditingEmployee(employeeToEdit);
    } catch (error) {
      setError(error.message);
      console.error("Error fetching employee:", error);
    }
  };

  const handleDelete = async (id) => {
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
        <EmployeeForm
          employee={editingEmployee}
          onSave={handleSave}
          onCancel={() => setEditingEmployee(null)}
        />
      ) : (
        <EmployeeList
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={() => setEditingEmployee({})}
        />
      )}
    </div>
  );
};

export default EmployeePage;
