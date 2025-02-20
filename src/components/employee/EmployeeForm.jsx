import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import "./EmployeePage.css";

const EmployeeForm = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    firstName: "",
    lastName: "",
    photo: "",
    email: "",
    address: "",
    contact: "",
    emergencyContact: "",
    salary: 0,
    jobRole: "",
    departmentId: "",
    trainingRequired: "no",
    userId: "",
  });

  useEffect(() => {
    if (employee && employee.employeeId) {
      setFormData({
        ...employee,
        trainingRequired: employee.trainingRequired ? "yes" : "no",
      });
    } else {
      setFormData({
        employeeId: "",
        firstName: "",
        lastName: "",
        photo: "",
        email: "",
        address: "",
        contact: "",
        emergencyContact: "",
        salary: 0,
        jobRole: "",
        departmentId: "",
        trainingRequired: "no",
        userId: "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "trainingRequired" ? value === "yes" : value,
    }));
  };

  return (
    <div className="form-container">
      <h2>
        {employee && employee.employeeId ? "Edit Employee" : "Add Employee"}
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...formData,
            trainingRequired: formData.trainingRequired === "yes",
          });
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Photo URL"
              name="photo"
              value={formData.photo}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Role"
              name="jobRole"
              value={formData.jobRole}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department ID"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel style={{ color: "var(--color)" }}>
                Training Required
              </InputLabel>
              <Select
                name="trainingRequired"
                value={formData.trainingRequired ? "yes" : "no"}
                onChange={handleChange}
                label="Training Required"
                style={{ color: "var(--color)" }} // Ensure select text color changes with theme
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="User ID"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              InputLabelProps={{
                style: { color: "var(--color)" }, // Ensure label text color changes with theme
              }}
              InputProps={{
                style: { color: "var(--color)" }, // Ensure input text color changes with theme
              }}
            />
          </Grid>
        </Grid>
        <div className="button-group">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="save-btn"
          >
            Save
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
