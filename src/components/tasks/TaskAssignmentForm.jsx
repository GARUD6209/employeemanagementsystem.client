import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import TaskAssignment from "../../models/taskAssignment.model";

const TaskAssignmentForm = ({ onSubmit, employees }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
    description: "",
    deadline: new Date().toISOString().slice(0, 16),
  });
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employeeId || !formData.description || !formData.deadline) {
      alert("Please fill in all required fields");
      return;
    }

    const task = new TaskAssignment();
    Object.assign(task, {
      ...formData,
      employeeId: Number(formData.employeeId),
      deadline: new Date(formData.deadline),
      inputFile: file,
    });

    try {
      await onSubmit(task);
    } catch (error) {
      alert("Error submitting task: " + error.message);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Employee</InputLabel>
          <Select
            required
            value={formData.employeeId}
            label="Employee"
            onChange={(e) =>
              setFormData({ ...formData, employeeId: e.target.value })
            }
          >
            {employees.map((emp) => (
              <MenuItem key={emp.employeeId} value={emp.employeeId}>
                {emp.firstName} {emp.lastName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          required
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <TextField
          fullWidth
          required
          type="datetime-local"
          label="Deadline"
          InputLabelProps={{ shrink: true }}
          value={formData.deadline}
          onChange={(e) =>
            setFormData({ ...formData, deadline: e.target.value })
          }
        />

        <Button variant="contained" component="label">
          Upload File (PDF)
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>

        <Button type="submit" variant="contained" color="primary">
          Assign Task
        </Button>
      </Stack>
    </Box>
  );
};

export default TaskAssignmentForm;
