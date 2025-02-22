import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import Employee from "../../models/employee.model";
import "./EmployeePage.css";
import ConfirmationAlert from "../common/ConfirmationAlert";
import { DepartmentService } from "../../services/DepartmentService";

const EmployeeList = ({ employees, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    id: null,
  });
  const [editConfirmation, setEditConfirmation] = useState({
    open: false,
    id: null,
  });
  const [departments, setDepartments] = useState({});
  const departmentService = new DepartmentService();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      const deptMap = data.reduce((acc, dept) => {
        acc[dept.departmentId] = dept.departmentName;
        return acc;
      }, {});
      setDepartments(deptMap);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.employeeId.toString().includes(searchTerm)
  );

  const getEmployeeName = (id) => {
    const employee = employees.find((emp) => emp.employeeId === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : "";
  };

  const handleEditClick = (id) => {
    setEditConfirmation({ open: true, id: id });
  };

  const handleEditConfirm = () => {
    onEdit(editConfirmation.id);
    setEditConfirmation({ open: false, id: null });
  };

  const handleEditCancel = () => {
    setEditConfirmation({ open: false, id: null });
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation({ open: true, id: id });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteConfirmation.id);
    setDeleteConfirmation({ open: false, id: null });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ open: false, id: null });
  };

  return (
    <div className="employee-list-container">
      <h2 className="title">Employee List</h2>
      <div className="search-add-container">
        <TextField
          label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-bar"
          InputLabelProps={{
            style: { color: "var(--color)" },
          }}
          InputProps={{
            style: { color: "var(--color)" },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAdd}
          className="add-btn"
        >
          Add Employee
        </Button>
      </div>
      <div className="employee-table-wrapper">
        <Table className="employee-table">
          <TableHead>
            <TableRow>
              <TableCell>Employee ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Photo</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Emergency Contact</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Job Role</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Training Required</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((emp) => (
              <TableRow key={emp.employeeId}>
                <TableCell>{emp.employeeId}</TableCell>
                <TableCell>{`${emp.firstName} ${emp.lastName}`}</TableCell>
                <TableCell>
                  <img src={emp.photo} alt="Profile" className="profile-img" />
                </TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>{emp.address}</TableCell>
                <TableCell>{emp.contact}</TableCell>
                <TableCell>{emp.emergencyContact}</TableCell>
                <TableCell>{emp.salary}</TableCell>
                <TableCell>{emp.jobRole}</TableCell>
                <TableCell>
                  {departments[emp.departmentId] || emp.departmentId}
                </TableCell>
                <TableCell>{emp.trainingRequired ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(emp.employeeId)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDeleteClick(emp.employeeId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <ConfirmationAlert
        open={deleteConfirmation.open}
        title="Confirm Delete"
        message="Are you sure you want to delete this employee"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        itemName={
          employees.find((emp) => emp.employeeId === deleteConfirmation.id)
            ?.firstName
        }
        type="delete" // Specify type as "delete"
      />
      <ConfirmationAlert
        open={editConfirmation.open}
        title="Confirm Edit"
        message="Are you sure you want to edit this employee"
        onConfirm={handleEditConfirm}
        onCancel={handleEditCancel}
        itemName={
          employees.find((emp) => emp.employeeId === editConfirmation.id)
            ?.firstName
        }
        type="edit" // Optionally specify type as "edit"
      />
    </div>
  );
};

export default EmployeeList;
