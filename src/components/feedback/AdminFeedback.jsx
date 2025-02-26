import React, { useEffect, useState } from "react";
import { FeedbackService } from "../../services/FeedbackService";
import { EmployeeService } from "../../services/EmployeeService";
import Feedback from "../../models/feedback.model";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState({});
  const feedbackService = new FeedbackService();
  const employeeService = new EmployeeService();

  useEffect(() => {
    feedbackService.getAllFeedbacks().then((data) => {
      const feedbackObjects = data.map((item) => Feedback.fromJson(item));
      setFeedbacks(feedbackObjects);

      const employeeIds = [
        ...new Set(feedbackObjects.map((f) => f.employeeId)),
      ];
      employeeIds.forEach(async (id) => {
        const employee = await employeeService.getEmployeeById(id);
        const fullName = await employeeService.getEmployeeFullNameByUserId(
          employee.userId
        );
        setEmployeeDetails((prev) => ({
          ...prev,
          [id]: {
            name: employee.name,
            fullName: fullName,
          },
        }));
      });
    });
  }, []);

  return (
    <div className="container">
      <Typography variant="h4" sx={{ color: "var(--text-primary)", mb: 3 }}>
        Admin Feedback
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          bgcolor: "var(--paper-bg)",
          "& .MuiTableCell-root": { color: "var(--text-primary)" },
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "var(--table-header-bg)" }}>
              <TableCell>ID</TableCell>
              <TableCell>Employee ID</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback) => (
              <TableRow
                key={feedback.feedbackId}
                sx={{
                  "&:hover": { bgcolor: "var(--table-hover)" },
                  borderBottom: `1px solid var(--table-border)`,
                }}
              >
                <TableCell>{feedback.feedbackId}</TableCell>
                <TableCell>{feedback.employeeId}</TableCell>
                <TableCell>
                  {employeeDetails[feedback.employeeId]?.fullName ||
                    "Loading..."}
                </TableCell>
                <TableCell>{feedback.title}</TableCell>
                <TableCell>{feedback.content}</TableCell>
                <TableCell>
                  {new Date(feedback.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminFeedback;
