import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { TaskAssignmentService } from "../../services/TaskAssignmentService";
import { useAuth } from "../../contexts/AuthContext";
import TaskList from "./TaskList";
import { EmployeeService } from "../../services/EmployeeService";
import { TaskStatus } from "../../models/taskAssignment.model";

const EmployeeTaskView = () => {
  const [tasks, setTasks] = useState([]);
  const taskService = new TaskAssignmentService();
  const employeeService = new EmployeeService();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      loadTasks();
    }
  }, [userId]);

  const loadTasks = async () => {
    const employee = await employeeService.getEmployeeIdByUserId(userId);
    console.log(employee);
    const employeeTasks = await taskService.getTasksByEmployee(employee);
    setTasks(employeeTasks);
  };

  const handleStatusUpdate = async (taskId, newStatus, outputFile = null) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = newStatus;
        if (outputFile) {
          task.outputFile = outputFile;
        }
        await taskService.updateTaskStatus(task);
        await loadTasks();
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      alert("Failed to update task status");
    }
  };

  const handleFileUpload = async (taskId, event) => {
    const file = event.target.files[0];
    if (file) {
      await handleStatusUpdate(taskId, TaskStatus.Completed, file);
    }
  };

  const handleFileDownload = async (filePath, type) => {
    console.log(`Downloading ${type} file: ${filePath}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        sx={{ p: 3, bgcolor: "var(--paper-bg)", boxShadow: 3, borderRadius: 2 }}
      >
        <Box mb={2}>
          <Typography
            variant="h4"
            sx={{ color: "var(--text-primary)", fontWeight: "bold" }}
          >
            My Tasks
          </Typography>
        </Box>
        <TaskList
          tasks={tasks}
          isAdmin={false}
          onStatusUpdate={handleStatusUpdate}
          onFileDownload={handleFileDownload}
          onFileUpload={handleFileUpload}
        />
      </Paper>
    </Container>
  );
};

export default EmployeeTaskView;
