import React from "react";
import {
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const EmploymentSection = ({
  formData,
  departments,
  onChange,
  textFieldProps,
}) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ color: "var(--color)", marginBottom: "1rem" }}>
        Employment Details (Admin Input)
      </h3>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Salary"
            name="salary"
            type="number"
            value={formData.salary || ""}
            onChange={(e) => {
              const value = e.target.value;
              if (
                value === "" ||
                (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)
              ) {
                onChange({
                  target: {
                    name: "salary",
                    value: value === "" ? "" : Number(value),
                  },
                });
              }
            }}
            required
            variant="outlined"
            fullWidth
            inputProps={{
              min: 0,
              step: "0.01",
            }}
            {...textFieldProps}
            error={formData.salary < 0}
            helperText={formData.salary < 0 ? "Salary cannot be negative" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Job Role"
            name="jobRole"
            value={formData.jobRole || ""}
            onChange={onChange}
            required
            variant="outlined"
            fullWidth
            {...textFieldProps}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel style={{ color: "var(--color)" }}>Role</InputLabel>
            <Select
              name="role"
              value={formData.role || ""}
              onChange={onChange}
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

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth required>
            <InputLabel style={{ color: "var(--color)" }}>
              Department
            </InputLabel>
            <Select
              name="departmentId"
              value={formData.departmentId || ""}
              onChange={onChange}
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
          <FormControl variant="outlined" fullWidth required>
            <InputLabel style={{ color: "var(--color)" }}>
              Training Required
            </InputLabel>
            <Select
              name="trainingRequired"
              value={String(formData.trainingRequired)}
              onChange={onChange}
              label="Training Required"
            >
              <MenuItem value="true">Yes</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

export default EmploymentSection;
