import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { leaveRequestService } from "../../services/LeaveRequestService";
import { EmployeeService } from "../../services/EmployeeService";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const LeaveRequestList = () => {
  const auth = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employeeNames, setEmployeeNames] = useState({});
  const employeeService = new EmployeeService();

  useEffect(() => {
    if (auth?.authorized) {
      loadLeaveRequests();
    }
  }, [auth?.userId, auth?.userRole]);

  const loadLeaveRequests = async () => {
    try {
      setLoading(true);
      const requests =
        auth?.userRole === "admin"
          ? await leaveRequestService.getAllLeaveRequests()
          : await leaveRequestService.getUserLeaveRequests(auth?.userId);
      setLeaveRequests(requests);
    } catch (error) {
      console.error("Failed to load leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const userIds = leaveRequests.map((request) => request.userId);
      const names = {};
      for (const userId of userIds) {
        const name = await employeeService.getEmployeeFullNameByUserId(userId);
        names[userId] = name;
      }
      setEmployeeNames(names);
    };

    if (leaveRequests.length > 0) {
      fetchEmployeeNames();
    }
  }, [leaveRequests]);

  const handleStatusUpdate = async (leaveId, newStatus) => {
    try {
      setLoading(true);
      await leaveRequestService.updateLeaveStatus(leaveId, newStatus);
      await loadLeaveRequests(); // Reload the list after update
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!auth?.authorized) {
    return null;
  }

  if (loading) {
    return <div>Loading leave requests...</div>;
  }

  const isAdmin = auth?.userRole === "admin";

  const tableCss = {
    fontWeight: "bold",
    backgroundColor: "var(--table-header-bg)",
    color: "var(--text-primary)",
    borderBottom: "1px solid var(--table-border)",
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: "var(--table-background)",
        boxShadow: "0px 2px 4px -1px var(--divider-color)",
        mt: 5,
      }}
    >
      <Table sx={{ minWidth: 650 }} aria-label="leave requests table">
        <TableHead>
          <TableRow>
            {isAdmin && <TableCell sx={tableCss}>Employee Name</TableCell>}
            <TableCell sx={tableCss}>Leave Type</TableCell>
            <TableCell sx={tableCss}>Start Date</TableCell>
            <TableCell sx={tableCss}>End Date</TableCell>
            <TableCell sx={tableCss}>Status</TableCell>
            {isAdmin && <TableCell sx={tableCss}>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow
              key={request.leaveId}
              sx={{
                "&:hover": {
                  backgroundColor: "var(--table-hover)",
                },
                "& td": {
                  color: "var(--text-primary)",
                  borderBottom: "1px solid var(--table-border)",
                },
              }}
            >
              {isAdmin && (
                <TableCell>
                  {employeeNames[request.userId] || "Loading..."}
                </TableCell>
              )}
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>
                {new Date(request.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(request.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  style={{
                    color:
                      request.status === "APPROVED"
                        ? "var(--success-color, #4caf50)"
                        : request.status === "REJECTED"
                        ? "var(--error-color, #f44336)"
                        : "var(--warning-color, #ff9800)",
                  }}
                >
                  {request.status}
                </span>
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <Button
                    variant="contained"
                    sx={{
                      mr: 1,
                      backgroundColor: "var(--success-color, #4caf50)",
                      "&:hover": {
                        backgroundColor: "var(--success-hover-color, #45a049)",
                      },
                      "&:disabled": {
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                      },
                    }}
                    onClick={() =>
                      handleStatusUpdate(request.leaveId, "APPROVED")
                    }
                    disabled={
                      request.status === "APPROVED" ||
                      request.status === "REJECTED"
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "var(--error-color, #f44336)",
                      "&:hover": {
                        backgroundColor: "var(--error-hover-color, #d32f2f)",
                      },
                      "&:disabled": {
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                      },
                    }}
                    onClick={() =>
                      handleStatusUpdate(request.leaveId, "REJECTED")
                    }
                    disabled={
                      request.status === "APPROVED" ||
                      request.status === "REJECTED"
                    }
                  >
                    Reject
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
