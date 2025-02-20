import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeList from "./EmployeeList";
import { Typography, Container, CircularProgress, Alert } from "@mui/material";
import "./EmployeePage.css";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/Employee");
      if (!response.ok) throw new Error("Failed to fetch employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (employee) => {
    setError("");
    try {
      const requestOptions = {
        method: editingEmployee ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee),
      };

      const url = editingEmployee
        ? `/api/Employee/${employee.employeeId}`
        : "/api/Employee";

      const response = await fetch(url, requestOptions);
      if (!response.ok) throw new Error("Failed to save employee");
      fetchEmployees();
      setEditingEmployee(null);
      alert("Employee saved successfully!");
    } catch (error) {
      setError(error.message);
      alert("Error saving employee: " + error.message);
    }
  };

  const handleEdit = (id) => {
    const employeeToEdit = employees.find((emp) => emp.employeeId === id);
    setEditingEmployee(employeeToEdit);
  };

  const handleDelete = async (id) => {
    setError("");
    try {
      const response = await fetch(`/api/Employee/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete employee");
      fetchEmployees();
      alert("Employee deleted successfully!");
    } catch (error) {
      setError(error.message);
      alert("Error deleting employee: " + error.message);
    }
  };

  return (
    <Container className="employee-page-container">
      <Typography variant="h4" gutterBottom>
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
    </Container>
  );
};

export default EmployeePage;
