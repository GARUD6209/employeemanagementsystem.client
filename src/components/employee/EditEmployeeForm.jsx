import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { DepartmentService } from "../../services/DepartmentService";
import Employee from "../../models/employee.model";
import "./EmployeePage.css";

const mapEmployeeToFormData = (employee) => ({
  employeeId: employee.employeeId || "",
  firstName: employee.firstName || "",
  lastName: employee.lastName || "",
  photo: employee.photo || "",
  email: employee.email || "",
  address: employee.address || "",
  contact: employee.contact || "",
  emergencyContact: employee.emergencyContact || "",
  salary: employee.salary || "",
  jobRole: employee.jobRole || "",
  departmentId: employee.departmentId || "",
  trainingRequired: employee.trainingRequired ?? false,
  samagraId: employee.samagraId || "",
  fatherName: employee.fatherName || "",
  motherName: employee.motherName || "",
  gender: employee.gender || "",
  maritalStatus: employee.maritalStatus || "",
  dob:
    employee.dob && employee.dob.length >= 10 ? employee.dob.slice(0, 10) : "",
  district: employee.district || "",
});

const EditEmployeeForm = ({ employee, onSave, onCancel, formTitle }) => {
  const { userRole } = useAuth();
  const isAdmin = userRole === "admin";
  const [formData, setFormData] = useState(new Employee());
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [errorColor, setErrorColor] = useState("var(--color)");
  const departmentService = new DepartmentService();

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (employee && employee.employeeId) {
      setFormData(mapEmployeeToFormData(employee));
    } else {
      setFormData(new Employee());
    }
  }, [employee]);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      setDialogMessage("Error fetching departments");
      setErrorColor("red");
      setDialogOpen(true);
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
        newData[name] = value === "true";
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

  const isFieldRestricted = (fieldName) => {
    const restrictedFields = [
      "salary",
      "jobRole",
      "departmentId",
      "trainingRequired",
    ];
    return !isAdmin && restrictedFields.includes(fieldName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Sanitize numeric and boolean fields
    const sanitizeNumber = (val) =>
      val === "" || val === undefined ? null : Number(val);
    const sanitizeBoolean = (val) => val === true || val === "true";
    // Prepare payload, remove employeeId
    const {
      employeeId, // remove from payload
      ...rest
    } = formData;
    const dataToSubmit = {
      ...rest,
      salary: sanitizeNumber(formData.salary),
      departmentId: sanitizeNumber(formData.departmentId),
      samagraId: sanitizeNumber(formData.samagraId),
      trainingRequired: sanitizeBoolean(formData.trainingRequired),
    };
    // Remove fields that are null or empty string
    Object.keys(dataToSubmit).forEach((key) => {
      if (dataToSubmit[key] === null || dataToSubmit[key] === "") {
        delete dataToSubmit[key];
      }
    });
    onSave(dataToSubmit);
  };

  return (
    <div className="form-container">
      <h2>{formTitle}</h2>
      <form onSubmit={handleSubmit}>
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
              label="Photo URL"
              name="photo"
              value={formData.photo}
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
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
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
              disabled={isFieldRestricted("salary")}
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
              disabled={isFieldRestricted("jobRole")}
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              disabled={isFieldRestricted("departmentId")}
            >
              <InputLabel style={{ color: "var(--color)" }}>
                Department
              </InputLabel>
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
          <Grid item xs={12} sm={6}>
            <FormControl
              variant="outlined"
              fullWidth
              required
              disabled={isFieldRestricted("trainingRequired")}
            >
              <InputLabel style={{ color: "var(--color)" }}>
                Training Required
              </InputLabel>
              <Select
                name="trainingRequired"
                value={formData.trainingRequired.toString()}
                onChange={handleChange}
                label="Training Required"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Samagra ID"
              name="samagraId"
              value={formData.samagraId || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Mother's Name"
              name="motherName"
              value={formData.motherName || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Gender"
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Marital Status"
              name="maritalStatus"
              value={formData.maritalStatus || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="District"
              name="district"
              value={formData.district || ""}
              onChange={handleChange}
              required
              variant="outlined"
              fullWidth
              {...textFieldProps}
            />
          </Grid>
        </Grid>
        <div
          className="button-group"
          style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}
        >
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
          Edit Employee Information
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
    </div>
  );
};

export default EditEmployeeForm;
