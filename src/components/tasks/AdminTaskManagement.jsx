import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Paper, Button } from "@mui/material";
import { TaskAssignmentService } from "../../services/TaskAssignmentService";
import { EmployeeService } from "../../services/EmployeeService";
import TaskList from "./TaskList";
import TaskAssignmentForm from "./TaskAssignmentForm";
import { useAuth } from "../../contexts/AuthContext";

const AdminTaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState("main"); // 'main', 'assignTask', 'taskList'
  const { userId } = useAuth();
  const taskService = new TaskAssignmentService();
  const employeeService = new EmployeeService();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [allTasks, allEmployees] = await Promise.all([
      taskService.getAllTasks(),
      employeeService.getAllEmployees(),
    ]);
    setTasks(allTasks);
    setEmployees(allEmployees);
  };

  const handleTaskAssignment = async (task) => {
    try {
      task.applicationUserId = userId; // Set applicationUserId before sending
      await taskService.assignTask(task);
      await loadData();
      setView("main");
    } catch (error) {
      console.error("Task assignment error:", error);
      alert(error.message || "Failed to assign task");
    }
  };

  const handleFileDownload = async (filePath, type) => {
    console.log(`Downloading ${type} file: ${filePath}`);
  };

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            p: 3,
            backgroundColor: "var(--paper-bg)",
            color: "var(--text-primary)",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Task Management
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--primary-color)",
              color: "var(--text-primary)",
              "&:hover": { backgroundColor: "var(--hover-color)" },

              mr: 2,
            }}
            onClick={() => setView("assignTask")}
          >
            Assign New Task
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--secondary-color)",
              color: "var(--text-primary)",
              "&:hover": {
                backgroundColor: "var(--hover-color)",
                mr: 2,
              },
            }}
            onClick={() => setView("taskList")}
          >
            View All Tasks
          </Button>
        </Paper>
      </Box>
      {view === "assignTask" && (
        <TaskAssignmentForm
          onSubmit={handleTaskAssignment}
          employees={employees}
        />
      )}
      {view === "taskList" && (
        <TaskList
          tasks={tasks}
          isAdmin={true}
          onFileDownload={handleFileDownload}
        />
      )}
    </Container>
  );
};

export default AdminTaskManagement;
