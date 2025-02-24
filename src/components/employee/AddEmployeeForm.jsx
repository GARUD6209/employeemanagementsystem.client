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
import { DepartmentService } from "../../services/DepartmentService";
import { RegisterUserModel } from "../../models/RegisterUserModel";
import "./EmployeePage.css";

const AddEmployeeForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState(new RegisterUserModel()); // Ensure trainingRequired is false
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const departmentService = new DepartmentService();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const newData = { ...prevData };
      if (name === "departmentId") {
        newData[name] = value === "" ? "" : Number(value);
      } else if (name === "salary") {
        newData[name] = Number(value);
      } else if (name === "trainingRequired") {
        newData[name] = value === "true"; // Convert to boolean
      } else {
        newData[name] = value;
      }
      return newData;
    });
  };

  const textFieldProps = {
    InputLabelProps: {
      style: { color: "var(--color)" },
    },
    InputProps: {
      style: { color: "var(--color)" },
    },
    sx: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color)",
      },
    },
  };

  const departmentSelect = (
    <Grid item xs={12} sm={6}>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel style={{ color: "var(--color)" }}>Department</InputLabel>
        <Select
          name="departmentId"
          value={formData.departmentId || ""}
          onChange={handleChange}
          label="Department"
          sx={{
            textAlign: "left",
            "& .MuiSelect-select": {
              textAlign: "left",
              paddingLeft: "14px",
            },
          }}
        >
          <MenuItem value="">
            <em>Select a department</em>
          </MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.departmentId} value={dept.departmentId}>
              {dept.departmentName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const roleSelect = (
    <Grid item xs={12} sm={6}>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel style={{ color: "var(--color)" }}>Role</InputLabel>
        <Select
          name="role"
          value={formData.role || ""}
          onChange={handleChange}
          label="Role"
          sx={{
            textAlign: "left",
            "& .MuiSelect-select": {
              textAlign: "left",
              paddingLeft: "14px",
            },
          }}
        >
          <MenuItem value="">
            <em>Select a role</em>
          </MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Employee">Employee</MenuItem>
        </Select>
      </FormControl>
    </Grid>
  );

  return (
    <div className="form-container">
      <h2>Add Employee</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
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
              {...textFieldProps}
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
              {...textFieldProps}
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
              {...textFieldProps}
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
              {...textFieldProps}
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
              {...textFieldProps}
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
              {...textFieldProps}
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
              {...textFieldProps}
            />
          </Grid>
          {roleSelect}
          {departmentSelect}
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel style={{ color: "var(--color)" }}>
                Training Required
              </InputLabel>
              <Select
                name="trainingRequired"
                value={String(formData.trainingRequired)} // Convert to string
                onChange={handleChange}
                label="Training Required"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
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

export default AddEmployeeForm;
