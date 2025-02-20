import React, { useState } from "react";
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
import "./EmployeePage.css";

const EmployeeList = ({ employees, onEdit, onDelete, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter((emp) =>
    emp.employeeId.toString().includes(searchTerm)
  );

  return (
    <div className="employee-list-container">
      <h2 className="title">Employee List</h2>
      <div className="search-add-container">
        <TextField
          label="Search by ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="outlined"
          className="search-bar"
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
            <TableCell>Department ID</TableCell>
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
              <TableCell>{emp.departmentId}</TableCell>
              <TableCell>{emp.trainingRequired ? "Yes" : "No"}</TableCell>
              <TableCell>
                <IconButton
                  color="primary"
                  onClick={() => onEdit(emp.employeeId)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => onDelete(emp.employeeId)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeList;
